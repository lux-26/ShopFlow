import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faEye,
  faTrashCan,
  faXmark,
  faBagShopping,
  faClock,
  faTruck,
  faWallet,
  faArrowTrendUp,
  faSliders,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../../context/ToastContext";

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { showToast } = useToast();

  const [orders, setOrders] = useState([
    {
      id: "#CMD-8902",
      client: "Amadou Koné",
      avatarBg: "#1e3a8a",
      date: "24 Oct 2023",
      total: "125 000 FCFA",
      payment: "Carte bancaire",
      status: "Livré",
      statusClass: "badge-success",
      dotClass: "badge-dot",
    },
    {
      id: "#CMD-8901",
      client: "Mariam Diallo",
      avatarBg: "#854d0e",
      date: "24 Oct 2023",
      total: "45 500 FCFA",
      payment: "Orange Money",
      status: "En cours",
      statusClass: "badge-warning",
      dotClass: "badge-dot",
    },
    {
      id: "#CMD-8900",
      client: "Seydou Traoré",
      avatarBg: "#475569",
      date: "23 Oct 2023",
      total: "210 000 FCFA",
      payment: "Wave",
      status: "Payé",
      statusClass: "badge-success",
      dotClass: "badge-dot",
    },
    {
      id: "#CMD-8899",
      client: "Fatou Sow",
      avatarBg: "#b91c1c",
      date: "22 Oct 2023",
      total: "15 000 FCFA",
      payment: "Espèces",
      status: "Annulé",
      statusClass: "badge-danger",
      dotClass: "badge-dot",
    },
  ]);

  const handleDelete = (id) => {
    setOrders(orders.filter((item) => item.id !== id));
    showToast(
      "Commande supprimée",
      `La commande ${id} a bien été supprimée.`,
      "success",
    );
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.client.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="admin-content-wrapper page-transition">
      {/* En-tête de la page */}
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Gestion des Commandes</h1>
          <p className="page-subtitle">
            Suivez et gérez toutes les transactions de votre boutique.
          </p>
        </div>
      </div>

      {/* Grille des KPI */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-info">
            <span>Total Commandes</span>
            <h2>1,248</h2>
            <div className="trend positive">
              <FontAwesomeIcon icon={faArrowTrendUp} /> +12% ce mois
            </div>
          </div>
          <div className="kpi-icon">
            <FontAwesomeIcon icon={faBagShopping} />
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-info">
            <span>En attente</span>
            <h2>42</h2>
            <span
              className="text-muted"
              style={{ fontSize: "0.75rem", fontWeight: 600 }}
            >
              À traiter
            </span>
          </div>
          <div className="kpi-icon">
            <FontAwesomeIcon icon={faClock} />
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-info">
            <span>Livrées</span>
            <h2>1,180</h2>
            <span className="trend positive">Taux de succès 94%</span>
          </div>
          <div className="kpi-icon">
            <FontAwesomeIcon icon={faTruck} />
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-info">
            <span>Revenu Total</span>
            <h2>
              15 450 000 <small>FCFA</small>
            </h2>
            <div className="trend positive">
              <FontAwesomeIcon icon={faArrowTrendUp} /> +8.5% ce mois
            </div>
          </div>
          <div className="kpi-icon">
            <FontAwesomeIcon icon={faWallet} />
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="filters-container-card">
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div
            className="search-box-large"
            style={{ flex: 1, marginBottom: 0 }}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher par ID ou nom du client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="filter-select">
            <option>Tous les statuts</option>
            <option>Livré</option>
            <option>En cours</option>
            <option>Payé</option>
            <option>Annulé</option>
          </select>
          <button className="btn-filter-action">
            <FontAwesomeIcon icon={faSliders} /> Filtres avancés
          </button>
        </div>
      </div>

      {/* Tableau des commandes */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-responsive">
          <table className="shopflow-table">
            <thead>
              <tr>
                <th>ID Commande</th>
                <th>Client</th>
                <th>Date</th>
                <th>Montant (FCFA)</th>
                <th>Statut</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => {
                // Initiales pour l'avatar
                const initials = o.client
                  .split(" ")
                  .map((n) => n[0])
                  .join("");

                return (
                  <tr key={o.id}>
                    <td>
                      <strong className="font-bold">{o.id}</strong>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          className="order-client-avatar"
                          style={{ backgroundColor: o.avatarBg, color: "#fff" }}
                        >
                          {initials}
                        </div>
                        <span className="font-bold">{o.client}</span>
                      </div>
                    </td>
                    <td className="text-muted">{o.date}</td>
                    <td>
                      <strong>{o.total}</strong>
                    </td>
                    <td>
                      <span className={`pill-badge ${o.statusClass}`}>
                        <span className="badge-dot"></span>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn-icon"
                        title="Voir les détails"
                        onClick={() => setSelectedOrder(o)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className="btn-icon text-danger"
                        title="Supprimer"
                        onClick={() => handleDelete(o.id)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pied de tableau avec pagination */}
        <div className="table-footer-pagination">
          <div className="pagination-info">
            Affichage 1 à {filteredOrders.length} sur 1,248 commandes
          </div>
          <div className="pagination-buttons">
            <button className="btn-page-nav" disabled>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button className="btn-page-num active">1</button>
            <button className="btn-page-num">2</button>
            <button className="btn-page-num">3</button>
            <button
              className="btn-page-num"
              style={{ border: "none", background: "transparent" }}
            >
              …
            </button>
            <button className="btn-page-num">125</button>
            <button className="btn-page-nav">
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      </div>

      {/* Modale des détails */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <div className="card-header-flex">
              <h3>Détails de la commande {selectedOrder.id}</h3>
              <button
                className="btn-icon"
                onClick={() => setSelectedOrder(null)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                margin: "16px 0",
              }}
            >
              <p>
                <strong>Client :</strong> {selectedOrder.client}
              </p>
              <p>
                <strong>Date :</strong> {selectedOrder.date}
              </p>
              <p>
                <strong>Total :</strong> {selectedOrder.total}
              </p>
              <p>
                <strong>Mode de paiement :</strong> {selectedOrder.payment}
              </p>
              <p>
                <strong>Statut :</strong>{" "}
                <span
                  className={`pill-badge ${selectedOrder.statusClass}`}
                  style={{ marginLeft: "8px" }}
                >
                  <span className="badge-dot"></span>
                  {selectedOrder.status}
                </span>
              </p>
            </div>
            <div className="modal-actions-right">
              <button
                className="btn btn-primary"
                onClick={() => setSelectedOrder(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
