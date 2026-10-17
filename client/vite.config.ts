import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // In dev, forward /api to the Hono server on :8787.
      '/api': 'http://localhost:8787',
    },
  },
});
