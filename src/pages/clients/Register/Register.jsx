import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../context/AuthContext";
import "../Login/Login.css";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // États pour basculer la visibilité des mots de passe
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Pop-up personnalisée
  const [toastData, setToastData] = useState(null);

  const showCustomToast = (title, message) => {
    setToastData({ title, message });
    setTimeout(() => {
      setToastData(null);
    }, 3000);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation des mots de passe (le serveur revalide de toute façon)
    if (password !== confirmPassword) {
      showCustomToast("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 8) {
      showCustomToast(
        "Erreur",
        "Le mot de passe doit contenir au moins 8 caractères.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await register(fullName, email, password);
      showCustomToast("Succès", "Compte créé avec succès ! Redirection...");

      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      showCustomToast(
        "Erreur",
        error.errors?.[0] || error.message || "Impossible de créer le compte.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page-wrapper page-transition">
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
                showCustomToast(
                  "Bientôt disponible",
                  "L'inscription via Google n'est pas encore activée.",
                )
              }
            >
              Google
            </button>
            <button
              type="button"
              className="social-btn"
              onClick={() =>
                showCustomToast(
                  "Bientôt disponible",
                  "L'inscription via Apple n'est pas encore activée.",
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

      {/* Pop-up Toast de Notification */}
      {toastData && (
        <div className="shopflow-toast-popup">
          <div className="toast-icon-wrapper">
            <FontAwesomeIcon icon={faCircleInfo} />
          </div>
          <div className="toast-text-content">
            <strong>{toastData.title}</strong>
            <p>{toastData.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
