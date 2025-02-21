import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/codespaces-react/', // 设置为仓库名称，确保 GitHub Pages 子路径部署正确
  build: {
    rollupOptions: {
      output: {
        // 使用 manualChunks 将第三方库分离到单独的 chunk 中
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // 提高 chunk 大小警告阈值为 1000 KB
  },
});