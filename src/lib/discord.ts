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
    try {
      const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
      const redirectUri = import.meta.env.VITE_DISCORD_REDIRECT_URI;
      
      console.log('Discord Auth Config:', {
        clientId: clientId ? 'Present' : 'Missing',
        redirectUri: redirectUri ? 'Present' : 'Missing'
      });
      
      if (!clientId || !redirectUri) {
        const error = 'Missing Discord configuration';
        console.error(error, { clientId, redirectUri });
        set({ error });
        return;
      }

      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'identify email guilds',
      });

      const url = `https://discord.com/oauth2/authorize?${params.toString()}`;
      console.log('Redirecting to Discord:', url);
      window.location.href = url;
    } catch (error) {
      console.error('Discord login error:', error);
      set({ error: 'Failed to initialize Discord login' });
    }
  },
}));