import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/collectibles-shop/', // Название твоего репозитория на GitHub
  server: { port: 5173, open: true },
});
