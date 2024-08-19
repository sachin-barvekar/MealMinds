import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4000', // Change to IPv4 (127.0.0.1)
        secure: false,
      },
    },
  },
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 10000,
  },
});


