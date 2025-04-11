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
    const baseUrl = import.meta.env.PROD 
      ? 'https://dyblit.netlify.app'
      : 'http://localhost:8888';
    
    window.location.href = `${baseUrl}/api/discord-auth`;
  },
}));