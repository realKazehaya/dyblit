import { create } from 'zustand';

interface DiscordState {
  isLoading: boolean;
  error: string | null;
  login: () => void;
}

export const useDiscordAuth = create<DiscordState>((set) => ({
  isLoading: false,
  error: null,
  login: () => {
    window.location.href = 'https://discord.com/oauth2/authorize?client_id=1360381434115915996&response_type=code&redirect_uri=https%3A%2F%2Fdyblit.vercel.app%2Fauth%2Fcallback&scope=identify+email';
  },
}));