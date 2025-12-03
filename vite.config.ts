import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: process.env.GITHUB_ACTIONS ? '/Blog-Website/' : '/',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler', {}]],
        },
      }),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'M-F-Tushar Blog',
          short_name: 'TusharBlog',
          description: 'Personal tech blog covering web development, AI, and software engineering.',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            // Image caching
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
              },
            },
            // API caching with network-first strategy
            // Note: Update pattern for your specific backend/database provider
            {
              urlPattern: /^https:\/\/.*supabase.*\/rest\/v1\/.*/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 5, // 5 minutes
                },
                networkTimeoutSeconds: 10,
              },
            },
            // Static assets caching
            {
              urlPattern: /\.(?:js|css)$/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-resources',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
          ],
          // Precache critical assets
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        },
      }),
      viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
      }),
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
      }),
      visualizer({ open: true, gzipSize: true }),
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@supabase/supabase-js',
        '@supabase/postgrest-js',
        '@supabase/realtime-js',
        '@supabase/storage-js',
        '@supabase/functions-js',
      ],
    },
    build: {
      rollupOptions: {
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
        },
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            supabase: ['@supabase/supabase-js'],
            ui: ['framer-motion', 'lucide-react'],
            // Enhanced code splitting for better bundle optimization
            markdown: [
              'react-markdown',
              'remark-gfm',
              'remark-math',
              'rehype-highlight',
              'rehype-katex',
              'rehype-slug',
              'rehype-autolink-headings',
              'rehype-raw',
              'remark-directive',
            ],
            charts: ['mermaid'],
            math: ['katex'],
            lightbox: ['yet-another-react-lightbox'],
          },
        },
      },
      chunkSizeWarningLimit: 500, // Warn if chunk exceeds 500KB
      reportCompressedSize: true,
      // Performance budgets
      assetsInlineLimit: 4096, // Inline assets < 4KB
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
      // Add source map for production debugging
      sourcemap: 'hidden',
    },
  };
});
