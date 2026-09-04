import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faArrowTrendUp,
  faArrowTrendDown,
  faWallet,
  faBagShopping,
  faUsers,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../../context/ToastContext";

export default function AdminDashboard() {
  const [period, setPeriod] = useState("Ce mois");
  const { showToast } = useToast();

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
    showToast(
      "Exportation réussie",
      "Les données ont été exportées avec succès.",
      "success",
    );
  };

  return (
    <div className="admin-content-wrapper page-transition">
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
    </div>
  );
}
