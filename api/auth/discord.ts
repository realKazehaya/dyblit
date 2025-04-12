import type { VercelRequest, VercelResponse } from '@vercel/node';
import { OAuth2Client } from 'discord-oauth2';
import { createClient } from '@supabase/supabase-js';

const oauth = new OAuth2Client({
  clientId: process.env.VITE_DISCORD_CLIENT_ID!,
  clientSecret: process.env.DISCORD_CLIENT_SECRET!,
  redirectUri: process.env.VITE_DISCORD_REDIRECT_URI!,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  try {
    const tokens = await oauth.tokenRequest({
      code,
      scope: 'identify email',
      grantType: 'authorization_code',
    });

    const userData = await oauth.getUser(tokens.access_token);

    const supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.VITE_SUPABASE_ANON_KEY!
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
          avatar_url: userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : null,
          diamonds_balance: 0,
        });

      if (createError) {
        console.error('Error creating user:', createError);
        throw createError;
      }
    }

    return res.status(200).json({
      access_token: tokens.access_token,
      user: userData,
    });
  } catch (error) {
    console.error('Discord auth error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
}