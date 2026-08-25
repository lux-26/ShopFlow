import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faTruck } from "@fortawesome/free-solid-svg-icons";

export default function ProfilePayment({ triggerPopup }) {
  const [selectedMethod, setSelectedMethod] = useState("mobile");

  // Charger la méthode enregistrée au démarrage
  useEffect(() => {
    const savedMethod = localStorage.getItem("shopflow_payment_method");
    if (savedMethod) {
      setSelectedMethod(savedMethod);
    }
  }, []);

  const handleSavePayment = (e) => {
    e.preventDefault();

    // 1. Sauvegarder dans le localStorage avec la clé standardisée
    localStorage.setItem("shopflow_payment_method", selectedMethod);

    // 2. Déclencher un événement global pour synchroniser les autres pages/onglets
    window.dispatchEvent(new Event("storage"));

    // 3. Afficher ton popup stylé
    if (triggerPopup) {
      triggerPopup(
        "Succès",
        "Votre méthode de paiement par défaut a été mise à jour !",
      );
    }
  };

  return (
    <div style={{ padding: "0px" }}>
      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
          border: "1px solid #e2e8f0",
        }}
      >
        <h3
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
            color: "#1e293b",
            fontSize: "18px",
          }}
        >
          <FontAwesomeIcon icon={faCreditCard} /> Méthodes de Paiement
          Enregistrées
        </h3>

        <form onSubmit={handleSavePayment}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            {/* Option 1 : Carte Bancaire */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                backgroundColor:
                  selectedMethod === "card" ? "#f0f4ff" : "#ffffff",
                border:
                  selectedMethod === "card"
                    ? "2px solid #1e3a8a"
                    : "2px solid #e2e8f0",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontWeight: "500",
                  color: "#1e293b",
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={selectedMethod === "card"}
                  onChange={() => setSelectedMethod("card")}
                />
                <span>Carte Bancaire</span>
              </div>
              <FontAwesomeIcon
                icon={faCreditCard}
                style={{ color: "#64748b", fontSize: "18px" }}
              />
            </label>

            {/* Option 2 : Mobile Money */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                backgroundColor:
                  selectedMethod === "mobile" ? "#f0f4ff" : "#ffffff",
                border:
                  selectedMethod === "mobile"
                    ? "2px solid #1e3a8a"
                    : "2px solid #e2e8f0",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontWeight: "500",
                  color: "#1e293b",
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mobile"
                  checked={selectedMethod === "mobile"}
                  onChange={() => setSelectedMethod("mobile")}
                />
                <span>Mobile Money</span>
              </div>
              <span style={{ fontSize: "13px", color: "#64748b" }}>
                Orange, Free, Wave
              </span>
            </label>

            {/* Option 3 : Paiement à la livraison */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                backgroundColor:
                  selectedMethod === "cash" ? "#f0f4ff" : "#ffffff",
                border:
                  selectedMethod === "cash"
                    ? "2px solid #1e3a8a"
                    : "2px solid #e2e8f0",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontWeight: "500",
                  color: "#1e293b",
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={selectedMethod === "cash"}
                  onChange={() => setSelectedMethod("cash")}
                />
                <span>Paiement à la livraison</span>
              </div>
              <FontAwesomeIcon
                icon={faTruck}
                style={{ color: "#64748b", fontSize: "18px" }}
              />
            </label>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              backgroundColor: "#1e3a8a",
              color: "white",
              border: "none",
              padding: "14px",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Enregistrer les modifications
          </button>
        </form>
      </div>
    </div>
  );
}
