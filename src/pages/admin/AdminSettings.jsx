import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import apiClient from "../../utils/apiClient";

export default function AdminSettings() {
  const [storeName, setStoreName] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [currency, setCurrency] = useState("XOF");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;

    apiClient
      .get("/settings")
      .then(({ settings }) => {
        if (!isMounted) return;
        setStoreName(settings.storeName);
        setStoreEmail(settings.storeEmail);
        setCurrency(settings.currency);
        setNotificationsEnabled(settings.notificationsEnabled);
      })
      .catch((error) => {
        if (isMounted)
          setLoadError(
            error.message || "Impossible de charger les paramètres.",
          );
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { settings } = await apiClient.patch("/settings", {
        storeName,
        storeEmail,
        currency,
        notificationsEnabled,
      });
      setStoreName(settings.storeName);
      setStoreEmail(settings.storeEmail);
      setCurrency(settings.currency);
      setNotificationsEnabled(settings.notificationsEnabled);
      showToast(
        "Paramètres enregistrés",
        "Les modifications ont bien été sauvegardées.",
        "success",
      );
    } catch (error) {
      showToast(
        "Erreur",
        error.errors?.[0] ||
          error.message ||
          "Impossible d'enregistrer les paramètres.",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
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
        {isLoading ? <p>Chargement des paramètres...</p> : null}
        {loadError ? <p style={{ color: "#dc2626" }}>{loadError}</p> : null}
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Nom de la boutique</label>
            <input
              type="text"
              className="form-control"
              value={storeName}
              disabled={isLoading || isSaving}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email de contact</label>
            <input
              type="email"
              className="form-control"
              value={storeEmail}
              disabled={isLoading || isSaving}
              onChange={(e) => setStoreEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Devise principale</label>
            <select
              className="form-control"
              value={currency}
              disabled={isLoading || isSaving}
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
              disabled={isLoading || isSaving}
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

          <button
            type="submit"
            className="btn btn-primary-dark"
            disabled={isLoading || isSaving}
          >
            {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </form>
      </div>
    </div>
  );
}
