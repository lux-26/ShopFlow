import { useState } from "react";
import ReactDOM from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCircleCheck,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../context/AuthContext";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // États pour les notifications Toast professionnelles
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({
    title: "",
    message: "",
    type: "success",
  });

  const triggerPopup = (title, message, type = "success") => {
    setPopupData({ title, message, type });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      triggerPopup("Erreur", "Veuillez remplir tous les champs.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login(email, password, rememberMe);

      triggerPopup(
        "Succès",
        "Connexion réussie ! Bon retour parmi nous.",
        "success",
      );

      // Un administrateur est redirigé vers le back-office, un client vers son profil.
      setTimeout(() => {
        navigate(user.role === "ADMIN" ? "/admin" : "/profile");
      }, 1200);
    } catch (error) {
      triggerPopup(
        "Erreur",
        error.message || "Adresse e-mail ou mot de passe incorrect.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // OAuth nécessite des identifiants propres à chaque environnement.
    triggerPopup(
      "Bientôt disponible",
      `La connexion avec ${provider} n'est pas encore activée. Utilisez votre e-mail et mot de passe pour l'instant.`,
      "error",
    );
  };

  return (
    <div className="login-page-wrapper page-transition">
      <header className="login-topbar">
        <Link to="/" className="login-brand" aria-label="Retour à l'accueil">
          <span className="login-brand-mark">S</span>
          <span>hopFlow</span>
        </Link>
        <p>
          Nouveau sur ShopFlow ? <Link to="/register">Créer un compte</Link>
        </p>
      </header>
      <div className="login-decoration login-decoration-one" />
      <div className="login-decoration login-decoration-two" />
      {/* Toast de notification moderne et élégant injecté via Portal avec la couleur verte pour le succès */}
      {showPopup &&
        ReactDOM.createPortal(
          <div
            className="custom-toast-notification"
            style={{
              borderLeftColor:
                popupData.type === "error" ? "#dc2626" : "#10b981",
            }}
          >
            <div
              className="toast-icon-wrapper"
              style={{
                color: popupData.type === "error" ? "#dc2626" : "#10b981",
              }}
            >
              <FontAwesomeIcon
                icon={
                  popupData.type === "error"
                    ? faCircleExclamation
                    : faCircleCheck
                }
              />
            </div>
            <div className="toast-content">
              <span className="toast-title">{popupData.title}</span>
              <p className="toast-message">{popupData.message}</p>
            </div>
          </div>,
          document.body,
        )}

      <main className="login-main-container">
        <div className="login-card">
          <div className="login-card-header">
            <div className="mini-logo-box">Espace sécurisé</div>
            <h1>Bon retour parmi nous</h1>
            <p>Retrouvez vos commandes, vos favoris et bien plus.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="login-form">
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

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password">Mot de passe</label>
                <Link to="/forgot-password" className="forgot-password-link">
                  Mot de passe oublié ?
                </Link>
              </div>
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

            <div className="form-checkbox-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Se souvenir de moi</span>
              </label>
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="divider">
            <span>OU CONTINUER AVEC</span>
          </div>

          <div className="social-login-row">
            <button
              type="button"
              className="social-btn"
              onClick={() => handleSocialLogin("Google")}
            >
              Google
            </button>
            <button
              type="button"
              className="social-btn"
              onClick={() => handleSocialLogin("Apple")}
            >
              Apple
            </button>
          </div>

          <p className="login-security-note">
            Vos données sont protégées et vos échanges sont sécurisés.
          </p>
        </div>
      </main>
    </div>
  );
}
