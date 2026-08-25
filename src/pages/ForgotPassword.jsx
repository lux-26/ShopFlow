import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faArrowLeft,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // Simulation de l'envoi de l'e-mail de réinitialisation
      setIsSubmitted(true);
    }
  };

  return (
    <div className="forgot-page-wrapper">
      <main className="forgot-main-container">
        <div className="forgot-card">
          <div className="forgot-card-header">
            <div className="mini-logo-box">ShopFlow</div>
            <h1>Mot de passe oublié ?</h1>
            <p>
              {!isSubmitted
                ? "Entrez votre adresse e-mail associée à votre compte et nous vous enverrons un lien de réinitialisation."
                : "Un e-mail de réinitialisation a été simulé avec succès !"}
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
                    placeholder="vous@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Envoyer le lien de réinitialisation
              </button>
            </form>
          ) : (
            <div className="success-state">
              <div className="success-icon">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
              <p className="success-message">
                Un e-mail contenant les instructions a été envoyé à : <br />
                <strong>{email}</strong>
              </p>
              <p className="simulation-note">
                (Mode simulation : Dans un environnement réel, vous recevriez un
                lien sécurisé par e-mail.)
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
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
