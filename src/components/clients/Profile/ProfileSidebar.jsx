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
  faHistory,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../../../context/ToastContext";

export default function ProfileSidebar({
  activeTab,
  setActiveTab,
  userInfo,
  setUserInfo,
}) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        const updatedUser = { ...userInfo, avatar: base64Image };

        setUserInfo(updatedUser);

        localStorage.setItem("shopflow_user_info", JSON.stringify(updatedUser));
        localStorage.setItem("shopflow_user_avatar", base64Image);

        window.dispatchEvent(new Event("userAvatarUpdated"));
        window.dispatchEvent(new Event("storage"));

        showToast(
          "Succès",
          "Votre photo de profil a été mise à jour avec succès.",
          "success",
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const updatedUser = { ...userInfo, avatar: "" };
    setUserInfo(updatedUser);

    localStorage.setItem("shopflow_user_info", JSON.stringify(updatedUser));
    localStorage.removeItem("shopflow_user_avatar");

    window.dispatchEvent(new Event("userAvatarUpdated"));
    window.dispatchEvent(new Event("storage"));

    showToast(
      "Suppression",
      "Votre photo de profil a été supprimée. Les initiales s'affichent de nouveau.",
      "success",
    );
  };

  const confirmLogout = () => {
    // 1. Suppression de toutes les données sensibles et d'authentification
    localStorage.removeItem("shopflow_is_logged");
    localStorage.removeItem("shopflow_user_info");
    localStorage.removeItem("shopflow_user_avatar");
    localStorage.removeItem("shopflow_notifications");

    // 2. Réinitialisation de l'état utilisateur global dans le composant parent
    if (typeof setUserInfo === "function") {
      setUserInfo(null);
    }

    // 3. Déclenchement des événements et redirection vers le login
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

  // Vraie vérification : une image valide doit impérativement commencer par "data:image" (provenant du FileReader)
  const hasRealAvatarImage =
    userInfo?.avatar &&
    typeof userInfo.avatar === "string" &&
    userInfo.avatar.startsWith("data:image");

  return (
    <>
      <div className="profile-sidebar">
        <div className="profile-avatar-section">
          <div
            style={{
              position: "relative",
              display: "inline-block",
              marginBottom: "12px",
            }}
          >
            {/* Cas 2 : Une vraie image encodée existe -> On l'affiche */}
            {hasRealAvatarImage ? (
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
              /* Cas 1 & 3 : Pas de vraie image -> On affiche les initiales dans le rond bleu identique au header */
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

            {/* Bouton Corbeille (visible uniquement si une vraie image d'avatar est présente) */}
            {hasRealAvatarImage && (
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
            <div style={{ design: "flex", gap: "12px", display: "flex" }}>
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
