import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminProtectedRoute({ children }) {
  const { isAdmin, isLoading } = useAuth();

  // Tant que la vérification de session est en cours, on n'affiche rien
  // plutôt que de rediriger trop tôt vers /login.
  if (isLoading) return null;

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
