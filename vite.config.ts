import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => {
  const localCertPath = path.resolve(__dirname, '192.168.3.45+2.pem');
  const localKeyPath = path.resolve(__dirname, '192.168.3.45+2-key.pem');

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'apple-touch-icon.png',
          'maskable-icon.png',
          'favicon-16x16.png',
          'favicon-32x32.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'robots.txt',
        ],
        manifest: {
          name: "Chad and Todd's Game Scorer",
          short_name: 'Game Scorer',
          description: 'An app to score our daily word games.',
          start_url: './',
          scope: 'https://chad-and-todds-game-scorer.netlify.app/',
          dir: 'ltr',
          display: 'standalone',
          orientation: 'portrait',
          lang: 'en',
          theme_color: '#242424',
          background_color: '#242424',
          icons: [
            {
              purpose: 'any',
              sizes: '192x192',
              src: '/pwa-192x192.png',
              type: 'image/png',
            },
            {
              purpose: 'any',
              sizes: '512x512',
              src: '/pwa-512x512.png',
              type: 'image/png',
            },
            {
              purpose: 'any',
              sizes: '180x180',
              src: '/apple-touch-icon.png',
              type: 'image/png',
            },
            {
              purpose: 'maskable',
              sizes: '1024x1024',
              src: '/maskable-icon.png',
              type: 'image/png',
            },
          ],
          screenshots: [
            {
              src: 'screenshot_desktop.webp',
              sizes: '1280x720',
              type: 'image/webp',
              form_factor: 'wide',
              label: 'Desktop view of the app',
            },
            {
              src: 'screenshot_mobile.webp',
              sizes: '450x720',
              type: 'image/webp',
              label: 'Mobile view of the app',
            },
          ],
        },
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif)/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                },
              },
            },
            {
              urlPattern: /.*\.(?:js|css)/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-resources',
              },
            },
          ],
        },
      }),
    ],
    ...(mode !== 'production' && {
      server: {
        host: '192.168.3.45',
        https: {
          key: fs.readFileSync(localKeyPath),
          cert: fs.readFileSync(localCertPath),
        },
      },
    }),
  };
});
