import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldAlt,
  faKey,
  faLock,
  faLaptop,
  faMobileScreen,
  faEye,
  faEyeSlash,
  faCheck,
  faTimes,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../../../context/ToastContext";

export default function ProfileSecurity() {
  // États pour le changement de mot de passe
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirmPass: "",
  });

  // États pour afficher/masquer les mots de passe
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // État pour le 2FA
  const [is2FAEnabled, setIs2FAEnabled] = useState(
    () => localStorage.getItem("shopflow_2fa") === "true",
  );

  // État pour les sessions actives
  const [sessions, setSessions] = useState([
    {
      id: 1,
      device: "MacBook Pro - Chrome",
      location: "Paris, France • Adresse IP: 192.168.1.1",
      current: true,
      icon: faLaptop,
    },
    {
      id: 2,
      device: "iPhone 13 - Safari",
      location: "Lyon, France • Adresse IP: 10.0.0.45",
      current: false,
      icon: faMobileScreen,
    },
  ]);

  const { showToast } = useToast();

  // Gestion de la modification du mot de passe
  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.newPass || !passwords.confirmPass) {
      showToast(
        "Erreur",
        "Veuillez remplir tous les champs du mot de passe.",
        "error",
      );
      return;
    }
    if (passwords.newPass !== passwords.confirmPass) {
      showToast(
        "Erreur",
        "Les nouveaux mots de passe ne correspondent pas.",
        "error",
      );
      return;
    }
    if (passwords.newPass.length < 6) {
      showToast(
        "Sécurité",
        "Le mot de passe doit contenir au moins 6 caractères.",
        "warning",
      );
      return;
    }

    // Simulation de succès
    showToast(
      "Succès",
      "Votre mot de passe a été mis à jour avec succès.",
      "success",
    );
    setPasswords({ current: "", newPass: "", confirmPass: "" });
  };

  // Gestion du 2FA
  const toggle2FA = () => {
    const newState = !is2FAEnabled;
    setIs2FAEnabled(newState);
    localStorage.setItem("shopflow_2fa", newState);
    showToast(
      "Sécurité 2FA",
      newState
        ? "Authentification à deux facteurs activée."
        : "Authentification à deux facteurs désactivée.",
      "success",
    );
  };

  // Suppression d'une session spécifique
  const handleRemoveSession = (id) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    showToast(
      "Sessions",
      "La session a été déconnectée avec succès.",
      "success",
    );
  };

  // Déconnexion de toutes les autres sessions
  const handleTerminateAll = () => {
    const currentOnly = sessions.filter((s) => s.current);
    setSessions(currentOnly);
    showToast(
      "Sessions",
      "Toutes les autres sessions ont été fermées.",
      "success",
    );
  };

  return (
    <div
      className="profile-section-content page-transition"
      style={{ position: "relative" }}
    >
      <div className="profile-content-header mb-24">
        <h2>Sécurité du Compte</h2>
        <p>Gérez votre mot de passe et protégez l'accès à votre compte.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* BLOC 1 : Changement de Mot de passe (Nouveau design épuré) */}
        <div className="profile-card">
          <div className="card-section-title" style={{ marginBottom: "20px" }}>
            <FontAwesomeIcon icon={faKey} style={{ color: "#1e3a8a" }} />
            <h3>Changement de Mot de passe</h3>
          </div>

          <form
            onSubmit={handlePasswordUpdate}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div className="input-group">
              <label
                style={{
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  color: "#334155",
                  marginBottom: "6px",
                  display: "block",
                }}
              >
                Mot de passe actuel
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showCurrent ? "text" : "password"}
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords({ ...passwords, current: e.target.value })
                  }
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "10px 40px 10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
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

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div className="input-group">
                <label
                  style={{
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    color: "#334155",
                    marginBottom: "6px",
                    display: "block",
                  }}
                >
                  Nouveau mot de passe
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showNew ? "text" : "password"}
                    value={passwords.newPass}
                    onChange={(e) =>
                      setPasswords({ ...passwords, newPass: e.target.value })
                    }
                    placeholder="••••••••"
                    style={{
                      width: "100%",
                      padding: "10px 40px 10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#64748b",
                    }}
                  >
                    <FontAwesomeIcon icon={showNew ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label
                  style={{
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    color: "#334155",
                    marginBottom: "6px",
                    display: "block",
                  }}
                >
                  Confirmer le nouveau
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={passwords.confirmPass}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        confirmPass: e.target.value,
                      })
                    }
                    placeholder="••••••••"
                    style={{
                      width: "100%",
                      padding: "10px 40px 10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#64748b",
                    }}
                  >
                    <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "10px" }}>
              <button
                type="submit"
                style={{
                  backgroundColor: "#1e3a8a",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FontAwesomeIcon icon={faLock} /> Mettre à jour le mot de passe
              </button>
            </div>
          </form>
        </div>

        {/* BLOC 2 : Authentification à deux facteurs (2FA) */}
        <div className="profile-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <div
                className="card-section-title"
                style={{ marginBottom: "8px" }}
              >
                <FontAwesomeIcon
                  icon={faShieldAlt}
                  style={{ color: "#1e3a8a" }}
                />
                <h3>Authentification à deux facteurs (2FA)</h3>
              </div>
              <p style={{ color: "#64748b", fontSize: "0.9rem", margin: 0 }}>
                Ajoutez une couche de sécurité supplémentaire à votre compte
                lors de la connexion.
              </p>
            </div>
            <span
              style={{
                padding: "4px 10px",
                borderRadius: "20px",
                fontSize: "0.8rem",
                fontWeight: "600",
                backgroundColor: is2FAEnabled ? "#dcfce7" : "#f1f5f9",
                color: is2FAEnabled ? "#166534" : "#64748b",
              }}
            >
              {is2FAEnabled ? "Activé" : "Désactivé"}
            </span>
          </div>

          <div style={{ marginTop: "16px" }}>
            <button
              onClick={toggle2FA}
              style={{
                backgroundColor: is2FAEnabled ? "#b91c1c" : "#1e3a8a",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {is2FAEnabled ? "Désactiver le 2FA" : "Activer le 2FA"}
            </button>
          </div>
        </div>

        {/* BLOC 3 : Sessions Actives */}
        <div className="profile-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div className="card-section-title" style={{ margin: 0 }}>
              <FontAwesomeIcon icon={faLaptop} style={{ color: "#1e3a8a" }} />
              <h3>Sessions Actives</h3>
            </div>
            {sessions.length > 1 && (
              <button
                onClick={handleTerminateAll}
                style={{
                  background: "none",
                  border: "none",
                  color: "#b91c1c",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                Se déconnecter de toutes les autres sessions
              </button>
            )}
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {sessions.length === 0 ? (
              <p
                style={{
                  color: "#64748b",
                  textAlign: "center",
                  padding: "15px",
                  fontStyle: "italic",
                }}
              >
                Aucune autre session active.
              </p>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={session.icon}
                      style={{ fontSize: "1.2rem", color: "#475569" }}
                    />
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <strong
                          style={{ fontSize: "0.95rem", color: "#1e293b" }}
                        >
                          {session.device}
                        </strong>
                        {session.current && (
                          <span
                            style={{
                              backgroundColor: "#dcfce7",
                              color: "#166534",
                              fontSize: "0.75rem",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontWeight: "600",
                            }}
                          >
                            Actuelle
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "#64748b",
                          margin: "2px 0 0 0",
                        }}
                      >
                        {session.location}
                      </p>
                    </div>
                  </div>

                  {!session.current && (
                    <button
                      onClick={() => handleRemoveSession(session.id)}
                      title="Fermer cette session"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#94a3b8",
                        fontSize: "1rem",
                        padding: "6px",
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
