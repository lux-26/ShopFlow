const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

// En développement, Vite redirige /api vers le serveur Express local.
// En production, VITE_API_URL doit contenir l'URL publique de l'API.
export const API_BASE_URL = (configuredApiUrl || "/api").replace(/\/+$/, "");
