import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';
import imagemin from 'vite-plugin-imagemin';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';


export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(), 
    compression({ verbose: false, algorithm: 'brotliCompress' }), 
    imagemin({
      gifsicle: { optimizationLevel: 3 },
      optipng: { optimizationLevel: 3 },
      mozjpeg: { quality: 80 },
      webp: { quality: 80 },
    }),
    visualizer({ filename: 'artifacts/bundle-visualizer.html', open: false }),

    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.svg', 'robots.txt'],
      manifest: {
        name: 'Seyhan Proje Portalı',
        short_name: 'Seyhan Proje',
        description: 'Seyhan Belediyesi Yapay Zeka Destekli Proje Portalı',
        theme_color: '#004B91',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'logo.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'logo.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
            {
                name: "Masaüstü",
                short_name: "Ana Sayfa",
                description: "Proje Portalı Ana Sayfası",
                url: "/",
                icons: [{ src: "logo.svg", sizes: "192x192" }]
            },
            {
                name: "Profilim",
                short_name: "Profil",
                description: "Kullanıcı Profili",
                url: "/profile",
                icons: [{ src: "logo.svg", sizes: "192x192" }]
            }
        ]
      }
    })
  ],
  build: {
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['framer-motion', 'lucide-react'],
          'vendor-data': ['zustand', '@supabase/supabase-js'],
          'vendor-maps': ['leaflet', 'react-leaflet', 'use-supercluster', 'supercluster'],
          'vendor-list': ['react-window', 'react-virtualized-auto-sizer'],
          'vendor-utils': ['mathjs', 'i18next', 'react-i18next'],
          'vendor-ai': ['ai', '@ai-sdk/react'],
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
