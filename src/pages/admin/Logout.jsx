import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";

export default function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Cette page affiche une confirmation, mais la vraie déconnexion
  // (suppression du cookie de session côté serveur) se fait ici.
  useEffect(() => {
    logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        minHeight: "75vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        padding: "2rem",
      }}
      className="page-transition"
    >
      {/* Carte de déconnexion */}
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "2.5rem 2rem",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
          textAlign: "center",
          maxWidth: "460px",
          width: "100%",
          borderTop: "4px solid #1e3a8a",
        }}
      >
        {/* Icône de déconnexion */}
        <div
          style={{
            width: "60px",
            height: "60px",
            backgroundColor: "#eff6ff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem auto",
            color: "#1e3a8a",
            fontSize: "1.5rem",
          }}
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
        </div>

        {/* Titre et message */}
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#0f172a",
            marginBottom: "0.75rem",
          }}
        >
          Déconnexion réussie
        </h2>
        <p
          style={{
            fontSize: "0.95rem",
            color: "#64748b",
            lineHeight: "1.5",
            marginBottom: "2rem",
          }}
        >
          Merci de votre visite sur ShopFlow. Vous avez été déconnecté en toute
          sécurité. À bientôt !
        </p>

        {/* Bouton Se reconnecter */}
        <button
          onClick={() => navigate("/login")}
          className="btn btn-primary-dark"
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1rem",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
            backgroundColor: "#1e3a8a",
            color: "#ffffff",
            border: "none",
            display: "flex", // <-- Force le mode flexbox
            justifyContent: "center", // <-- Centre horizontalement
            alignItems: "center", // <-- Centre verticalement
          }}
        >
          Se reconnecter
        </button>

        {/* Bouton Retourner à la boutique */}
        <button
          onClick={() => navigate("/")}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
            backgroundColor: "transparent",
            color: "#1e3a8a",
            border: "1px solid #cbd5e1",
          }}
        >
          Retourner à la boutique
        </button>
      </div>
    </div>
  );
}
