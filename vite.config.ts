import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['discord-oauth2'],
    exclude: ['lucide-react'],
    esbuildOptions: {
      target: 'es2020',
    }
  },
  build: {
    target: 'es2020',
    commonjsOptions: {
      include: [/discord-oauth2/, /node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'discord-oauth2': ['discord-oauth2']
        }
      }
    }
  },
  resolve: {
    alias: {
      'node-fetch': 'isomorphic-fetch'
    }
  }
});