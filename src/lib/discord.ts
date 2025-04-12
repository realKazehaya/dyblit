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
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_DISCORD_REDIRECT_URI;
    
    if (!clientId || !redirectUri) {
      console.error('Missing Discord configuration');
      set({ error: 'Discord configuration is missing' });
      return;
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'identify email',
    });

    const url = `https://discord.com/oauth2/authorize?${params.toString()}`;
    window.location.href = url;
  },
}));