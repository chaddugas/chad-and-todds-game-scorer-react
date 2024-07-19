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
          'favicon.ico',
          'robots.txt',
          'favicon.svg',
          'apple-touch-icon.png',
        ],
        manifest: {
          name: "Chad and Todd's Game Scorer",
          short_name: 'Game Scorer',
          description: 'An app to score our daily word games.',
          theme_color: '#242424',
          background_color: '#242424',
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
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'safari-pinned-tab.svg',
              sizes: '512x512',
              type: 'image/svg',
              purpose: 'maskable',
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
