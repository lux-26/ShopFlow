import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHistory,
  faArrowLeft,
  faSort,
} from "@fortawesome/free-solid-svg-icons";

export default function ProfileOrders({ recentOrders, setActiveTab }) {
  // État pour stocker le critère de tri actuel ("date", "price", ou "id")
  const [sortBy, setSortBy] = useState("date");
  // État pour l'ordre (croissant ou décroissant)
  const [sortOrder, setSortOrder] = useState("desc");

  // Fonction de tri des commandes
  const sortedOrders = [...(recentOrders || [])].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "id") {
      comparison = a.id.localeCompare(b.id);
    } else if (sortBy === "price") {
      // Nettoyage de la chaîne de caractères (ex: "217 500 FCFA" -> nombre 217500)
      const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, "")) || 0;
      const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, "")) || 0;
      comparison = priceA - priceB;
    } else if (sortBy === "date") {
      // Si la date est textuelle comme "Aujourd'hui", on peut adapter ou trier par ordre d'arrivée
      // Ici, on se base sur l'ordre initial du tableau ou une vraie date si disponible
      comparison = 0;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="profile-section-content page-transition">
      <div
        className="profile-content-header mb-24"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h2>Historique Complet des Commandes</h2>
          <p>Retrouvez l'ensemble de vos commandes passées et en cours.</p>
        </div>
        <button
          onClick={() => setActiveTab("infos")}
          style={{
            background: "none",
            border: "1px solid #e5e7eb",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            color: "#1e3a8a",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Retour au profil
        </button>
      </div>

      <div className="profile-card">
        <div
          className="card-section-title"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FontAwesomeIcon icon={faHistory} />
            <h3>Toutes vos commandes ({recentOrders.length})</h3>
          </div>

          {/* Barre de Tri */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "0.85rem",
                color: "#64748b",
                fontWeight: "500",
              }}
            >
              Trier par :
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#fff",
                fontSize: "0.85rem",
                color: "#1e293b",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="date">Date</option>
              <option value="price">Prix</option>
              <option value="id">ID de commande</option>
            </select>

            <button
              onClick={toggleSortOrder}
              title="Inverser l'ordre"
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#fff",
                cursor: "pointer",
                color: "#1e3a8a",
                fontWeight: "600",
                fontSize: "0.85rem",
              }}
            >
              <FontAwesomeIcon icon={faSort} />{" "}
              {sortOrder === "asc" ? "Croissant" : "Décroissant"}
            </button>
          </div>
        </div>

        <div className="orders-list-stack" style={{ marginTop: "16px" }}>
          {!sortedOrders || sortedOrders.length === 0 ? (
            <p
              style={{
                color: "#6b7280",
                textAlign: "center",
                padding: "30px 0",
                fontStyle: "italic",
              }}
            >
              Vous n'avez passé aucune commande pour le moment.
            </p>
          ) : (
            sortedOrders.map((order, index) => (
              <div
                className="order-item-card"
                key={index}
                style={{ marginBottom: "12px" }}
              >
                <div className="order-item-top">
                  <strong>{order.id}</strong>
                  <span
                    className={`status-pill ${
                      order.status === "LIVRÉ" ? "delivered" : "pending"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="order-item-details">
                  <span>
                    {order.itemsCount} Article{order.itemsCount > 1 ? "s" : ""}{" "}
                    • {order.date}
                  </span>
                  <span className="order-price-tag">{order.price}</span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
