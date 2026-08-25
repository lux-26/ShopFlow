import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faKey,
  faShieldHalved,
  faLaptop,
  faMobileScreenButton,
  faTimes,
  faEye,
  faEyeSlash,
  faCheck,
  faCircleInfo,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";

export default function ProfileSecurity() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // États pour afficher/masquer les mots de passe individuellement
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  // État pour le popup unifié (toast)
  const [toast, setToast] = useState({
    show: false,
    title: "",
    message: "",
    type: "success",
  });

  const [sessions, setSessions] = useState([
    {
      id: 1,
      device: "MacBook Pro - Chrome",
      location: "Paris, France • Adresse IP: 192.168.1.1",
      status: "Actuelle",
      type: "laptop",
    },
    {
      id: 2,
      device: "iPhone 13 - Safari",
      location: "Lyon, France • Adresse IP: 10.0.0.45",
      status: "Dernière activité: Hier à 14:30",
      type: "mobile",
    },
  ]);

  // Fonction pour afficher le popup unifié
  const showNotification = (title, message, type = "success") => {
    setToast({ show: true, title, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // Calcul de la force du mot de passe
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: "", color: "#e2e8f0" };
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: "Faible", color: "#ef4444" };
    if (score === 2 || score === 3)
      return { score: 2, label: "Moyen", color: "#f59e0b" };
    return { score: 3, label: "Fort", color: "#10b981" };
  };

  const strength = getPasswordStrength(newPassword);

  const handleUpdatePassword = (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      showNotification(
        "Erreur",
        "Veuillez remplir tous les champs du mot de passe.",
        "error",
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      showNotification(
        "Erreur",
        "Les nouveaux mots de passe ne correspondent pas.",
        "error",
      );
      return;
    }

    showNotification(
      "Succès",
      "Mot de passe mis à jour avec succès !",
      "success",
    );
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const toggle2FA = () => setIs2FAEnabled(!is2FAEnabled);

  const handleTerminateSession = (id) => {
    setSessions(sessions.filter((session) => session.id !== id));
  };

  const handleTerminateAllSessions = () => {
    setSessions(sessions.filter((session) => session.status === "Actuelle"));
  };

  return (
    <div className="security-section-container">
      {/* Popup unifié en bas à droite */}
      {toast.show && (
        <div
          className="custom-toast-notification"
          style={{
            borderLeftColor: toast.type === "error" ? "#dc2626" : "#1e3a8a",
          }}
        >
          <div
            className="toast-icon-wrapper"
            style={{ color: toast.type === "error" ? "#dc2626" : "#1e3a8a" }}
          >
            <FontAwesomeIcon
              icon={toast.type === "error" ? faCircleExclamation : faCircleInfo}
            />
          </div>
          <div className="toast-content">
            <span className="toast-title">{toast.title}</span>
            <p className="toast-message">{toast.message}</p>
          </div>
        </div>
      )}

      <div className="profile-top-header">
        <div>
          <h1>Sécurité du Compte</h1>
          <p>Gérez votre mot de passe et protégez l'accès à votre compte.</p>
        </div>
      </div>

      <div className="profile-card mb-24">
        <div className="card-section-title">
          <FontAwesomeIcon icon={faKey} />
          <h2>Changement de Mot de passe</h2>
        </div>

        <form onSubmit={handleUpdatePassword} className="security-form">
          {/* Mot de passe actuel */}
          <div
            className="input-group full-width mb-16"
            style={{ position: "relative" }}
          >
            <label>Mot de passe actuel</label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{ width: "100%", paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                style={{
                  position: "absolute",
                  right: "12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                <FontAwesomeIcon icon={showCurrent ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {/* Nouveau mot de passe */}
          <div
            className="input-group full-width mb-16"
            style={{ position: "relative" }}
          >
            <label>Nouveau mot de passe</label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type={showNew ? "text" : "password"}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ width: "100%", paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                style={{
                  position: "absolute",
                  right: "12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                <FontAwesomeIcon icon={showNew ? faEyeSlash : faEye} />
              </button>
            </div>

            {/* Voyant de force du mot de passe */}
            {newPassword && (
              <div style={{ marginTop: "8px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    marginBottom: "4px",
                  }}
                >
                  <span style={{ color: strength.color, fontWeight: "600" }}>
                    Force : {strength.label}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "4px", height: "4px" }}>
                  <div
                    style={{
                      flex: 1,
                      backgroundColor:
                        strength.score >= 1 ? strength.color : "#e2e8f0",
                      borderRadius: "2px",
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      backgroundColor:
                        strength.score >= 2 ? strength.color : "#e2e8f0",
                      borderRadius: "2px",
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      backgroundColor:
                        strength.score >= 3 ? strength.color : "#e2e8f0",
                      borderRadius: "2px",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirmer le nouveau mot de passe */}
          <div
            className="input-group full-width mb-24"
            style={{ position: "relative" }}
          >
            <label>Confirmer le nouveau mot de passe</label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: "100%", paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                style={{
                  position: "absolute",
                  right: "12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} />
              </button>
            </div>
            {confirmPassword && newPassword === confirmPassword && (
              <span
                style={{
                  fontSize: "12px",
                  color: "#10b981",
                  marginTop: "4px",
                  display: "inline-block",
                }}
              >
                <FontAwesomeIcon icon={faCheck} /> Les mots de passe
                correspondent
              </span>
            )}
          </div>

          <button type="submit" className="btn-primary-custom">
            Mettre à jour le mot de passe
          </button>
        </form>
      </div>

      <div className="profile-card mb-24">
        <div className="card-section-title space-between">
          <div className="title-with-icon">
            <FontAwesomeIcon icon={faShieldHalved} />
            <h2>Authentification à deux facteurs (2FA)</h2>
          </div>
          <span
            className={`status-badge-outline ${is2FAEnabled ? "active" : ""}`}
          >
            {is2FAEnabled ? "Activé" : "Désactivé"}
          </span>
        </div>

        <p className="security-desc">
          Ajoutez une couche de sécurité supplémentaire à votre compte.
        </p>

        <button
          onClick={toggle2FA}
          className={`btn-toggle-2fa ${
            is2FAEnabled ? "btn-danger-outline" : "btn-primary-custom"
          }`}
        >
          {is2FAEnabled ? "Désactiver le 2FA" : "Activer"}
        </button>
      </div>

      <div className="profile-card">
        <div className="card-section-title space-between">
          <div className="title-with-icon">
            <FontAwesomeIcon icon={faLaptop} />
            <h2>Sessions Actives</h2>
          </div>
          {sessions.length > 1 && (
            <button
              onClick={handleTerminateAllSessions}
              className="btn-danger-text"
            >
              Se déconnecter de toutes les autres sessions
            </button>
          )}
        </div>

        <div className="sessions-list-stack">
          {sessions.map((session) => (
            <div className="session-item-row" key={session.id}>
              <div className="session-icon">
                <FontAwesomeIcon
                  icon={
                    session.type === "laptop" ? faLaptop : faMobileScreenButton
                  }
                  size="lg"
                />
              </div>
              <div className="session-info">
                <div className="session-title-line">
                  <strong>{session.device}</strong>
                  {session.status === "Actuelle" && (
                    <span className="status-pill delivered">Actuelle</span>
                  )}
                </div>
                <p>{session.location}</p>
              </div>
              {session.status !== "Actuelle" && (
                <button
                  className="btn-close-session"
                  onClick={() => handleTerminateSession(session.id)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
