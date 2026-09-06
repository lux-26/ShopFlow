export function notFoundHandler(request, response) {
  return response
    .status(404)
    .json({ message: `Route introuvable : ${request.method} ${request.path}` });
}

export function errorHandler(error, request, response, next) {
  console.error(error);

  if (response.headersSent) {
    return next(error);
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || "valeur";
    const fieldLabels = { email: "adresse e-mail", sku: "SKU" };
    const label = fieldLabels[field] || field;
    return response
      .status(409)
      .json({ message: `Cette ${label} est déjà utilisée.` });
  }

  // Erreurs multer (upload de fichier) : message clair plutôt qu'un 500 générique.
  if (
    error.name === "MulterError" ||
    error.message?.includes("Format d'image")
  ) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "L'image dépasse la taille maximale autorisée (5 Mo)."
        : error.message;
    return response.status(400).json({ message });
  }

  return response.status(error.statusCode || 500).json({
    message: error.statusCode
      ? error.message
      : "Une erreur interne est survenue.",
  });
}
