import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { supabase } from './supabase';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      isAuthenticated: false,
      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-store',
    }
  )
);

// Initialize auth state from Supabase session
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    useAuthStore.getState().setUser({
      id: session.user.id,
      discord_id: session.user.user_metadata.discord_id,
      username: session.user.user_metadata.username,
      avatar_url: session.user.user_metadata.avatar_url,
      diamonds_balance: 0,
      created_at: session.user.created_at,
    });
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.getState().setUser(null);
  }
});