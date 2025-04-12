import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.dyblit.com';

export async function authenticateWithDiscord(code: string) {
  try {
    const response = await fetch(`${API_URL}/auth/discord`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();

    // Sign in with Supabase using the Discord token
    const { data: authData, error: authError } = await supabase.auth.signInWithIdToken({
      provider: 'discord',
      token: data.access_token,
    });

    if (authError) throw authError;

    return {
      user: authData.user,
      session: authData.session,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}