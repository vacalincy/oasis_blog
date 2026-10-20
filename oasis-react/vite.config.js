import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { browserslistToTargets } from 'lightningcss'
import browserslist from 'browserslist'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  css: {
    lightningcss: {
      targets: browserslistToTargets(browserslist('defaults, safari >= 13, chrome >= 80'))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@supabase')) return 'supabase';
            if (id.includes('react-datepicker') || id.includes('date-fns')) return 'datepicker';
            return 'vendor';
          }
        }
      }
    }
  }
})
