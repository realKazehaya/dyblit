import { supabase } from './supabase';

export async function authenticateWithDiscord(code: string) {
  try {
    console.log('Authenticating with Discord...');
    
    // Sign in with Supabase using Discord OAuth
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        queryParams: {
          code,
          grant_type: 'authorization_code',
        },
      },
    });

    if (error) {
      console.error('Supabase auth error:', error);
      throw error;
    }

    if (!data.user) {
      throw new Error('No user data received from authentication');
    }

    // Check if user exists in our database
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select()
      .eq('discord_id', data.user.user_metadata.discord_id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching user:', fetchError);
      throw fetchError;
    }

    if (!existingUser) {
      console.log('Creating new user...');
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          discord_id: data.user.user_metadata.discord_id,
          username: data.user.user_metadata.username,
          avatar_url: data.user.user_metadata.avatar_url,
          diamonds_balance: 0,
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        throw createError;
      }

      return { user: data.user, session: data.session };
    }

    return { user: data.user, session: data.session };
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}