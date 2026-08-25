import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    // 1. Marquer l'utilisateur comme connecté dans le localStorage
    localStorage.setItem("shopflow_is_logged", "true");

    // 2. Définir des informations de profil par défaut si elles n'existent pas encore
    if (!localStorage.getItem("shopflow_user_avatar")) {
      localStorage.setItem(
        "shopflow_user_avatar",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      );
    }

    // 3. Notifier les autres composants du changement d'état
    window.dispatchEvent(new Event("storage"));

    // 4. Rediriger l'utilisateur vers son profil
    navigate("/profile");
  };

  return (
    <div className="login-page-wrapper">
      <main className="login-main-container">
        <div className="login-card">
          <div className="login-card-header">
            <div className="mini-logo-box">ShopFlow</div>
            <h1>Bon retour parmi nous</h1>
            <p>Connectez-vous pour accéder à votre compte ShopFlow.</p>
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

            <button type="submit" className="submit-btn">
              Se connecter
            </button>
          </form>

          <div className="divider">
            <span>OU CONTINUER AVEC</span>
          </div>

          <div className="social-login-row">
            <button
              type="button"
              className="social-btn"
              onClick={() => alert("Connexion Google simulée")}
            >
              Google
            </button>
            <button
              type="button"
              className="social-btn"
              onClick={() => alert("Connexion Apple simulée")}
            >
              Apple
            </button>
          </div>

          <p className="register-redirect-text">
            Pas encore de compte ? <Link to="/register">S'inscrire</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
