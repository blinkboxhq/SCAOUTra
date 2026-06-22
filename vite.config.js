import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        web:  resolve(__dirname, 'web/index.html'),
      },
      output: {
        manualChunks: { three: ['three'] },
      },
    },
  },
});
