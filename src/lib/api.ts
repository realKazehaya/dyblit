import { supabase } from './supabase';

export async function authenticateWithDiscord(code: string) {
  try {
    console.log('Starting Discord authentication process...');
    
    // Exchange the code for Discord tokens using our API endpoint
    const response = await fetch('/api/discord-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Discord auth error:', error);
      throw new Error(error.details || 'Failed to authenticate with Discord');
    }

    const { access_token, user: discordUser } = await response.json();

    // Sign in with Supabase using Discord ID as email
    const { data: authData, error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: window.location.origin,
      }
    });

    if (signInError) {
      console.error('Supabase sign in error:', signInError);
      throw signInError;
    }

    if (!authData.url) {
      throw new Error('No authentication URL received');
    }

    // Redirect to Supabase OAuth flow
    window.location.href = authData.url;
    return { user: null, session: null }; // The page will reload after OAuth

  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}