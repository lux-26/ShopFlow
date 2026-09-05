import { useState, useEffect } from "react";
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
import { useToast } from "../../../context/ToastContext";

export default function ProfileInfos({
  userInfo,
  setUserInfo,
  handleSaveProfile,
  recentOrders,
  loyaltyPoints,
  setActiveTab,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showAdvantagesModal, setShowAdvantagesModal] = useState(false);
  const { showToast } = useToast();

  const [savedUser, setSavedUser] = useState(
    () => JSON.parse(localStorage.getItem("shopflow_user_info")) || {},
  );

  useEffect(() => {
    const syncUserData = () => {
      const data = JSON.parse(localStorage.getItem("shopflow_user_info")) || {};
      setSavedUser(data);
    };

    window.addEventListener("storage", syncUserData);
    window.addEventListener("userInfoUpdated", syncUserData);
    window.addEventListener("userAvatarUpdated", syncUserData);

    return () => {
      window.removeEventListener("storage", syncUserData);
      window.removeEventListener("userInfoUpdated", syncUserData);
      window.removeEventListener("userAvatarUpdated", syncUserData);
    };
  }, []);

  const currentInfo = {
    firstName: userInfo?.firstName || savedUser.firstName || "",
    lastName: userInfo?.lastName || savedUser.lastName || "",
    email: userInfo?.email || savedUser.email || "",
    phone: userInfo?.phone || savedUser.phone || "",
    address: userInfo?.address || savedUser.address || "",
    avatar: userInfo?.avatar || savedUser.avatar || "",
  };

  const getInitials = (user) => {
    if (!user) return "";
    let firstName = user.firstName || "";
    let lastName = user.lastName || "";

    if (
      !firstName &&
      !lastName &&
      (user.FullName || user.name || user.fullName)
    ) {
      const fullName = user.FullName || user.name || user.fullName;
      const parts = fullName.trim().split(" ");
      firstName = parts[0] || "";
      lastName = parts.length > 1 ? parts[parts.length - 1] : "";
    }

    const first = firstName ? firstName.charAt(0) : "";
    const last = lastName && lastName !== firstName ? lastName.charAt(0) : "";
    const initials = (first + last).toUpperCase();
    return initials !== "" ? initials : null;
  };

  const userInitials = getInitials(currentInfo);

  // Logique stricte identique à la sidebar : vérifie si l'avatar est une vraie image encodée Base64
  const hasRealAvatarImage =
    currentInfo?.avatar &&
    typeof currentInfo.avatar === "string" &&
    currentInfo.avatar.startsWith("data:image");

  const onSaveClick = () => {
    setIsEditing(false);

    if (typeof setUserInfo === "function") {
      setUserInfo(currentInfo);
    }

    localStorage.setItem("shopflow_user_info", JSON.stringify(currentInfo));

    if (typeof handleSaveProfile === "function") {
      handleSaveProfile(currentInfo);
    }

    window.dispatchEvent(new Event("userInfoUpdated"));
    window.dispatchEvent(new Event("storage"));

    showToast(
      "Succès",
      "Vos informations personnelles ont été mises à jour avec succès.",
      "success",
    );
  };

  const maxPoints = 20000;
  const pointsNeeded = Math.max(0, maxPoints - loyaltyPoints);
  const progressPercentage = Math.min(100, (loyaltyPoints / maxPoints) * 100);

  return (
    <div style={{ position: "relative" }} className="page-transition">
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

        {/* BADGE HAUT DROITE - Aligné strictement sur la logique de la Sidebar */}
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
          <div style={{ width: "48px", height: "48px", flexShrink: 0 }}>
            {hasRealAvatarImage ? (
              <img
                src={currentInfo.avatar}
                alt="Photo de profil de l'utilisateur"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #e2e8f0",
                }}
              />
            ) : userInitials ? (
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
                  fontSize: "1rem",
                  border: "2px solid #e2e8f0",
                }}
              >
                {userInitials}
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  backgroundColor: "#e2e8f0",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  border: "2px solid #e2e8f0",
                }}
              >
                <FontAwesomeIcon icon={faUser} />
              </div>
            )}
          </div>

          <div>
            <strong style={{ display: "block", color: "#1e293b" }}>
              {currentInfo.firstName || currentInfo.lastName
                ? `${currentInfo.firstName} ${currentInfo.lastName}`.trim()
                : "Utilisateur"}
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
                      color:
                        currentInfo.firstName || currentInfo.lastName
                          ? "#1e293b"
                          : "#94a3b8",
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
                    {currentInfo.firstName || currentInfo.lastName
                      ? `${currentInfo.firstName} ${currentInfo.lastName}`.trim()
                      : "Aucun nom renseigné"}
                  </div>
                )}
              </div>

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
                    placeholder="exemple@email.com"
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
                      color: currentInfo.email ? "#1e293b" : "#94a3b8",
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
                    {currentInfo.email || "Aucun email renseigné"}
                  </div>
                )}
              </div>

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
                    placeholder="+221 77 000 00 00"
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
                      color: currentInfo.phone ? "#1e293b" : "#94a3b8",
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
                    {currentInfo.phone || "Aucun numéro de téléphone renseigné"}
                  </div>
                )}
              </div>

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
                    placeholder="Entrez votre adresse complète..."
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
                      color: currentInfo.address ? "#1e293b" : "#94a3b8",
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
                    {currentInfo.address || "Aucune adresse renseignée"}
                  </div>
                )}
              </div>
            </div>
          </div>

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
                  PROGRAMME DE FIDÉLITÉ (MEMBRE OR)
                </span>
                <h2 style={{ fontSize: "1.8rem", margin: "8px 0 4px 0" }}>
                  {loyaltyPoints.toLocaleString()} pts
                </h2>
                <p style={{ margin: 0, fontSize: "0.9rem", opacity: "0.9" }}>
                  {pointsNeeded > 0 ? (
                    `Plus que ${pointsNeeded.toLocaleString()} points pour atteindre le palier Platine.`
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
                onClick={() => setShowAdvantagesModal(true)}
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

      {showAdvantagesModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "16px",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              position: "relative",
            }}
          >
            <h3
              style={{
                color: "#1e3a8a",
                marginTop: 0,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FontAwesomeIcon icon={faAward} style={{ color: "#d97706" }} />{" "}
              Vos Avantages Membre Or
            </h3>
            <ul
              style={{
                paddingLeft: "20px",
                color: "#334155",
                lineHeight: "1.6",
                margin: "16px 0",
              }}
            >
              <li>
                <strong>-10% de réduction</strong> sur toutes vos commandes
              </li>
              <li>
                <strong>Livraison gratuite</strong> dès 2 articles achetés
              </li>
              <li>
                <strong>Support client prioritaire</strong> 7j/7
              </li>
              <li>Accès en avant-première aux nouvelles collections</li>
            </ul>
            <button
              onClick={() => setShowAdvantagesModal(false)}
              style={{
                width: "100%",
                padding: "10px",
                background: "#1e3a8a",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              J'ai compris
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
