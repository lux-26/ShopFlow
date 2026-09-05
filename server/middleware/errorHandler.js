export function notFoundHandler(request, response) {
  return response.status(404).json({ message: `Route introuvable : ${request.method} ${request.path}` });
}

export function errorHandler(error, request, response, next) {
  console.error(error);

  if (response.headersSent) {
    return next(error);
  }

  if (error.code === 11000) {
    return response.status(409).json({ message: "Cette adresse e-mail est déjà utilisée." });
  }

  return response.status(error.statusCode || 500).json({
    message: error.statusCode ? error.message : "Une erreur interne est survenue.",
  });
}
