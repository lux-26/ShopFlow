import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPenToSquare,
  faTrashCan,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../../context/ToastContext"; // Ajustez le chemin selon votre structure
import Pagination from "../../components/admin/Pagination";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const { showToast } = useToast();

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Amadou Koné",
      email: "amadou.kone@gmail.com",
      avatarBg: "#1e3a8a",
      role: "Client",
      orders: 12,
      status: "Actif",
      statusType: "success",
    },
    {
      id: 2,
      name: "Mariam Diallo",
      email: "mariam.d@yahoo.fr",
      avatarBg: "#854d0e",
      role: "Client",
      orders: 5,
      status: "Actif",
      statusType: "success",
    },
    {
      id: 3,
      name: "Seydou Traoré",
      email: "seydou.t@outlook.com",
      avatarBg: "#475569",
      role: "Client",
      orders: 8,
      status: "Inactif",
      statusType: "warning",
    },
    {
      id: 4,
      name: "Fatou Sow",
      email: "fatou.sow@shopflow.ci",
      avatarBg: "#b91c1c",
      role: "Admin",
      orders: 0,
      status: "Actif",
      statusType: "success",
    },
  ]);

  const handleDeleteUser = (id, name) => {
    setUsers(users.filter((item) => item.id !== id));
    showToast({
      title: "Utilisateur supprimé",
      message: `L'utilisateur ${name} a bien été supprimé`,
      type: "success",
    });
  };

  const handleEditUser = (name) => {
    showToast(`Modification de l'utilisateur ${name}`, "info");
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "Tous" || u.role === selectedRole;
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
      {/* En-tête de la page */}
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Gestion des Utilisateurs</h1>
          <p className="page-subtitle">
            Consultez et gérez les comptes clients et administrateurs.
          </p>
        </div>
      </div>

      {/* Carte des filtres et recherche */}
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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <select
            className="filter-select"
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="Tous">Tous les rôles</option>
            <option value="Client">Client</option>
            <option value="Admin">Admin</option>
          </select>
          <button className="btn-filter-action">
            <FontAwesomeIcon icon={faSliders} /> Filtres
          </button>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
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
              {paginatedUsers.map((u) => {
                const initials = u.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("");

                return (
                  <tr key={u.id}>
                    <td>
                      <div className="product-item-cell">
                        <div
                          className="order-client-avatar"
                          style={{ backgroundColor: u.avatarBg, color: "#fff" }}
                        >
                          {initials}
                        </div>
                        <span className="product-name">{u.name}</span>
                      </div>
                    </td>
                    <td className="text-muted">{u.email}</td>
                    <td>
                      <span
                        className={`pill-badge ${
                          u.role === "Admin" ? "badge-warning" : "badge-success"
                        }`}
                      >
                        <span className="badge-dot"></span>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className="stock-text-normal">
                        {u.orders} commandes
                      </span>
                    </td>
                    <td>
                      <span
                        className={`pill-badge ${
                          u.status === "Actif"
                            ? "badge-success"
                            : "badge-warning"
                        }`}
                      >
                        <span className="badge-dot"></span>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn-icon"
                        title="Modifier"
                        onClick={() => handleEditUser(u.name)}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        className="btn-icon text-danger"
                        title="Supprimer"
                        onClick={() => handleDeleteUser(u.id, u.name)}
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
