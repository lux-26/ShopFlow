const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const productionApiUrl = "https://shopflow-0agy.onrender.com/api";

// En développement, Vite redirige /api vers le serveur Express local.
// En production, VITE_API_URL doit contenir l'URL publique de l'API.
export const API_BASE_URL = (
  configuredApiUrl ||
  (import.meta.env.PROD ? productionApiUrl : "/api")
).replace(/\/+$/, "");

export function getAssetUrl(assetPath) {
  if (
    !assetPath ||
    assetPath.startsWith("data:") ||
    assetPath.startsWith("blob:") ||
    /^https?:\/\//i.test(assetPath)
  ) {
    return assetPath;
  }

  if (/^https?:\/\//i.test(API_BASE_URL)) {
    return new URL(assetPath, API_BASE_URL).toString();
  }

  return assetPath;
}
