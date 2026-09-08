import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faArrowLeft,
  faCheckCircle,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import apiClient from "../../../utils/apiClient";
import "../ForgotPassword/ForgotPassword.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 8) {
      setErrorMessage("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post("/auth/reset-password", { token, password });
      setIsSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setErrorMessage(
        error.message || "Impossible de réinitialiser le mot de passe.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="forgot-page-wrapper page-transition">
        <main className="forgot-main-container">
          <div className="forgot-card">
            <div className="forgot-card-header">
              <div className="mini-logo-box">ShopFlow</div>
              <h1>Lien invalide</h1>
              <p>
                Ce lien de réinitialisation est incomplet ou invalide.
                Redemandez-en un nouveau.
              </p>
            </div>
            <div className="back-to-login">
              <Link to="/forgot-password">
                <FontAwesomeIcon icon={faArrowLeft} /> Redemander un lien
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="forgot-page-wrapper page-transition">
      <main className="forgot-main-container">
        <div className="forgot-card">
          <div className="forgot-card-header">
            <div className="mini-logo-box">ShopFlow</div>
            <h1>Nouveau mot de passe</h1>
            <p>
              {!isSuccess
                ? "Choisissez un nouveau mot de passe pour votre compte."
                : "Votre mot de passe a été réinitialisé avec succès !"}
            </p>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="forgot-form">
              <div className="form-group">
                <label htmlFor="password">Nouveau mot de passe</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Au moins 8 caractères"
                    required
                  />
                  <span
                    className="input-icon"
                    style={{ left: "auto", right: "14px", cursor: "pointer" }}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  Confirmer le mot de passe
                </label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Retapez le mot de passe"
                    required
                  />
                </div>
              </div>

              {errorMessage && (
                <p style={{ color: "#dc2626", fontSize: "0.9rem" }}>
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Réinitialisation..."
                  : "Réinitialiser le mot de passe"}
              </button>
            </form>
          ) : (
            <div className="success-state">
              <div className="success-icon">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
              <p className="success-message">
                Redirection vers la page de connexion...
              </p>
            </div>
          )}

          <div className="back-to-login">
            <Link to="/login">
              <FontAwesomeIcon icon={faArrowLeft} /> Retour à la connexion
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
