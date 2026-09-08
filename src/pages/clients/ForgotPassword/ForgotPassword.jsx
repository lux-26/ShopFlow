import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faArrowLeft,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import apiClient from "../../../utils/apiClient";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [devResetLink, setDevResetLink] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const data = await apiClient.post("/auth/forgot-password", { email });
      setIsSubmitted(true);
      // Uniquement présent en développement, quand aucun service email
      // n'est configuré côté serveur (voir server/utils/email.js).
      setDevResetLink(data.devResetLink || null);
    } catch (error) {
      setErrorMessage(error.message || "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-page-wrapper page-transition">
      <main className="forgot-main-container">
        <div className="forgot-card">
          <div className="forgot-card-header">
            <div className="mini-logo-box">ShopFlow</div>
            <h1>Mot de passe oublié ?</h1>
            <p>
              {!isSubmitted
                ? "Entrez votre adresse e-mail associée à votre compte et nous vous enverrons un lien de réinitialisation."
                : "Si un compte existe avec cette adresse, un email vient de vous être envoyé."}
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="forgot-form">
              <div className="form-group">
                <label htmlFor="email">Adresse e-mail</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
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
                  ? "Envoi en cours..."
                  : "Envoyer le lien de réinitialisation"}
              </button>
            </form>
          ) : (
            <div className="success-state">
              <div className="success-icon">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
              <p className="success-message">
                Si un compte existe pour : <br />
                <strong>{email}</strong>
                <br />
                vous allez recevoir un email avec les instructions.
              </p>

              {devResetLink && (
                <p
                  className="simulation-note"
                  style={{ wordBreak: "break-all" }}
                >
                  (Mode développement : aucun service email n'est configuré.
                  Lien de test —{" "}
                  <a href={devResetLink}>cliquez ici pour réinitialiser</a>)
                </p>
              )}

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setDevResetLink(null);
                }}
                className="secondary-btn"
                style={{ marginTop: "16px" }}
              >
                Ressayer avec un autre e-mail
              </button>
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
