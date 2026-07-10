import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'bookingAdmin',
      filename: 'remoteEntry.js',
      // Host (skyresto-webman) consumes remotes via @module-federation/runtime's
      // init({ remotes: [{ name, entry }] }) without an explicit `type`, which expects
      // the classic global-var UMD container (same format the previous Next.js-based
      // remote produced) — not the plugin's default ESM `remoteEntry.js` output.
      varFilename: 'remoteEntry.var.js',
      exposes: {
        './ReservationsPage': './src/pages/ReservationsPage.tsx',
        './TablesPage': './src/pages/TablesPage.tsx',
      },
      shared: ['react', 'react-dom'],
      dts: false,
    }),
  ],
  build: {
    target: 'esnext',
  },
})
