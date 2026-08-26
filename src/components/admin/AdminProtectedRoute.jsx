import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  // Simulation de vérification d'authentification et du rôle administrateur
  // Vous pouvez remplacer cette logique par votre state global, Context ou localStorage
  const isAuthenticated = true;
  const isAdmin = true;

  if (!isAuthenticated || !isAdmin) {
    // Redirection vers la page de connexion si non autorisé
    return <Navigate to="/logout" replace />;
  }

  return children;
}
