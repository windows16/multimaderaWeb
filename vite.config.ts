import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt'],
      manifest: {
        name: 'Multimadera',
        short_name: 'Multimadera',
        description: 'App Multimadera',
        theme_color: '#ffffff',
        background_color: '#ffffff',    
        start_url: '/',
        display: 'standalone',
        icons: [
          {
            src: 'multi-icon-192.maskable.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'multi-icon-512.maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'     
          }
        ]
      },
      workbox: {                        
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/apimultimaderav1\.onrender\.com\/.*/i,
            handler: 'NetworkFirst',         // API: red primero, caché de respaldo
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24  // 24 horas
              }
            }
          }
        ]
      }
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: ['.trycloudflare.com']
  }
})