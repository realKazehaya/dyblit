import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../lib/auth';
import { supabase } from '../lib/supabase';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    console.log('Auth Page Loaded:', {
      code: code ? 'Present' : 'Missing',
      error: errorParam || 'None'
    });

    if (errorParam) {
      console.error('Discord auth error from params:', errorParam);
      setError(`Authentication error: ${errorParam}`);
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    if (code) {
      const authenticateWithDiscord = async () => {
        try {
          console.log('Starting Discord authentication...');

          // Log environment variables presence
          console.log('Environment Check:', {
            clientId: import.meta.env.VITE_DISCORD_CLIENT_ID ? 'Present' : 'Missing',
            clientSecret: import.meta.env.DISCORD_CLIENT_SECRET ? 'Present' : 'Missing',
            redirectUri: import.meta.env.VITE_DISCORD_REDIRECT_URI ? 'Present' : 'Missing'
          });

          // First, exchange the code for Discord tokens
          console.log('Exchanging code for token...');
          const response = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
              client_secret: import.meta.env.DISCORD_CLIENT_SECRET,
              grant_type: 'authorization_code',
              code,
              redirect_uri: import.meta.env.VITE_DISCORD_REDIRECT_URI,
            }),
          });

          if (!response.ok) {
            const errorData = await response.text();
            console.error('Token exchange failed:', {
              status: response.status,
              statusText: response.statusText,
              error: errorData
            });
            throw new Error(`Failed to exchange code for token: ${response.statusText}`);
          }

          const tokens = await response.json();
          console.log('Token exchange successful');

          // Get user info from Discord
          console.log('Fetching Discord user info...');
          const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
            },
          });

          if (!userResponse.ok) {
            const errorData = await userResponse.text();
            console.error('User info fetch failed:', {
              status: userResponse.status,
              statusText: userResponse.statusText,
              error: errorData
            });
            throw new Error('Failed to get user info');
          }

          const discordUser = await userResponse.json();
          console.log('Discord user info retrieved');

          // Sign in with Supabase
          console.log('Signing in with Supabase...');
          const { data: authData, error: signInError } = await supabase.auth.signInWithOAuth({
            provider: 'discord',
            options: {
              queryParams: {
                access_token: tokens.access_token,
                expires_in: tokens.expires_in,
              },
            },
          });

          if (signInError) {
            console.error('Supabase sign in failed:', signInError);
            throw signInError;
          }

          // Check if user exists in our database
          console.log('Checking for existing user...');
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select()
            .eq('discord_id', discordUser.id)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('User fetch failed:', fetchError);
            throw fetchError;
          }

          if (!existingUser) {
            console.log('Creating new user...');
            const { data: newUser, error: createError } = await supabase
              .from('users')
              .insert({
                discord_id: discordUser.id,
                username: discordUser.username,
                avatar_url: discordUser.avatar 
                  ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png` 
                  : null,
                diamonds_balance: 0,
              })
              .select()
              .single();

            if (createError) {
              console.error('User creation failed:', createError);
              throw createError;
            }

            console.log('New user created');
            setUser(newUser);
          } else {
            console.log('Existing user found');
            setUser(existingUser);
          }

          console.log('Authentication successful, redirecting to dashboard...');
          navigate('/dashboard');
        } catch (error) {
          console.error('Authentication error:', error);
          setError(error instanceof Error ? error.message : 'An error occurred during authentication');
          setTimeout(() => navigate('/'), 3000);
        }
      };

      authenticateWithDiscord();
    } else {
      console.error('No code provided in URL');
      setError('No authentication code provided');
      setTimeout(() => navigate('/'), 3000);
    }
  }, [searchParams, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {error ? (
          <div className="text-red-500 mb-4">{error}</div>
        ) : (
          <>
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300">Authenticating with Discord...</p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Auth;