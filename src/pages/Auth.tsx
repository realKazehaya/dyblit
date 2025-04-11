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
    const session = searchParams.get('session');
    const error = searchParams.get('error');

    if (session) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            discord_id: session.user.user_metadata.discord_id,
            username: session.user.user_metadata.username,
            avatar_url: session.user.user_metadata.avatar_url,
            diamonds_balance: 0,
            created_at: session.user.created_at,
          });
          navigate('/dashboard');
        }
      });
    }
  }, [searchParams, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-300">Authenticating with Discord...</p>
      </motion.div>
    </div>
  );
};

export default Auth;