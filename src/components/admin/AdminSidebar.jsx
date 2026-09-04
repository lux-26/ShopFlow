import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShop,
  faChartPie,
  faBoxArchive,
  faBagShopping,
  faUsers,
  faGear,
  faStore,
  faRightFromBracket,
  faTriangleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export default function AdminSidebar({ isOpen = false, onClose = () => {} }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);

  // Fonction sécurisée pour vérifier si le lien est actif
  const isActive = (path) => (location.pathname === path ? "active" : "");

  const confirmLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/logout");
  };

  const confirmViewStore = () => {
    navigate("/");
  };

  return (
    <>
      <aside className={`admin-sidebar${isOpen ? " open" : ""}`}>
        <div className="sidebar-brand">
          <FontAwesomeIcon icon={faShop} className="brand-icon" />
          <div>
            <h2>ShopFlow Admin</h2>
            <span>Management Portal</span>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            aria-label="Fermer le menu"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <ul className="sidebar-menu">
          <li className={isActive("/admin") || isActive("/admin/dashboard")}>
            <Link to="dashboard" onClick={onClose}>
              <FontAwesomeIcon icon={faChartPie} /> Dashboard
            </Link>
          </li>
          <li className={isActive("/admin/products")}>
            <Link to="products" onClick={onClose}>
              <FontAwesomeIcon icon={faBoxArchive} /> Product Management
            </Link>
          </li>
          <li className={isActive("/admin/orders")}>
            <Link to="orders" onClick={onClose}>
              <FontAwesomeIcon icon={faBagShopping} /> Orders
            </Link>
          </li>
          <li className={isActive("/admin/users")}>
            <Link to="users" onClick={onClose}>
              <FontAwesomeIcon icon={faUsers} /> Users
            </Link>
          </li>
          <li className={isActive("/admin/settings")}>
            <Link to="settings" onClick={onClose}>
              <FontAwesomeIcon icon={faGear} /> Settings
            </Link>
          </li>
        </ul>

        <div className="sidebar-footer">
          <button
            onClick={() => setShowStoreModal(true)}
            className="view-store-btn"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
            }}
          >
            <FontAwesomeIcon icon={faStore} /> View Store
          </button>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="logout-btn"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
            }}
          >
            <FontAwesomeIcon icon={faRightFromBracket} /> Logout
          </button>
        </div>
      </aside>

      {/* MODALE LOGOUT */}
      {showLogoutModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "2.5rem 2rem",
              borderRadius: "16px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
              textAlign: "center",
              maxWidth: "420px",
              width: "90%",
            }}
          >
            <div
              style={{
                color: "#dc2626",
                fontSize: "2.5rem",
                marginBottom: "1rem",
              }}
            >
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </div>
            <h3
              style={{
                fontSize: "1.35rem",
                fontWeight: "700",
                color: "#0f172a",
                marginBottom: "0.75rem",
              }}
            >
              Confirmation de déconnexion
            </h3>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#64748b",
                marginBottom: "2rem",
                lineHeight: "1.5",
              }}
            >
              Voulez-vous vraiment vous déconnecter de votre compte ShopFlow ?
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  backgroundColor: "#ffffff",
                  color: "#0f172a",
                  border: "1px solid #cbd5e1",
                }}
              >
                Annuler
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  backgroundColor: "#dc2626",
                  color: "#ffffff",
                  border: "none",
                }}
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE VIEW STORE */}
      {showStoreModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "2.5rem 2rem",
              borderRadius: "16px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
              textAlign: "center",
              maxWidth: "420px",
              width: "90%",
            }}
          >
            <div
              style={{
                color: "#2563eb",
                fontSize: "2.5rem",
                marginBottom: "1rem",
              }}
            >
              <FontAwesomeIcon icon={faStore} />
            </div>
            <h3
              style={{
                fontSize: "1.35rem",
                fontWeight: "700",
                color: "#0f172a",
                marginBottom: "0.75rem",
              }}
            >
              Quitter l'espace admin ?
            </h3>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#64748b",
                marginBottom: "2rem",
                lineHeight: "1.5",
              }}
            >
              Voulez-vous retourner sur la page d'accueil de la boutique ?
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={() => setShowStoreModal(false)}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  backgroundColor: "#ffffff",
                  color: "#0f172a",
                  border: "1px solid #cbd5e1",
                }}
              >
                Annuler
              </button>
              <button
                onClick={confirmViewStore}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                }}
              >
                Aller à la boutique
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
