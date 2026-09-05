import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Toutes les requêtes du front vers /api/... sont transmises au serveur
      // Express (port 5000 par défaut). Ça évite les soucis de CORS/cookies
      // en développement, sans changer une ligne de code applicatif.
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
