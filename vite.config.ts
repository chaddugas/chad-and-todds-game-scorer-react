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
          'favicons/favicon.ico',
          'favicons/apple-touch-icon.png',
        ],
        manifest: {
          name: "Chad and Todd's Game Scorer",
          short_name: 'Game Scorer',
          description: 'An app to score games offline',
          theme_color: 'auto',
          icons: [
            {
              src: 'favicons/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'favicons/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
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
