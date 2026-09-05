// Client API partagé — source unique pour parler au backend Express.
// Toutes les requêtes passent par ici : ça centralise la base URL, l'envoi
// du cookie de session (credentials: "include") et la gestion des erreurs.

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * Effectue un appel à l'API et retourne le JSON de la réponse.
 * Lève une erreur (avec .status et .errors si fournis par le serveur)
 * si la réponse n'est pas OK, pour que les appelants puissent l'attraper
 * avec un simple try/catch.
 */
async function request(path, { method = "GET", body, headers } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: "include", // indispensable : envoie/reçoit le cookie de session
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Les réponses 204 (No Content, ex: logout) n'ont pas de corps JSON à lire.
  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || "Une erreur est survenue.");
    error.status = response.status;
    error.errors = data?.errors;
    throw error;
  }

  return data;
}

export const apiClient = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  delete: (path) => request(path, { method: "DELETE" }),
};

export default apiClient;
