import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    rollupOptions: {
      external: ['discord-oauth2'],
      output: {
        globals: {
          'discord-oauth2': 'DiscordOAuth2'
        }
      }
    }
  }
});