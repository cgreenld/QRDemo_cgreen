import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Set VITE_BASE=/your-repo/ when using GitHub Project Pages, or leave as /
  base: process.env.VITE_BASE || '/',
});
