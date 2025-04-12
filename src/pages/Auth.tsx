import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../lib/auth';
import { supabase } from '../lib/supabase';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('Discord auth error:', error);
      navigate('/');
      return;
    }

    if (code) {
      const authenticateWithDiscord = async () => {
        try {
          // First, exchange the code for Discord tokens
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
            throw new Error('Failed to exchange code for token');
          }

          const tokens = await response.json();

          // Get user info from Discord
          const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
            },
          });

          if (!userResponse.ok) {
            throw new Error('Failed to get user info');
          }

          const discordUser = await userResponse.json();

          // Sign in with Supabase
          const { data: authData, error: signInError } = await supabase.auth.signInWithOAuth({
            provider: 'discord',
            options: {
              queryParams: {
                access_token: tokens.access_token,
                expires_in: tokens.expires_in,
              },
            },
          });

          if (signInError) throw signInError;

          // Check if user exists in our database
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select()
            .eq('discord_id', discordUser.id)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            throw fetchError;
          }

          if (!existingUser) {
            // Create new user
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

            if (createError) throw createError;

            setUser(newUser);
          } else {
            setUser(existingUser);
          }

          navigate('/dashboard');
        } catch (error) {
          console.error('Authentication error:', error);
          navigate('/');
        }
      };

      authenticateWithDiscord();
    }
  }, [searchParams, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-300">Authenticating with Discord...</p>
      </motion.div>
    </div>
  );
};

export default Auth;