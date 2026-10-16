import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures relative paths work on GitHub Pages
  server: {
    host: true, // Listen on all network addresses for mobile table play
    port: 5173,
  },
});
