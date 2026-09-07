import { useEffect, useState } from "react";
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
  faSliders,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../../context/ToastContext";
import Pagination from "../../components/admin/Pagination";
import apiClient from "../../utils/apiClient";
import {
  getOrderStatusBadge,
  getPaymentLabel,
  formatOrderDate,
} from "../../utils/orderUtils";

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Tous");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const loadOrders = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await apiClient.get("/orders");
      setOrders(data.orders);
    } catch (error) {
      setLoadError(error.message || "Impossible de charger les commandes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrders();
  }, []);

  const handleDelete = async (order) => {
    try {
      await apiClient.delete(`/orders/${order.id}`);
      setOrders((prev) => prev.filter((item) => item.id !== order.id));
      showToast(
        "Commande supprimée",
        `La commande ${order.orderNumber} a bien été supprimée.`,
        "success",
      );
    } catch (error) {
      showToast(
        "Erreur",
        error.message || "Impossible de supprimer cette commande.",
        "error",
      );
    }
  };

  const handleStatusChange = async (order, newStatus) => {
    try {
      const data = await apiClient.patch(`/orders/${order.id}/status`, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? data.order : o)),
      );
      setSelectedOrder(data.order);
      showToast(
        "Statut mis à jour",
        `La commande ${order.orderNumber} est maintenant "${newStatus}".`,
        "success",
      );
    } catch (error) {
      showToast(
        "Erreur",
        error.message || "Impossible de mettre à jour le statut.",
        "error",
      );
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      (o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedStatus === "Tous" || o.status === selectedStatus),
  );

  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedOrders = filteredOrders.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize,
  );

  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === "En attente").length;
  const deliveredCount = orders.filter((o) => o.status === "Livré").length;
  const deliveredRate =
    totalOrdersCount > 0
      ? Math.round((deliveredCount / totalOrdersCount) * 100)
      : 0;
  const totalRevenue = orders
    .filter((o) => o.status !== "Annulé")
    .reduce((sum, o) => sum + o.total, 0);

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
            <h2>{totalOrdersCount}</h2>
          </div>
          <div className="kpi-icon">
            <FontAwesomeIcon icon={faBagShopping} />
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-info">
            <span>En attente</span>
            <h2>{pendingCount}</h2>
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
            <h2>{deliveredCount}</h2>
            {totalOrdersCount > 0 && (
              <span className="trend positive">Taux de {deliveredRate}%</span>
            )}
          </div>
          <div className="kpi-icon">
            <FontAwesomeIcon icon={faTruck} />
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-info">
            <span>Revenu Total</span>
            <h2>
              {totalRevenue.toLocaleString("fr-FR")} <small>FCFA</small>
            </h2>
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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <select
            className="filter-select"
            value={selectedStatus}
            onChange={(event) => {
              setSelectedStatus(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="Tous">Tous les statuts</option>
            <option value="Livré">Livré</option>
            <option value="En cours">En cours</option>
            <option value="Payé">Payé</option>
            <option value="Annulé">Annulé</option>
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
              {isLoading ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "30px" }}
                  >
                    <FontAwesomeIcon icon={faSpinner} spin /> Chargement des
                    commandes...
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#dc2626",
                    }}
                  >
                    {loadError}{" "}
                    <button className="link-primary" onClick={loadOrders}>
                      Réessayer
                    </button>
                  </td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "30px" }}
                  >
                    Aucune commande pour le moment.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((o) => {
                  const initials = o.customerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("");
                  const badge = getOrderStatusBadge(o.status);

                  return (
                    <tr key={o.id}>
                      <td>
                        <strong className="font-bold">{o.orderNumber}</strong>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {o.customerAvatar ? (
                            <img
                              className="order-client-avatar"
                              src={o.customerAvatar}
                              alt={`Photo de ${o.customerName}`}
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <div
                              className="order-client-avatar"
                              style={{
                                backgroundColor: "var(--color-primary)",
                                color: "#fff",
                              }}
                            >
                              {initials}
                            </div>
                          )}
                          <span className="font-bold">{o.customerName}</span>
                        </div>
                      </td>
                      <td className="text-muted">
                        {formatOrderDate(o.createdAt)}
                      </td>
                      <td>
                        <strong>{o.total.toLocaleString("fr-FR")} FCFA</strong>
                      </td>
                      <td>
                        <span className={`pill-badge badge-${badge.type}`}>
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
                          onClick={() => handleDelete(o)}
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={safeCurrentPage}
          totalItems={filteredOrders.length}
          pageSize={pageSize}
          itemLabel="commandes"
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modale des détails */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ maxWidth: "560px" }}>
            <div className="card-header-flex">
              <h3>Détails de la commande {selectedOrder.orderNumber}</h3>
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
                <strong>Client :</strong> {selectedOrder.customerName} (
                {selectedOrder.customerEmail})
              </p>
              <p>
                <strong>Date :</strong>{" "}
                {formatOrderDate(selectedOrder.createdAt)}
              </p>
              <p>
                <strong>Adresse de livraison :</strong>{" "}
                {selectedOrder.shippingAddress.address},{" "}
                {selectedOrder.shippingAddress.city} —{" "}
                {selectedOrder.shippingAddress.phone}
              </p>
              <p>
                <strong>Mode de paiement :</strong>{" "}
                {getPaymentLabel(selectedOrder.paymentMethod)}
              </p>

              <div>
                <strong>Articles :</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: "20px" }}>
                  {selectedOrder.items.map((item, idx) => (
                    <li key={idx} style={{ fontSize: "0.9rem" }}>
                      {item.name} × {item.quantity} —{" "}
                      {(item.price * item.quantity).toLocaleString("fr-FR")}{" "}
                      FCFA
                    </li>
                  ))}
                </ul>
              </div>

              <p style={{ marginTop: "8px" }}>
                <strong>Sous-total :</strong>{" "}
                {selectedOrder.subtotal.toLocaleString("fr-FR")} FCFA
                <br />
                <strong>Livraison :</strong>{" "}
                {selectedOrder.shippingFee.toLocaleString("fr-FR")} FCFA
                {selectedOrder.discount > 0 && (
                  <>
                    <br />
                    <strong>Réduction :</strong> -
                    {selectedOrder.discount.toLocaleString("fr-FR")} FCFA
                  </>
                )}
                <br />
                <strong>Total : </strong>
                {selectedOrder.total.toLocaleString("fr-FR")} FCFA
              </p>

              <div className="form-group">
                <label>Statut de la commande</label>
                <select
                  className="form-control"
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder, e.target.value)
                  }
                >
                  <option>En attente</option>
                  <option>Payé</option>
                  <option>En cours</option>
                  <option>Livré</option>
                  <option>Annulé</option>
                </select>
              </div>
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
