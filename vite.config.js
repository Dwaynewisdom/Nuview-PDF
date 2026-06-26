import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default function () {
  return defineConfig({
    // Added the missing trailing slash to fix the Vite build warning
    base: "/Nuview-PDF/",
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          // Splits pdf-lib and other node_modules into a separate vendor chunk
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      }
    }
  });
}