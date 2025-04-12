import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import DiscordOauth2 from 'discord-oauth2';

const oauth = new DiscordOauth2();

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  try {
    // Get Discord tokens
    const tokens = await oauth.tokenRequest({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      code,
      scope: 'identify email',
      grantType: 'authorization_code',
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    });

    // Get user info from Discord
    const userData = await oauth.getUser(tokens.access_token);

    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select()
      .eq('discord_id', userData.id)
      .single();

    if (!existingUser) {
      // Create new user
      const { error: createError } = await supabase
        .from('users')
        .insert({
          discord_id: userData.id,
          username: userData.username,
          avatar_url: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`,
          diamonds_balance: 0,
        });

      if (createError) throw createError;
    }

    // Create Supabase session
    const { data: authData, error: authError } = await supabase.auth.signInWithIdToken({
      provider: 'discord',
      token: tokens.access_token,
    });

    if (authError) throw authError;

    return res.status(200).json({
      access_token: tokens.access_token,
      user: authData.user,
    });
  } catch (error) {
    console.error('Discord auth error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
}