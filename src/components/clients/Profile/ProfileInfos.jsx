import React, { useState } from "react";
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
} from "@fortawesome/free-solid-svg-icons";

export default function ProfileInfos({
  userInfo,
  setUserInfo,
  handleSaveProfile,
  recentOrders,
  loyaltyPoints,
}) {
  const [isEditing, setIsEditing] = useState(false);

  // État local pour gérer le popup (Toast) directement dans ce composant
  const [toast, setToast] = useState({
    show: false,
    title: "",
    message: "",
  });

  // Fonction interne pour déclencher et afficher le popup avec un effet de fondu automatique (optionnel, ex: 3 secondes)
  const showToast = (title, message) => {
    setToast({ show: true, title, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  const onSaveClick = () => {
    setIsEditing(false);
    handleSaveProfile();

    // Déclenchement du popup de notification unifié
    showToast(
      "Succès",
      "Vos informations personnelles ont été mises à jour avec succès.",
    );
  };

  // Fonction pour afficher le popup des avantages
  const handleOpenAdvantages = () => {
    showToast(
      "Avantages Membre Or",
      "-10% sur vos commandes | Livraison gratuite dès 2 articles | Support prioritaire",
    );
  };

  // Calcul du palier Platine (ex: 2500 points)
  const maxPoints = 2500;
  const pointsNeeded = Math.max(0, maxPoints - loyaltyPoints);
  const progressPercentage = Math.min(100, (loyaltyPoints / maxPoints) * 100);

  return (
    <div style={{ position: "relative" }}>
      <div className="profile-top-header">
        <div>
          <h1>Informations Personnelles</h1>
          <p>
            Gérez vos informations de contact et votre adresse de livraison.
          </p>
        </div>
        <div className="profile-badge-card">
          <img src={userInfo.avatar} alt="Mini Avatar" />
          <div>
            <strong>
              {userInfo.firstName} {userInfo.lastName}
            </strong>
            <span className="gold-badge">
              <FontAwesomeIcon icon={faAward} /> Membre Or
            </span>
          </div>
        </div>
      </div>

      <div className="profile-grid-layout">
        {/* Colonne Gauche : Coordonnées & Fidélité */}
        <div className="profile-left-col">
          <div className="profile-card">
            <div className="card-header-flex">
              <h3>
                <FontAwesomeIcon icon={faUser} /> Coordonnées
              </h3>
              {isEditing ? (
                <button className="btn-save-profile" onClick={onSaveClick}>
                  <FontAwesomeIcon icon={faCheck} /> Enregistrer
                </button>
              ) : (
                <button
                  className="btn-edit-profile"
                  onClick={() => setIsEditing(true)}
                >
                  <FontAwesomeIcon icon={faPen} /> Modifier
                </button>
              )}
            </div>

            <div className="form-grid-profile">
              <div className="input-group">
                <label>Nom Complet</label>
                {isEditing ? (
                  <div className="name-inputs-row">
                    <input
                      type="text"
                      value={userInfo.firstName}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, firstName: e.target.value })
                      }
                      placeholder="Prénom"
                    />
                    <input
                      type="text"
                      value={userInfo.lastName}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, lastName: e.target.value })
                      }
                      placeholder="Nom"
                    />
                  </div>
                ) : (
                  <div className="static-field">
                    {userInfo.firstName} {userInfo.lastName}
                  </div>
                )}
              </div>

              <div className="input-group">
                <label>Adresse Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, email: e.target.value })
                    }
                  />
                ) : (
                  <div className="static-field">{userInfo.email}</div>
                )}
              </div>

              <div className="input-group full-width">
                <label>Numéro de Téléphone</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userInfo.phone}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, phone: e.target.value })
                    }
                  />
                ) : (
                  <div className="static-field">{userInfo.phone}</div>
                )}
              </div>

              <div className="input-group full-width">
                <label>Adresse de Livraison Principale</label>
                {isEditing ? (
                  <textarea
                    value={userInfo.address}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, address: e.target.value })
                    }
                    rows="2"
                  />
                ) : (
                  <div className="static-field">{userInfo.address}</div>
                )}
              </div>
            </div>
          </div>

          {/* Programme de Fidélité */}
          <div className="loyalty-banner-card">
            <div className="loyalty-banner-content">
              <div>
                <span className="loyalty-tag">PROGRAMME DE FIDÉLITÉ</span>
                <h2>{loyaltyPoints.toLocaleString()} pts</h2>
                <p>
                  {pointsNeeded > 0 ? (
                    `Plus que ${pointsNeeded.toLocaleString()} points pour le palier Platine.`
                  ) : (
                    <span className="loyalty-achieved-text">
                      Félicitations ! Vous avez atteint le palier Platine{" "}
                      <FontAwesomeIcon
                        icon={faTrophy}
                        style={{ color: "#fbbf24", marginLeft: "5px" }}
                      />
                    </span>
                  )}
                </p>
              </div>
              <button
                className="btn-loyalty-advantages"
                onClick={handleOpenAdvantages}
              >
                <FontAwesomeIcon icon={faGift} /> Voir mes avantages
              </button>
            </div>
            <div className="loyalty-progress-bar">
              <div
                className="loyalty-progress-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Commandes Récentes */}
        <div className="profile-right-col">
          <div className="profile-card orders-card">
            <h3>
              <FontAwesomeIcon icon={faHistory} /> Commandes Récentes
            </h3>

            <div className="orders-list-stack">
              {!recentOrders || recentOrders.length === 0 ? (
                <p
                  className="no-orders-message"
                  style={{
                    color: "#6b7280",
                    textAlign: "center",
                    padding: "20px 0",
                  }}
                >
                  Aucune commande récente pour le moment.
                </p>
              ) : (
                recentOrders.slice(0, 4).map((order, index) => (
                  <div className="order-item-card" key={index}>
                    <div className="order-item-top">
                      <strong>{order.id}</strong>
                      <span
                        className={`status-pill ${
                          order.status === "LIVRÉ" ? "delivered" : "pending"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="order-item-details">
                      {order.itemsCount} Article
                      {order.itemsCount > 1 ? "s" : ""} • {order.date}
                      <span className="order-price-tag">{order.price}</span>
                    </p>
                  </div>
                ))
              )}
            </div>

            <button className="btn-view-all-orders">
              Voir tout l'historique{" "}
              <FontAwesomeIcon icon={faArrowRight} size="xs" />
            </button>
          </div>
        </div>
      </div>

      {/* Pop-up / Toast de notification unifié */}
      {toast.show && (
        <div className="custom-toast-notification">
          <div className="toast-icon-wrapper">
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <div className="toast-content">
            <span className="toast-title">{toast.title}</span>
            <p className="toast-message">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
