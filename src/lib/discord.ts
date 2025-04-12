import { create } from 'zustand';
import { supabase } from './supabase';

interface DiscordState {
  isLoading: boolean;
  error: string | null;
  login: () => void;
}

export const useDiscordAuth = create<DiscordState>((set) => ({
  isLoading: false,
  error: null,
  login: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'identify email',
        }
      });

      if (error) throw error;
      
      if (!data.url) {
        throw new Error('No authentication URL received');
      }

      // Redirect to Discord OAuth
      window.location.href = data.url;
    } catch (error) {
      console.error('Discord login error:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to login' });
    } finally {
      set({ isLoading: false });
    }
  },
}));