import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Tailwind v4 uses a Vite plugin instead of PostCSS
  ],
  build: {
    // Supabase JS is a large library — raise the warning threshold to avoid noise
    chunkSizeWarningLimit: 600,
  },
  server: {
    port: 5173,
    proxy: {
      // Any request starting with /api is forwarded to our Express server.
      // This means React can call fetch('/api/health') without CORS issues in dev.
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
