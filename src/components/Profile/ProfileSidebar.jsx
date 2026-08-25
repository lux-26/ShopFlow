import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faShieldAlt,
  faBell,
  faCreditCard,
  faSignOutAlt,
  faCamera,
  faTriangleExclamation,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";

export default function ProfileSidebar({
  activeTab,
  setActiveTab,
  userInfo,
  setUserInfo,
}) {
  const navigate = useNavigate();

  // État pour afficher ou masquer la modale personnalisée de déconnexion
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // États pour le toast de notification
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({ title: "", message: "" });

  const triggerPopup = (title, message) => {
    setPopupData({ title, message });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  // Gestion du changement de la photo de profil
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const updatedUser = { ...userInfo, avatar: imageUrl };
      setUserInfo(updatedUser);

      // Sauvegarde dans la clé unifiée "shopflow_user_info"
      localStorage.setItem("shopflow_user_info", JSON.stringify(updatedUser));

      // Synchronisation avec le Header et le reste du site
      localStorage.setItem("shopflow_user_avatar", imageUrl);
      window.dispatchEvent(new Event("storage"));

      // Déclenchement du toast unifié
      triggerPopup(
        "Succès",
        "Votre photo de profil a été mise à jour avec succès.",
      );
    }
  };

  // Exécution effective de la déconnexion
  const confirmLogout = () => {
    localStorage.removeItem("shopflow_is_logged");
    localStorage.removeItem("shopflow_user_avatar");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  return (
    <>
      {/* Toast de notification unifié en bas à droite */}
      {showPopup && (
        <div
          className="custom-toast-notification"
          style={{ borderLeftColor: "#1e3a8a" }}
        >
          <div className="toast-icon-wrapper" style={{ color: "#1e3a8a" }}>
            <FontAwesomeIcon icon={faCircleInfo} />
          </div>
          <div className="toast-content">
            <span className="toast-title">{popupData.title}</span>
            <p className="toast-message">{popupData.message}</p>
          </div>
        </div>
      )}

      <div className="profile-sidebar">
        <div className="profile-avatar-section">
          <label
            htmlFor="sidebar-avatar-input"
            style={{
              cursor: "pointer",
              position: "relative",
              display: "inline-block",
            }}
          >
            <img
              src={
                userInfo.avatar ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              }
              alt="Avatar"
              className="profile-avatar-img"
            />
            <div
              style={{
                position: "absolute",
                bottom: "12px",
                right: "0",
                background: "#1e3a8a",
                color: "white",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              <FontAwesomeIcon icon={faCamera} size="xs" />
            </div>
          </label>
          <input
            id="sidebar-avatar-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          <h3>
            {userInfo.firstName} {userInfo.lastName}
          </h3>
          <p>Gérez vos préférences</p>
        </div>

        <nav className="profile-nav-links">
          <button
            className={`nav-link-item ${activeTab === "infos" ? "active" : ""}`}
            onClick={() => setActiveTab("infos")}
          >
            <FontAwesomeIcon icon={faUser} /> Infos Personnelles
          </button>
          <button
            className={`nav-link-item ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <FontAwesomeIcon icon={faShieldAlt} /> Sécurité
          </button>
          <button
            className={`nav-link-item ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            <FontAwesomeIcon icon={faBell} /> Notifications
          </button>
          <button
            className={`nav-link-item ${activeTab === "payment" ? "active" : ""}`}
            onClick={() => setActiveTab("payment")}
          >
            <FontAwesomeIcon icon={faCreditCard} /> Moyens de Paiement
          </button>
        </nav>

        <div
          className="profile-sidebar-footer"
          style={{
            marginTop: "auto",
            padding: "16px 24px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <button
            className="btn-logout-sidebar"
            onClick={() => setShowLogoutModal(true)}
            style={{
              background: "#b91c1c",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "6px",
              width: "100%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontWeight: "600",
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} /> Déconnexion
          </button>
        </div>
      </div>

      {/* Modale de confirmation personnalisée */}
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
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "#b91c1c",
                fontSize: "2rem",
                marginBottom: "12px",
              }}
            >
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </div>
            <h3
              style={{
                marginBottom: "8px",
                color: "#1e293b",
                fontSize: "1.25rem",
              }}
            >
              Confirmation de déconnexion
            </h3>
            <p
              style={{
                color: "#64748b",
                marginBottom: "24px",
                fontSize: "0.95rem",
              }}
            >
              Voulez-vous vraiment vous déconnecter de votre compte ShopFlow ?
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "white",
                  color: "#334155",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Annuler
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#b91c1c",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
