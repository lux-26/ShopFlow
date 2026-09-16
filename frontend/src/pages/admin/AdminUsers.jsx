import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPenToSquare,
  faTrashCan,
  faSliders,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../../context/ToastContext";
import Pagination from "../../components/admin/Pagination";
import apiClient from "../../utils/apiClient";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const { showToast } = useToast();

  const loadUsers = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await apiClient.get("/users");
      setUsers(data.users);
    } catch (error) {
      setLoadError(error.message || "Impossible de charger les utilisateurs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
    const intervalId = window.setInterval(loadUsers, 30_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Supprimer le compte de ${user.name} ?`)) return;

    try {
      await apiClient.delete(`/users/${user.id}`);
      setUsers((currentUsers) =>
        currentUsers.filter((item) => item.id !== user.id),
      );
      showToast(
        "Utilisateur supprimé",
        `Le compte de ${user.name} a bien été supprimé.`,
        "success",
      );
    } catch (error) {
      showToast("Erreur", error.message || "Suppression impossible.", "error");
    }
  };

  const filteredUsers = users.filter((user) => {
    const normalizedSearch = searchTerm.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(normalizedSearch) ||
      user.email.toLowerCase().includes(normalizedSearch);
    const matchesRole = selectedRole === "Tous" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedUsers = filteredUsers.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize,
  );

  return (
    <div className="admin-content-wrapper page-transition">
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Gestion des Utilisateurs</h1>
          <p className="page-subtitle">
            Consultez et gérez les comptes clients et administrateurs.
          </p>
        </div>
      </div>

      <div className="filters-container-card">
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div
            className="search-box-large"
            style={{ flex: 1, marginBottom: 0 }}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <select
            className="filter-select"
            value={selectedRole}
            onChange={(event) => {
              setSelectedRole(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="Tous">Tous les rôles</option>
            <option value="CUSTOMER">Client</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button className="btn-filter-action" type="button">
            <FontAwesomeIcon icon={faSliders} /> Filtres
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-responsive">
          <table className="shopflow-table">
            <thead>
              <tr>
                <th>NOM</th>
                <th>EMAIL</th>
                <th>RÔLE</th>
                <th>COMMANDES</th>
                <th>STATUT</th>
                <th style={{ textAlign: "right" }}>ACTIONS</th>
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
                    utilisateurs...
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#dc2626",
                    }}
                  >
                    {loadError}{" "}
                    <button className="link-primary" onClick={loadUsers}>
                      Réessayer
                    </button>
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "30px" }}
                  >
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  const initials = user.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .toUpperCase();
                  const isAdmin = user.role === "ADMIN";
                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="product-item-cell">
                          {user.avatar ? (
                            <img
                              className="order-client-avatar"
                              src={user.avatar}
                              alt={`Photo de ${user.name}`}
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <div
                              className="order-client-avatar"
                              style={{
                                backgroundColor: isAdmin
                                  ? "#b91c1c"
                                  : "#1e3a8a",
                                color: "#fff",
                              }}
                            >
                              {initials}
                            </div>
                          )}
                          <span className="product-name">{user.name}</span>
                        </div>
                      </td>
                      <td className="text-muted">{user.email}</td>
                      <td>
                        <span
                          className={`pill-badge ${isAdmin ? "badge-warning" : "badge-success"}`}
                        >
                          <span className="badge-dot" />{" "}
                          {isAdmin ? "Admin" : "Client"}
                        </span>
                      </td>
                      <td>
                        <span className="stock-text-normal">
                          {user.orders} commandes
                        </span>
                      </td>
                      <td>
                        <span
                          className={`pill-badge ${user.status === "En ligne" ? "badge-success" : "badge-warning"}`}
                        >
                          <span className="badge-dot" /> {user.status}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="btn-icon"
                          title="Modification bientôt disponible"
                          type="button"
                          disabled
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                        <button
                          className="btn-icon text-danger"
                          title="Supprimer"
                          type="button"
                          onClick={() => handleDeleteUser(user)}
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
          totalItems={filteredUsers.length}
          pageSize={pageSize}
          itemLabel="utilisateurs"
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
