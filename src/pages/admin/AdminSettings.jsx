import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useToast } from "../../context/ToastContext";

export default function AdminSettings() {
  const [storeName, setStoreName] = useState("ShopFlow");
  const [storeEmail, setStoreEmail] = useState("contact@shopflow.ci");
  const [currency, setCurrency] = useState("XOF");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { showToast } = useToast();

  const handleSave = (e) => {
    e.preventDefault();
    showToast(
      "Paramètres enregistrés",
      "Les modifications de la boutique ont bien été enregistrées.",
      "success",
    );
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
    </div>
  );
}
