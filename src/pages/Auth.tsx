import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../lib/auth';
import { supabase } from '../lib/supabase';

const Auth = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        console.log('Checking session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }
        
        if (!session) {
          console.error('No session found');
          throw new Error('No session found');
        }

        console.log('Session found:', session);

        // Get user data from our database
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('discord_id', session.user.user_metadata.provider_id)
          .single();

        if (userError) {
          console.error('User data error:', userError);
          // Only throw if it's not a "no rows returned" error
          if (userError.code !== 'PGRST116') {
            throw userError;
          }
        }

        if (!userData) {
          console.log('Creating new user...');
          // Create new user if they don't exist
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
              discord_id: session.user.user_metadata.provider_id,
              username: session.user.user_metadata.full_name || session.user.user_metadata.custom_claims.global_name,
              avatar_url: session.user.user_metadata.avatar_url,
              diamonds_balance: 0,
            })
            .select()
            .single();

          if (createError) {
            console.error('User creation error:', createError);
            throw createError;
          }
          
          console.log('New user created:', newUser);
          setUser(newUser);
        } else {
          console.log('Existing user found:', userData);
          setUser(userData);
        }

        navigate('/dashboard');
      } catch (error) {
        console.error('Authentication error:', error);
        setError(error instanceof Error ? error.message : 'Authentication failed');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleAuth();
  }, [navigate, setUser]);

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