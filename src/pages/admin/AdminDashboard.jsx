import { useEffect, useState } from "react";
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
import apiClient from "../../utils/apiClient";

const periodLabels = {
  month: "Ce mois",
  week: "Cette semaine",
  year: "Cette année",
};
const statusClasses = {
  Livré: "success",
  "En cours": "warning",
  Payé: "success",
  "En attente": "warning",
  Annulé: "danger",
};

function formatAmount(value) {
  return `${value.toLocaleString("fr-FR")} FCFA`;
}

function formatChange(value) {
  return `${value >= 0 ? "+" : ""}${value}% vs période précédente`;
}

export default function AdminDashboard() {
  const [period, setPeriod] = useState("month");
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    // Le chargement accompagne chaque changement de période.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    apiClient
      .get(`/dashboard?period=${period}`)
      .then((data) => {
        if (!cancelled) setDashboard(data);
      })
      .catch((requestError) => {
        if (!cancelled)
          setError(
            requestError.message || "Impossible de charger le dashboard.",
          );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [period]);

  const handleExport = () => {
    if (!dashboard) return;
    const rows = [
      ["Indicateur", "Valeur"],
      ["Revenus", dashboard.kpis.revenue],
      ["Commandes", dashboard.kpis.orders],
      ["Nouveaux clients", dashboard.kpis.newUsers],
      ["Taux de livraison", `${dashboard.kpis.conversion}%`],
    ];
    const blob = new Blob([rows.map((row) => row.join(";")).join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `shopflow-dashboard-${period}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(
      "Exportation réussie",
      "Les données réelles ont été exportées.",
      "success",
    );
  };

  const trend = (value) => (
    <span className={`trend ${value >= 0 ? "positive" : "negative"}`}>
      <FontAwesomeIcon icon={value >= 0 ? faArrowTrendUp : faArrowTrendDown} />{" "}
      {formatChange(value)}
    </span>
  );

  return (
    <div className="admin-content-wrapper page-transition">
      <div className="page-header-flex">
        <div>
          <h1>Vue d&apos;ensemble</h1>
          <p>Bienvenue dans votre espace d&apos;administration ShopFlow.</p>
        </div>
        <div className="header-actions">
          <select
            className="form-control-sm"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
          >
            <option value="month">Ce mois</option>
            <option value="week">Cette semaine</option>
            <option value="year">Cette année</option>
          </select>
          <button
            className="btn btn-primary"
            onClick={handleExport}
            disabled={!dashboard}
          >
            <FontAwesomeIcon icon={faDownload} /> Exporter
          </button>
        </div>
      </div>

      {isLoading ? (
        <p>Chargement des statistiques...</p>
      ) : error ? (
        <p style={{ color: "#dc2626" }}>{error}</p>
      ) : (
        dashboard && (
          <>
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-info">
                  <span>Revenus Totaux</span>
                  <h2>{formatAmount(dashboard.kpis.revenue)}</h2>
                  {trend(dashboard.kpis.revenueChange)}
                </div>
                <div className="kpi-icon">
                  <FontAwesomeIcon icon={faWallet} />
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-info">
                  <span>Commandes</span>
                  <h2>{dashboard.kpis.orders.toLocaleString("fr-FR")}</h2>
                  {trend(dashboard.kpis.ordersChange)}
                </div>
                <div className="kpi-icon">
                  <FontAwesomeIcon icon={faBagShopping} />
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-info">
                  <span>Nouveaux Clients</span>
                  <h2>{dashboard.kpis.newUsers.toLocaleString("fr-FR")}</h2>
                  {trend(dashboard.kpis.usersChange)}
                </div>
                <div className="kpi-icon">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-info">
                  <span>Taux de livraison</span>
                  <h2>{dashboard.kpis.conversion}%</h2>
                  <span className="trend">Commandes livrées / commandes</span>
                </div>
                <div className="kpi-icon">
                  <FontAwesomeIcon icon={faChartLine} />
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="card chart-card">
                <div className="card-header-flex">
                  <h3>Évolution des ventes</h3>
                  <span className="badge-light">{periodLabels[period]}</span>
                </div>
                <div className="mockup-chart-container">
                  <div className="chart-bars">
                    {dashboard.sales.length === 0 ? (
                      <p>Aucune vente sur cette période.</p>
                    ) : (
                      dashboard.sales.map((bar) => (
                        <div
                          className="bar"
                          key={bar.label}
                          title={`${bar.label} : ${formatAmount(bar.amount)}`}
                          style={{ height: `${bar.height}%` }}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className="card recent-orders-card">
                <div className="card-header-flex">
                  <h3>Commandes récentes</h3>
                  <a href="/admin/orders" className="link-primary">
                    Voir tout
                  </a>
                </div>
                <div className="recent-orders-list">
                  {dashboard.recentOrders.length === 0 ? (
                    <p>Aucune commande sur cette période.</p>
                  ) : (
                    dashboard.recentOrders.map((order) => (
                      <div className="order-item" key={order.id}>
                        {order.customerAvatar ? (
                          <img
                            className="order-client-avatar"
                            src={order.customerAvatar}
                            alt={`Photo de ${order.client}`}
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div className="order-client-avatar">
                            {order.client?.charAt(0) || "?"}
                          </div>
                        )}
                        <div className="order-details">
                          <strong>{order.client}</strong>
                          <span>
                            {order.id} •{" "}
                            {new Date(order.time).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="order-amount-status">
                          <span className="amount">
                            {formatAmount(order.amount)}
                          </span>
                          <span
                            className={`badge-status ${statusClasses[order.status] || "warning"}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}
