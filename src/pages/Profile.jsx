import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faShieldAlt,
  faBell,
  faCreditCard,
  faSignOutAlt,
  faCamera,
  faKey,
  faLock,
  faLaptop,
  faEnvelope,
  faMobileAlt,
  faCommentDots,
  faTrash,
  faTruck,
  faCheck,
  faPen,
  faAward,
  faGift,
  faHistory,
  faArrowRight,
  faShieldHalved,
  faMobileScreenButton,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "./Profile.css";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("infos");

  // États pour les informations personnelles éditables
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: "Ablaye",
    lastName: "Tamba",
    email: "ablaye.tamba@example.com",
    phone: "+221 77 123 45 67",
    address: "123 Cité Keur Gorgui, Dakar, Sénégal",
  });

  // États dynamiques pour les commandes et les points
  const [recentOrders, setRecentOrders] = useState([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(1250);

  useEffect(() => {
    // Charger les informations sauvegardées si elles existent
    const savedUser = localStorage.getItem("shopflow_user_profile");
    if (savedUser) {
      setUserInfo(JSON.parse(savedUser));
    }

    // Commandes récentes simulées ou récupérées
    const mockOrders = [
      {
        id: "CMD-8492",
        status: "LIVRÉ",
        itemsCount: 2,
        date: "12 Oct",
        price: "45.000 FCFA",
      },
      {
        id: "CMD-8311",
        status: "EN COURS",
        itemsCount: 1,
        date: "05 Oct",
        price: "12.500 FCFA",
      },
      {
        id: "CMD-7904",
        status: "LIVRÉ",
        itemsCount: 4,
        date: "28 Sep",
        price: "128.000 FCFA",
      },
    ];
    setRecentOrders(mockOrders);
  }, []);

  // Sauvegarder les modifications du profil
  const handleSaveProfile = () => {
    setIsEditing(false);
    localStorage.setItem("shopflow_user_profile", JSON.stringify(userInfo));
  };

  // États des notifications
  const [notifs, setNotifs] = useState({
    emailOrder: true,
    emailPromo: true,
    emailFidelity: false,
    pushRealtime: true,
    pushRewards: true,
    pushFlash: false,
    smsDelivery: true,
  });

  const toggleNotif = (key) => {
    setNotifs({ ...notifs, [key]: !notifs[key] });
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // État pour l'Authentification à deux facteurs (2FA)
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  // État dynamique pour les sessions actives
  const [sessions, setSessions] = useState([
    {
      id: 1,
      device: "MacBook Pro - Chrome",
      location: "Paris, France • Adresse IP: 192.168.1.1",
      status: "Actuelle",
      type: "laptop",
    },
    {
      id: 2,
      device: "iPhone 13 - Safari",
      location: "Lyon, France • Adresse IP: 10.0.0.45",
      status: "Dernière activité: Hier à 14:30",
      type: "mobile",
    },
  ]);

  // Gestion du changement de mot de passe
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Veuillez remplir tous les champs du mot de passe.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    alert("Mot de passe mis à jour avec succès !");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // Basculer l'état du 2FA
  const toggle2FA = () => {
    setIs2FAEnabled(!is2FAEnabled);
  };

  // Fermer une session spécifique
  const handleTerminateSession = (id) => {
    setSessions(sessions.filter((session) => session.id !== id));
  };

  // Déconnecter toutes les autres sessions
  const handleTerminateAllSessions = () => {
    setSessions(sessions.filter((session) => session.status === "Actuelle"));
  };

  // État pour les moyens de paiement du profil
  const [selectedPaymentType, setSelectedPaymentType] = useState("card");

  return (
    <div className="profile-page-container">
      {/* Barre latérale de navigation du profil */}
      <div className="profile-sidebar">
        <div className="profile-avatar-section">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
            alt="Avatar"
            className="profile-avatar-img"
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
      </div>

      {/* Contenu Principal */}
      <div className="profile-main-content">
        {activeTab === "infos" && (
          <div>
            <div className="profile-top-header">
              <div>
                <h1>Informations Personnelles</h1>
                <p>
                  Gérez vos informations de contact et votre adresse de
                  livraison.
                </p>
              </div>
              <div className="profile-badge-card">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50"
                  alt="Mini Avatar"
                />
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
              {/* Colonne Gauche : Coordonnées & Programme de fidélité */}
              <div className="profile-left-col">
                <div className="profile-card">
                  <div className="card-header-flex">
                    <h3>
                      <FontAwesomeIcon icon={faUser} /> Coordonnées
                    </h3>
                    {isEditing ? (
                      <button
                        className="btn-save-profile"
                        onClick={handleSaveProfile}
                      >
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
                              setUserInfo({
                                ...userInfo,
                                firstName: e.target.value,
                              })
                            }
                            placeholder="Prénom"
                          />
                          <input
                            type="text"
                            value={userInfo.lastName}
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                lastName: e.target.value,
                              })
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
                            setUserInfo({
                              ...userInfo,
                              address: e.target.value,
                            })
                          }
                          rows="2"
                        />
                      ) : (
                        <div className="static-field">{userInfo.address}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bloc Programme de Fidélité Dynamique */}
                <div className="loyalty-banner-card">
                  <div className="loyalty-banner-content">
                    <div>
                      <span className="loyalty-tag">PROGRAMME DE FIDÉLITÉ</span>
                      <h2>{loyaltyPoints.toLocaleString()} pts</h2>
                      <p>
                        Plus que {2500 - loyaltyPoints} points pour le palier
                        Platine.
                      </p>
                    </div>
                    <button className="btn-loyalty-advantages">
                      <FontAwesomeIcon icon={faGift} /> Voir mes avantages
                    </button>
                  </div>
                  <div className="loyalty-progress-bar">
                    <div
                      className="loyalty-progress-fill"
                      style={{ width: `${(loyaltyPoints / 2500) * 100}%` }}
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
                    {recentOrders.map((order, index) => (
                      <div className="order-item-card" key={index}>
                        <div className="order-item-top">
                          <strong>{order.id}</strong>
                          <span
                            className={`status-pill ${order.status === "LIVRÉ" ? "delivered" : "pending"}`}
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
                    ))}
                  </div>

                  <button className="btn-view-all-orders">
                    Voir tout l'historique{" "}
                    <FontAwesomeIcon icon={faArrowRight} size="xs" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. SÉCURITÉ */}
        {activeTab === "security" && (
          <div className="security-section-container">
            <div className="profile-top-header">
              <div>
                <h1>Sécurité du Compte</h1>
                <p>
                  Gérez votre mot de passe et protégez l'accès à votre compte.
                </p>
              </div>
            </div>

            {/* Bloc 1 : Changement de Mot de passe */}
            <div className="profile-card mb-24">
              <div className="card-section-title">
                <FontAwesomeIcon icon={faKey} />
                <h2>Changement de Mot de passe</h2>
              </div>

              <form onSubmit={handleUpdatePassword} className="security-form">
                <div className="input-group full-width mb-16">
                  <label>Mot de passe actuel</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="input-group full-width mb-16">
                  <label>Nouveau mot de passe</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="input-group full-width mb-24">
                  <label>Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-primary-custom">
                  Mettre à jour le mot de passe
                </button>
              </form>
            </div>

            {/* Bloc 2 : Authentification à deux facteurs (2FA) */}
            <div className="profile-card mb-24">
              <div className="card-section-title space-between">
                <div className="title-with-icon">
                  <FontAwesomeIcon icon={faShieldHalved} />
                  <h2>Authentification à deux facteurs (2FA)</h2>
                </div>
                <span
                  className={`status-badge-outline ${is2FAEnabled ? "active" : ""}`}
                >
                  {is2FAEnabled ? "Activé" : "Désactivé"}
                </span>
              </div>

              <p className="security-desc">
                Ajoutez une couche de sécurité supplémentaire à votre compte.
                Une fois activée, vous devrez fournir un code de sécurité généré
                par une application d'authentification en plus de votre mot de
                passe lors de la connexion.
              </p>

              <button
                onClick={toggle2FA}
                className={`btn-toggle-2fa ${is2FAEnabled ? "btn-danger-outline" : "btn-primary-custom"}`}
              >
                {is2FAEnabled ? "Désactiver le 2FA" : "Activer"}
              </button>
            </div>

            {/* Bloc 3 : Sessions Actives */}
            <div className="profile-card">
              <div className="card-section-title space-between">
                <div className="title-with-icon">
                  <FontAwesomeIcon icon={faLaptop} />
                  <h2>Sessions Actives</h2>
                </div>
                {sessions.length > 1 && (
                  <button
                    onClick={handleTerminateAllSessions}
                    className="btn-danger-text"
                  >
                    Se déconnecter de toutes les autres sessions
                  </button>
                )}
              </div>

              <div className="sessions-list-stack">
                {sessions.length === 0 ? (
                  <p className="empty-text">Aucune autre session active.</p>
                ) : (
                  sessions.map((session) => (
                    <div className="session-item-row" key={session.id}>
                      <div className="session-icon">
                        <FontAwesomeIcon
                          icon={
                            session.type === "laptop"
                              ? faLaptop
                              : faMobileScreenButton
                          }
                          size="lg"
                        />
                      </div>
                      <div className="session-info">
                        <div className="session-title-line">
                          <strong>{session.device}</strong>
                          {session.status === "Actuelle" && (
                            <span className="status-pill delivered">
                              Actuelle
                            </span>
                          )}
                        </div>
                        <p>{session.location}</p>
                        {session.status !== "Actuelle" && (
                          <small className="session-activity">
                            {session.status}
                          </small>
                        )}
                      </div>
                      {session.status !== "Actuelle" && (
                        <button
                          className="btn-close-session"
                          onClick={() => handleTerminateSession(session.id)}
                          title="Fermer cette session"
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="profile-section-content">
            <div className="profile-content-header mb-24">
              <h2>Paramètres de Notifications</h2>
              <p>Gérez la façon dont vous souhaitez être informé.</p>
            </div>

            <div className="profile-card">
              <div className="card-section-title">
                <FontAwesomeIcon icon={faEnvelope} />
                <h3>Notifications par Email</h3>
              </div>
              <div className="notif-toggle-item">
                <div>
                  <strong>Mises à jour de commande</strong>
                  <p>Recevez des confirmations de commande et des reçus.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifs.emailOrder}
                  onChange={() => toggleNotif("emailOrder")}
                  className="toggle-switch"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. MOYENS DE PAIEMENT */}
        {activeTab === "payment" && (
          <div className="profile-section-content">
            <div className="profile-content-header mb-24">
              <h2>Moyens de Paiement</h2>
              <p>Enregistrez et gérez vos modes de paiement favoris.</p>
            </div>

            <div className="profile-card">
              <div className="card-section-title">
                <FontAwesomeIcon icon={faCreditCard} />
                <h3>Méthodes de Paiement Enregistrées</h3>
              </div>

              <div className="payment-options-container">
                <div
                  className={`payment-method-card ${selectedPaymentType === "card" ? "active-border" : ""}`}
                >
                  <label className="payment-radio-label">
                    <input
                      type="radio"
                      name="profilePayment"
                      checked={selectedPaymentType === "card"}
                      onChange={() => setSelectedPaymentType("card")}
                    />
                    <span>Carte Bancaire</span>
                    <FontAwesomeIcon
                      icon={faCreditCard}
                      className="payment-brand-icon"
                    />
                  </label>

                  {selectedPaymentType === "card" && (
                    <div className="card-inputs-subgrid">
                      <div className="form-group-profile full-width">
                        <label>Numéro de carte</label>
                        <input type="text" placeholder="0000 0000 0000 0000" />
                      </div>
                      <div className="form-group-profile">
                        <label>Date d'expiration</label>
                        <input type="text" placeholder="MM/AA" />
                      </div>
                      <div className="form-group-profile">
                        <label>CVC</label>
                        <input
                          type="password"
                          placeholder="123"
                          maxLength="4"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`payment-method-card simple ${selectedPaymentType === "mobile" ? "active-border" : ""}`}
                  onClick={() => setSelectedPaymentType("mobile")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="payment-radio-label">
                    <input
                      type="radio"
                      name="profilePayment"
                      checked={selectedPaymentType === "mobile"}
                      onChange={() => setSelectedPaymentType("mobile")}
                    />
                    <span>Mobile Money</span>
                  </div>
                  <span className="payment-sub-operators">Orange, MTN</span>
                </div>

                <div
                  className={`payment-method-card simple ${selectedPaymentType === "cash" ? "active-border" : ""}`}
                  onClick={() => setSelectedPaymentType("cash")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="payment-radio-label">
                    <input
                      type="radio"
                      name="profilePayment"
                      checked={selectedPaymentType === "cash"}
                      onChange={() => setSelectedPaymentType("cash")}
                    />
                    <span>Paiement à la livraison</span>
                  </div>
                  <FontAwesomeIcon
                    icon={faTruck}
                    style={{ color: "#6b7280" }}
                  />
                </div>
              </div>

              <button className="btn-full-dark-blue mt-20">
                Enregistrer les modifications
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
