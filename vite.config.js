import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/codespaces-react/', // 设置 GitHub Pages 的路径
});