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
  login: () => {
    window.location.href = '/.netlify/functions/discord-auth';
  },
}));