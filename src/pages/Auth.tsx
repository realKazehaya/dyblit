import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../lib/auth';
import { authenticateWithDiscord } from '../lib/api';

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
      const handleAuth = async () => {
        try {
          console.log('Starting authentication process...');
          const { user } = await authenticateWithDiscord(code);
          
          if (!user) {
            throw new Error('No user data received');
          }

          console.log('Authentication successful');
          setUser({
            id: user.id,
            discord_id: user.user_metadata.discord_id,
            username: user.user_metadata.username,
            avatar_url: user.user_metadata.avatar_url,
            diamonds_balance: 0,
            created_at: user.created_at,
          });

          navigate('/dashboard');
        } catch (error) {
          console.error('Authentication error:', error);
          setError(error instanceof Error ? error.message : 'An error occurred during authentication');
          setTimeout(() => navigate('/'), 3000);
        }
      };

      handleAuth();
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