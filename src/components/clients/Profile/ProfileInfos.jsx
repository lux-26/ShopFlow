import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCheck,
  faPen,
  faAward,
  faGift,
  faHistory,
  faArrowRight,
  faTrophy,
  faEnvelope,
  faPhone,
  faLocationDot,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export default function ProfileInfos({
  userInfo,
  setUserInfo,
  handleSaveProfile,
  recentOrders,
  loyaltyPoints,
  setActiveTab,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  // Récupération sécurisée depuis le state ou le localStorage
  const savedUser =
    JSON.parse(localStorage.getItem("shopflow_user_info")) || {};

  const currentInfo = {
    firstName: userInfo?.firstName || savedUser.firstName || "Abdoulaye",
    lastName: userInfo?.lastName || savedUser.lastName || "Tamba",
    email: userInfo?.email || savedUser.email || "abdoulaye.tamba@example.com",
    phone: userInfo?.phone || savedUser.phone || "+221 77 000 00 00",
    address: userInfo?.address || savedUser.address || "Dakar, Sénégal",
    avatar: userInfo?.avatar || savedUser.avatar || "",
  };

  // Fonction pour extraire les initiales (ex: "Abdoulaye Tamba" -> "AT")
  const getInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0) : "";
    const last = lastName ? lastName.charAt(0) : "";
    return (first + last).toUpperCase() || "AT";
  };

  // État local pour les notifications (Toast)
  const [toast, setToast] = useState({
    show: false,
    title: "",
    message: "",
  });

  const showToast = (title, message) => {
    setToast({ show: true, title, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  const onSaveClick = () => {
    setIsEditing(false);
    handleSaveProfile();
    showToast(
      "Succès",
      "Vos informations personnelles ont été mises à jour avec succès.",
    );
  };

  const handleOpenAdvantages = () => {
    showToast(
      "Avantages Membre Or",
      "-10% sur vos commandes | Livraison gratuite dès 2 articles | Support prioritaire",
    );
  };

  const maxPoints = 2500;
  const pointsNeeded = Math.max(0, maxPoints - loyaltyPoints);
  const progressPercentage = Math.min(100, (loyaltyPoints / maxPoints) * 100);

  return (
    <div style={{ position: "relative" }} className="page-transition">
      {/* En-tête avec Avatar / Initiales (Sans icônes superflues) */}
      <div
        className="profile-top-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1>Informations Personnelles</h1>
          <p style={{ color: "#64748b", margin: 0 }}>
            Gérez vos informations de contact et votre adresse de livraison.
          </p>
        </div>

        <div
          className="profile-badge-card"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "#fff",
            padding: "10px 16px",
            borderRadius: "12px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          {/* Bloc Avatar / Initiales simple et épuré */}
          <div style={{ width: "48px", height: "48px" }}>
            {currentInfo.avatar && currentInfo.avatar.trim() !== "" ? (
              <img
                src={currentInfo.avatar}
                alt="Avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #e2e8f0",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  backgroundColor: "#1e3a8a",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "0.95rem",
                  border: "2px solid #e2e8f0",
                }}
              >
                {getInitials(currentInfo.firstName, currentInfo.lastName)}
              </div>
            )}
          </div>

          <div>
            <strong style={{ display: "block", color: "#1e293b" }}>
              {currentInfo.firstName} {currentInfo.lastName}
            </strong>
            <span
              className="gold-badge"
              style={{
                color: "#d97706",
                fontSize: "0.85rem",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <FontAwesomeIcon icon={faAward} /> Membre Or
            </span>
          </div>
        </div>
      </div>

      <div
        className="profile-grid-layout"
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "24px",
        }}
      >
        {/* Colonne Gauche : Coordonnées & Fidélité */}
        <div
          className="profile-left-col"
          style={{ display: "flex", flexDirection: "column", gap: "24px" }}
        >
          <div
            className="profile-card"
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "16px",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
            }}
          >
            <div
              className="card-header-flex"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#1e3a8a",
                  margin: 0,
                  fontSize: "1.1rem",
                }}
              >
                <FontAwesomeIcon icon={faUser} /> Coordonnées
              </h3>
              {isEditing ? (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setIsEditing(false)}
                    style={{
                      background: "#f1f5f9",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      color: "#64748b",
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Annuler
                  </button>
                  <button
                    className="btn-save-profile"
                    onClick={onSaveClick}
                    style={{
                      background: "#166534",
                      color: "#fff",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <FontAwesomeIcon icon={faCheck} /> Enregistrer
                  </button>
                </div>
              ) : (
                <button
                  className="btn-edit-profile"
                  onClick={() => setIsEditing(true)}
                  style={{
                    background: "#eff6ff",
                    color: "#1e3a8a",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FontAwesomeIcon icon={faPen} /> Modifier
                </button>
              )}
            </div>

            <div
              className="form-grid-profile"
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {/* Nom Complet */}
              <div className="input-group">
                <label
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#64748b",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Nom Complet
                </label>
                {isEditing ? (
                  <div
                    className="name-inputs-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                    }}
                  >
                    <input
                      type="text"
                      value={currentInfo.firstName}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, firstName: e.target.value })
                      }
                      placeholder="Prénom"
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        outline: "none",
                      }}
                    />
                    <input
                      type="text"
                      value={currentInfo.lastName}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, lastName: e.target.value })
                      }
                      placeholder="Nom"
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        outline: "none",
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="static-field"
                    style={{
                      padding: "12px 14px",
                      background: "#f8fafc",
                      borderRadius: "8px",
                      color: "#1e293b",
                      fontWeight: "500",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faUser}
                      style={{ color: "#94a3b8" }}
                    />
                    {currentInfo.firstName} {currentInfo.lastName}
                  </div>
                )}
              </div>

              {/* Adresse Email */}
              <div className="input-group">
                <label
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#64748b",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Adresse Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={currentInfo.email}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, email: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      outline: "none",
                    }}
                  />
                ) : (
                  <div
                    className="static-field"
                    style={{
                      padding: "12px 14px",
                      background: "#f8fafc",
                      borderRadius: "8px",
                      color: "#1e293b",
                      fontWeight: "500",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      style={{ color: "#94a3b8" }}
                    />
                    {currentInfo.email}
                  </div>
                )}
              </div>

              {/* Numéro de Téléphone */}
              <div className="input-group">
                <label
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#64748b",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Numéro de Téléphone
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentInfo.phone}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, phone: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      outline: "none",
                    }}
                  />
                ) : (
                  <div
                    className="static-field"
                    style={{
                      padding: "12px 14px",
                      background: "#f8fafc",
                      borderRadius: "8px",
                      color: "#1e293b",
                      fontWeight: "500",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faPhone}
                      style={{ color: "#94a3b8" }}
                    />
                    {currentInfo.phone}
                  </div>
                )}
              </div>

              {/* Adresse de Livraison */}
              <div className="input-group">
                <label
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#64748b",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Adresse de Livraison Principale
                </label>
                {isEditing ? (
                  <textarea
                    value={currentInfo.address}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, address: e.target.value })
                    }
                    rows="2"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                ) : (
                  <div
                    className="static-field"
                    style={{
                      padding: "12px 14px",
                      background: "#f8fafc",
                      borderRadius: "8px",
                      color: "#1e293b",
                      fontWeight: "500",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      style={{ color: "#94a3b8" }}
                    />
                    {currentInfo.address}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Programme de Fidélité */}
          <div
            className="loyalty-banner-card"
            style={{
              background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
              borderRadius: "16px",
              padding: "24px",
              color: "#fff",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
            }}
          >
            <div
              className="loyalty-banner-content"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <div>
                <span
                  className="loyalty-tag"
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    letterSpacing: "0.5px",
                  }}
                >
                  PROGRAMME DE FIDÉLITÉ
                </span>
                <h2 style={{ fontSize: "1.8rem", margin: "8px 0 4px 0" }}>
                  {loyaltyPoints.toLocaleString()} pts
                </h2>
                <p style={{ margin: 0, fontSize: "0.9rem", opacity: "0.9" }}>
                  {pointsNeeded > 0 ? (
                    `Plus que ${pointsNeeded.toLocaleString()} points pour le palier Platine.`
                  ) : (
                    <span
                      className="loyalty-achieved-text"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      Félicitations ! Palier Platine atteint{" "}
                      <FontAwesomeIcon
                        icon={faTrophy}
                        style={{ color: "#fbbf24" }}
                      />
                    </span>
                  )}
                </p>
              </div>
              <button
                className="btn-loyalty-advantages"
                onClick={handleOpenAdvantages}
                style={{
                  background: "#fff",
                  color: "#1e3a8a",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <FontAwesomeIcon icon={faGift} /> Voir mes avantages
              </button>
            </div>
            <div
              className="loyalty-progress-bar"
              style={{
                background: "rgba(255,255,255,0.3)",
                height: "8px",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                className="loyalty-progress-fill"
                style={{
                  width: `${progressPercentage}%`,
                  background: "#fbbf24",
                  height: "100%",
                  borderRadius: "4px",
                  transition: "width 0.3s ease",
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Commandes Récentes */}
        <div className="profile-right-col">
          <div
            className="profile-card orders-card"
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "16px",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#1e3a8a",
                margin: "0 0 16px 0",
                fontSize: "1.1rem",
              }}
            >
              <FontAwesomeIcon icon={faHistory} /> Commandes Récentes
            </h3>

            <div
              className="orders-list-stack"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {!recentOrders || recentOrders.length === 0 ? (
                <p
                  className="no-orders-message"
                  style={{
                    color: "#6b7280",
                    textAlign: "center",
                    padding: "40px 0",
                    fontStyle: "italic",
                  }}
                >
                  Aucune commande récente pour le moment.
                </p>
              ) : (
                recentOrders.slice(0, 4).map((order, index) => (
                  <div
                    className="order-item-card"
                    key={index}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                      background: "#f8fafc",
                    }}
                  >
                    <div
                      className="order-item-top"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >
                      <strong style={{ color: "#1e293b" }}>{order.id}</strong>
                      <span
                        className={`status-pill ${
                          order.status === "LIVRÉ" ? "delivered" : "pending"
                        }`}
                        style={{
                          fontSize: "0.75rem",
                          padding: "2px 8px",
                          borderRadius: "20px",
                          fontWeight: "600",
                          background:
                            order.status === "LIVRÉ" ? "#dcfce7" : "#fef3c7",
                          color:
                            order.status === "LIVRÉ" ? "#166534" : "#92400e",
                        }}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p
                      className="order-item-details"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: 0,
                        fontSize: "0.85rem",
                        color: "#64748b",
                      }}
                    >
                      <span>
                        {order.itemsCount} Article
                        {order.itemsCount > 1 ? "s" : ""} • {order.date}
                      </span>
                      <span
                        className="order-price-tag"
                        style={{ fontWeight: "600", color: "#1e293b" }}
                      >
                        {order.price}
                      </span>
                    </p>
                  </div>
                ))
              )}
            </div>

            <button
              className="btn-view-all-orders"
              onClick={() => setActiveTab("orders")}
              style={{
                width: "100%",
                marginTop: "16px",
                padding: "12px",
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                fontWeight: "600",
                color: "#1e3a8a",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              Voir tout l'historique{" "}
              <FontAwesomeIcon icon={faArrowRight} size="xs" />
            </button>
          </div>
        </div>
      </div>

      {/* Pop-up / Toast de notification intégré */}
      {toast.show && (
        <div
          className="custom-toast-notification"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#fff",
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            borderLeft: "4px solid #166534",
            zIndex: 1100,
          }}
        >
          <div
            className="toast-icon-wrapper"
            style={{
              background: "#dcfce7",
              color: "#166534",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <div className="toast-content">
            <span
              className="toast-title"
              style={{ fontWeight: "700", color: "#1e293b", display: "block" }}
            >
              {toast.title}
            </span>
            <p
              className="toast-message"
              style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}
            >
              {toast.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
