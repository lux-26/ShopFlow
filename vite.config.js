import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Toutes les requêtes du front vers /api/... et /uploads/... sont
      // transmises au serveur Express (port 5000 par défaut). Ça évite les
      // soucis de CORS/cookies en développement, sans changer une ligne de
      // code applicatif, et permet d'afficher les images produits uploadées.
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
