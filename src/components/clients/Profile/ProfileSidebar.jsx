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
  faHistory,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export default function ProfileSidebar({
  activeTab,
  setActiveTab,
  userInfo,
  setUserInfo,
}) {
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({ title: "", message: "" });

  const triggerPopup = (title, message) => {
    setPopupData({ title, message });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const getInitials = (user) => {
    if (!user) return "";
    let firstName = user.firstName || "";
    let lastName = user.lastName || "";

    if (!firstName && !lastName && user.name) {
      const parts = user.name.trim().split(" ");
      firstName = parts[0] || "";
      lastName = parts.length > 1 ? parts[parts.length - 1] : "";
    }

    const first = firstName ? firstName.charAt(0) : "";
    const last = lastName && lastName !== firstName ? lastName.charAt(0) : "";
    const initials = (first + last).toUpperCase();
    return initials !== "" ? initials : null;
  };

  // --- Gestion propre de l'ajout d'image (conversion Base64 pour persistance fiable) ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        const updatedUser = { ...userInfo, avatar: base64Image };

        setUserInfo(updatedUser);

        // Sauvegarde unifiée
        localStorage.setItem("shopflow_user_info", JSON.stringify(updatedUser));
        localStorage.setItem("shopflow_user_avatar", base64Image);

        // Déclenchement des événements pour mettre à jour le Header et le reste de l'app en direct
        window.dispatchEvent(new Event("userAvatarUpdated"));
        window.dispatchEvent(new Event("storage"));

        triggerPopup(
          "Succès",
          "Votre photo de profil a été mise à jour avec succès.",
        );
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Suppression propre de la photo ---
  const handleRemoveAvatar = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // On supprime l'avatar en mettant une chaîne vide
    const updatedUser = { ...userInfo, avatar: "" };
    setUserInfo(updatedUser);

    localStorage.setItem("shopflow_user_info", JSON.stringify(updatedUser));
    localStorage.removeItem("shopflow_user_avatar");

    window.dispatchEvent(new Event("userAvatarUpdated"));
    window.dispatchEvent(new Event("storage"));

    triggerPopup(
      "Suppression",
      "Votre photo de profil a été supprimée. Les initiales s'affichent de nouveau.",
    );
  };

  const confirmLogout = () => {
    localStorage.removeItem("shopflow_is_logged");
    localStorage.removeItem("shopflow_user_avatar");
    localStorage.removeItem("shopflow_notifications");
    window.dispatchEvent(new Event("notificationUpdated"));
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  const getDisplayName = () => {
    if (!userInfo) return "Utilisateur";
    if (userInfo.firstName || userInfo.lastName) {
      return `${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim();
    }
    return userInfo.name || "Utilisateur";
  };

  const userInitials = getInitials(userInfo);

  // Vérification stricte pour savoir si une vraie image d'avatar est présente
  const hasValidAvatar =
    userInfo?.avatar &&
    typeof userInfo.avatar === "string" &&
    userInfo.avatar.trim() !== "" &&
    userInfo.avatar !== "null" &&
    userInfo.avatar !== "undefined";

  return (
    <>
      {showPopup && (
        <div
          className="custom-toast-notification page-transition"
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
          <div
            style={{
              position: "relative",
              display: "inline-block",
              marginBottom: "12px",
            }}
          >
            {/* Condition claire : Si l'image existe -> Afficher l'image. Sinon -> Afficher les initiales. */}
            {hasValidAvatar ? (
              <label
                htmlFor="sidebar-avatar-input"
                style={{ cursor: "pointer", display: "block" }}
              >
                <img
                  src={userInfo.avatar}
                  alt="Avatar"
                  className="profile-avatar-img"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </label>
            ) : userInitials ? (
              <label
                htmlFor="sidebar-avatar-input"
                style={{
                  cursor: "pointer",
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "#1e3a8a",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "1.5rem",
                  margin: "0 auto",
                }}
              >
                {userInitials}
              </label>
            ) : (
              <label
                htmlFor="sidebar-avatar-input"
                style={{
                  cursor: "pointer",
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "#e2e8f0",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  margin: "0 auto",
                }}
              >
                <FontAwesomeIcon icon={faUser} />
              </label>
            )}

            {/* Bouton caméra */}
            <label
              htmlFor="sidebar-avatar-input"
              style={{
                position: "absolute",
                bottom: "0",
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
                cursor: "pointer",
              }}
              title="Changer la photo"
            >
              <FontAwesomeIcon icon={faCamera} size="xs" />
            </label>

            {/* Bouton Corbeille (visible uniquement si un avatar valide est présent) */}
            {hasValidAvatar && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                title="Supprimer la photo"
                style={{
                  position: "absolute",
                  top: "0",
                  right: "0",
                  background: "#b91c1c",
                  color: "white",
                  border: "2px solid white",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  cursor: "pointer",
                  fontSize: "10px",
                }}
              >
                <FontAwesomeIcon icon={faTrash} size="xs" />
              </button>
            )}
          </div>

          <input
            id="sidebar-avatar-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          <h3>{getDisplayName()}</h3>
          <p>Gérez vos préférences</p>
        </div>

        {/* Le reste de vos onglets de navigation et de déconnexion ... */}
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
            className={`nav-link-item ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <FontAwesomeIcon icon={faHistory} /> Historique des commandes
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

      {showLogoutModal  && ( 
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
