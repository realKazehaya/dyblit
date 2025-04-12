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
    
    if (code) {
      const authenticateWithDiscord = async () => {
        try {
          const response = await fetch('/.netlify/functions/discord-auth', {
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
          
          // Update user in Supabase
          const { data: authData, error: authError } = await supabase.auth.signInWithIdToken({
            provider: 'discord',
            token: data.access_token,
          });

          if (authError) throw authError;

          if (authData.user) {
            setUser({
              id: authData.user.id,
              discord_id: authData.user.user_metadata.discord_id,
              username: authData.user.user_metadata.username,
              avatar_url: authData.user.user_metadata.avatar_url,
              diamonds_balance: 0,
              created_at: authData.user.created_at,
            });
            navigate('/dashboard');
          }
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