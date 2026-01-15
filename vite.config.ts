import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [react(), compression({ verbose: false })],
  build: {
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          zustand: ['zustand'],
          urql: ['urql'],
          three: ['three'],
          mathjs: ['mathjs']
        }
      }
    }
  },
  css: {
    postcss: {
      plugins: []
    }
  }
});
