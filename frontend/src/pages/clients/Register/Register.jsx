import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import "../Login/Login.css";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // États pour basculer la visibilité des mots de passe
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation des mots de passe (le serveur revalide de toute façon)
    if (password !== confirmPassword) {
      showToast("Erreur", "Les mots de passe ne correspondent pas.", "error");
      return;
    }

    if (password.length < 8) {
      showToast(
        "Erreur",
        "Le mot de passe doit contenir au moins 8 caractères.",
        "error",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await register(fullName, email, password);
      showToast("Succès", "Compte créé avec succès ! Redirection...", "success");

      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      showToast(
        "Erreur",
        error.errors?.[0] || error.message || "Impossible de créer le compte.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page-wrapper page-transition">
      <header className="login-topbar">
        <Link to="/" className="login-brand" aria-label="Retour à l'accueil">
          <span className="login-brand-mark">S</span>
          <span>hopFlow</span>
        </Link>
        <p>
          Déjà inscrit ? <Link to="/login">Se connecter</Link>
        </p>
      </header>
      <div className="login-decoration login-decoration-one" />
      <div className="login-decoration login-decoration-two" />
      <main className="login-main-container">
        <div className="login-card">
          <div className="login-card-header">
            <div className="mini-logo-box">ShopFlow</div>
            <h1>Créer un compte</h1>
            <p>Rejoignez ShopFlow pour une expérience d'achat personnalisée.</p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="fullname">Nom complet</label>
              <input
                id="fullname"
                type="text"
                placeholder="Ablaye Tamba"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Adresse e-mail</label>
              <input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Champ Mot de passe avec bouton œil (Utilisation des classes CSS propres) */}
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Afficher ou masquer le mot de passe"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            {/* Champ Confirmer le mot de passe avec bouton œil */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <div className="password-input-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Afficher ou masquer la confirmation du mot de passe"
                >
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                  />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="submit-btn"
              style={{ marginTop: "16px" }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Création du compte..." : "S'inscrire"}
            </button>
          </form>

          <div className="divider">
            <span>OU CONTINUER AVEC</span>
          </div>

          <div className="social-login-row">
            <button
              type="button"
              className="social-btn"
              onClick={() =>
                showToast(
                  "Bientôt disponible",
                  "L'inscription via Google n'est pas encore activée.",
                  "info",
                )
              }
            >
              Google
            </button>
            <button
              type="button"
              className="social-btn"
              onClick={() =>
                showToast(
                  "Bientôt disponible",
                  "L'inscription via Apple n'est pas encore activée.",
                  "info",
                )
              }
            >
              Apple
            </button>
          </div>

          <p className="register-redirect-text">
            Vous avez déjà un compte ? <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </main>

    </div>
  );
}
