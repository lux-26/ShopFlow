import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faArrowTrendUp,
  faArrowTrendDown,
  faWallet,
  faBagShopping,
  faUsers,
  faChartLine,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";

export default function AdminDashboard() {
  const [period, setPeriod] = useState("Ce mois");

  // État pour gérer le message du Toast
  const [toastMessage, setToastMessage] = useState(null);

  const [recentOrders] = useState([
    {
      id: "#ORD-0921",
      client: "Jean Dupont",
      time: "15:42",
      amount: "45 000 F",
      status: "Livré",
      statusClass: "success",
    },
    {
      id: "#ORD-0920",
      client: "Marie Claire",
      time: "14:15",
      amount: "120 000 F",
      status: "En cours",
      statusClass: "warning",
    },
    {
      id: "#ORD-0919",
      client: "Ali Koné",
      time: "11:30",
      amount: "15 500 F",
      status: "Livré",
      statusClass: "success",
    },
    {
      id: "#ORD-0918",
      client: "Paul Yapo",
      time: "Hier",
      amount: "85 000 F",
      status: "Annulé",
      statusClass: "danger",
    },
  ]);

  const handleExport = () => {
    // Déclenche l'affichage du Toast au lieu de alert()
    setToastMessage("Exportation des données en cours...");

    // Masque automatiquement le Toast après 3 secondes
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="admin-content-wrapper">
      <div className="page-header-flex">
        <div>
          <h1>Vue d'ensemble</h1>
          <p>Bienvenue dans votre espace d'administration ShopFlow.</p>
        </div>
        <div className="header-actions">
          <select
            className="form-control-sm"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="Ce mois">Ce mois</option>
            <option value="Cette semaine">Cette semaine</option>
            <option value="Cette année">Cette année</option>
          </select>
          <button className="btn btn-primary" onClick={handleExport}>
            <FontAwesomeIcon icon={faDownload} /> Exporter
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-info">
            <span>Revenus Totaux</span>
            <h2>
              4 250 000 <small>FCFA</small>
            </h2>
            <span className="trend positive">
              <FontAwesomeIcon icon={faArrowTrendUp} /> +12.5% vs mois dernier
            </span>
          </div>
          <div className="kpi-icon">
            <FontAwesomeIcon icon={faWallet} />
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-info">
            <span>Commandes</span>
            <h2>842</h2>
            <span className="trend positive">
              <FontAwesomeIcon icon={faArrowTrendUp} /> +5.2% vs mois dernier
            </span>
          </div>
          <div className="kpi-icon">
            <FontAwesomeIcon icon={faBagShopping} />
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-info">
            <span>Nouveaux Clients</span>
            <h2>156</h2>
            <span className="trend negative">
              <FontAwesomeIcon icon={faArrowTrendDown} /> -2.1% vs mois dernier
            </span>
          </div>
          <div className="kpi-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-info">
            <span>Taux de Conversion</span>
            <h2>3.8%</h2>
            <span className="trend positive">
              <FontAwesomeIcon icon={faArrowTrendUp} /> +0.4% vs mois dernier
            </span>
          </div>
          <div className="kpi-icon">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card chart-card">
          <div className="card-header-flex">
            <h3>Évolution des Ventes</h3>
            <span className="badge-light">Cette Semaine</span>
          </div>
          <div className="mockup-chart-container">
            <div className="chart-bars">
              <div className="bar" style={{ height: "40%" }}></div>
              <div className="bar" style={{ height: "65%" }}></div>
              <div className="bar" style={{ height: "55%" }}></div>
              <div className="bar" style={{ height: "80%" }}></div>
              <div className="bar" style={{ height: "95%" }}></div>
              <div className="bar active" style={{ height: "70%" }}></div>
              <div className="bar" style={{ height: "85%" }}></div>
            </div>
          </div>
        </div>

        <div className="card recent-orders-card">
          <div className="card-header-flex">
            <h3>Commandes Récentes</h3>
            <a href="/admin/orders" className="link-primary">
              Voir tout
            </a>
          </div>
          <div className="recent-orders-list">
            {recentOrders.map((order, index) => (
              <div className="order-item" key={index}>
                <div className="order-client-avatar">
                  {order.client.charAt(0)}
                </div>
                <div className="order-details">
                  <strong>{order.client}</strong>
                  <span>
                    {order.id} • {order.time}
                  </span>
                </div>
                <div className="order-amount-status">
                  <span className="amount">{order.amount}</span>
                  <span className={`badge-status ${order.statusClass}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
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
              Information
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
