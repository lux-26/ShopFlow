import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

export default function AdminSettings() {
  const [storeName, setStoreName] = useState("ShopFlow");
  const [storeEmail, setStoreEmail] = useState("contact@shopflow.ci");
  const [currency, setCurrency] = useState("XOF");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // État pour gérer le message du Toast
  const [toastMessage, setToastMessage] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();

    // Déclenche l'affichage du Toast au lieu de alert()
    setToastMessage("Paramètres enregistrés avec succès !");

    // Masque automatiquement le Toast après 3 secondes
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="admin-content-wrapper page-transition">
      {/* En-tête de la page */}
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Paramètres de la Boutique</h1>
          <p className="page-subtitle">
            Gérez les configurations générales de votre application e-commerce.
          </p>
        </div>
      </div>

      {/* Formulaire des paramètres dans une carte */}
      <div className="card settings-card">
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Nom de la boutique</label>
            <input
              type="text"
              className="form-control"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email de contact</label>
            <input
              type="email"
              className="form-control"
              value={storeEmail}
              onChange={(e) => setStoreEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Devise principale</label>
            <select
              className="form-control"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="XOF">FCFA (XOF)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="USD">Dollar (USD)</option>
            </select>
          </div>

          <div
            style={{
              margin: "1.5rem 0 2rem 0",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <input
              type="checkbox"
              id="notif"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
            <label
              htmlFor="notif"
              style={{
                cursor: "pointer",
                fontSize: "0.95rem",
                color: "#334155",
                fontWeight: 500,
                textTransform: "none",
                letterSpacing: "normal",
                marginBottom: 0,
              }}
            >
              Activer les notifications par email pour les nouvelles commandes
            </label>
          </div>

          <button type="submit" className="btn btn-primary-dark">
            Enregistrer les modifications
          </button>
        </form>
      </div>

      {/* Pop-up Toast Flottant (Design personnalisé) */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
            backgroundColor: "#ffffff",
            color: "#1e293b",
            padding: "16px 20px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            borderLeft: "4px solid #1e3a8a",
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
            maxWidth: "380px",
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <FontAwesomeIcon
            icon={faCircleInfo}
            style={{ color: "#1e3a8a", fontSize: "1.2rem", marginTop: "2px" }}
          />
          <div>
            <h4
              style={{
                margin: "0 0 4px 0",
                fontSize: "0.95rem",
                fontWeight: "700",
                color: "#0f172a",
              }}
            >
              Succès !
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: "0.85rem",
                color: "#64748b",
                lineHeight: "1.4",
              }}
            >
              {toastMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
