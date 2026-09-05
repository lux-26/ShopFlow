import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faBell,
  faUser,
  faGift,
  faBox,
  faFire,
  faHouse,
  faStore,
  faStar,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import { useAuth } from "../../../../context/AuthContext";

export default function Header() {
  const { user } = useAuth();
  const [totalItems, setTotalItems] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("Tout");

  const navigate = useNavigate();
  const location = useLocation();

  // Fonction pour récupérer les données d'affichage du profil (avatar, initiales).
  // La question "est-on connecté ?" vient désormais de la vraie session serveur
  // (AuthContext) ; le localStorage ne sert plus qu'à enrichir l'affichage
  // (avatar personnalisé, nom complet) une fois qu'on sait que l'utilisateur est réel.
  const getStoredUserData = () => {
    try {
      if (!user) {
        return { avatar: null, userInitials: null };
      }

      const savedUser = localStorage.getItem("shopflow_user_info");
      const savedAvatar = localStorage.getItem("shopflow_user_avatar");
      const parsed = savedUser ? JSON.parse(savedUser) : {};

      let avatar = savedAvatar || parsed?.avatar || "";

      const hasRealAvatarImage =
        avatar && typeof avatar === "string" && avatar.startsWith("data:image");

      let firstName = parsed.firstName || "";
      let lastName = parsed.lastName || "";

      if (
        !firstName &&
        !lastName &&
        (parsed.FullName || parsed.name || parsed.fullName || user.name)
      ) {
        const fullName =
          parsed.FullName || parsed.name || parsed.fullName || user.name;
        const parts = fullName.trim().split(" ");
        firstName = parts[0] || "";
        lastName = parts.length > 1 ? parts[parts.length - 1] : "";
      }

      const first = firstName ? firstName.charAt(0) : "";
      const last = lastName && lastName !== firstName ? lastName.charAt(0) : "";
      const initials = (first + last).toUpperCase();
      const userInitials = initials !== "" ? initials : null;

      return {
        avatar: hasRealAvatarImage ? avatar : null,
        userInitials: userInitials,
      };
    } catch (error) {
      console.error(error);
      return { avatar: null, userInitials: null };
    }
  };

  const [userData, setUserData] = useState(getStoredUserData);

  const notificationRef = useRef(null);

  const updateProfileData = () => {
    setUserData(getStoredUserData());
  };

  // Chargement des notifications
  const loadNotifications = () => {
    if (!user) {
      setNotifications([]);
      return;
    }

    try {
      const savedNotifs = JSON.parse(
        localStorage.getItem("shopflow_notifications"),
      );

      if (Array.isArray(savedNotifs) && savedNotifs.length > 0) {
        const formattedNotifs = savedNotifs.map((notif) => {
          let icon = faBox;
          let color = "#64748b";
          let bgColor = "#f1f5f9";

          if (notif.category === "Fidélité") {
            icon = notif.text?.includes("points") ? faGift : faFire;
            color = notif.text?.includes("points") ? "#10b981" : "#f59e0b";
            bgColor = notif.text?.includes("points") ? "#d1fae5" : "#ffedd5";
          } else if (
            notif.category === "Commandes" ||
            notif.text?.includes("commande") ||
            notif.text?.includes("coupon")
          ) {
            icon = notif.text?.includes("coupon") ? faShoppingCart : faBox;
            color = notif.text?.includes("coupon") ? "#2563eb" : "#64748b";
            bgColor = notif.text?.includes("coupon") ? "#dbeafe" : "#f1f5f9";
          }

          return { ...notif, icon, color, bgColor };
        });

        setNotifications(formattedNotifs);
      } else {
        setNotifications([]);
      }
    } catch {
      setNotifications([]);
    }
  };

  // Calcul du panier
  const updateCartCount = () => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("shopflow_cart")) || [];
      const count = savedCart.reduce((sum, item) => sum + item.quantity, 0);
      setTotalItems(count);
    } catch {
      setTotalItems(0);
    }
  };

  useEffect(() => {
    // L'état initial est affiché immédiatement, puis cette synchronisation
    // s'exécute après le premier rendu sans provoquer de rendu en cascade.
    const initialLoadId = window.setTimeout(() => {
      updateCartCount();
      loadNotifications();
      updateProfileData();
    }, 0);

    const handleStorageChange = () => {
      updateProfileData();
      updateCartCount();
      loadNotifications();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("notificationUpdated", loadNotifications);
    window.addEventListener("userAvatarUpdated", updateProfileData);
    window.addEventListener("userInfoUpdated", updateProfileData);
    window.addEventListener("userNameUpdated", updateProfileData);

    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.clearTimeout(initialLoadId);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("notificationUpdated", loadNotifications);
      window.removeEventListener("userAvatarUpdated", updateProfileData);
      window.removeEventListener("userInfoUpdated", updateProfileData);
      window.removeEventListener("userNameUpdated", updateProfileData);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  // Les écouteurs sont volontairement enregistrés une fois au montage.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Quand la session change (connexion, déconnexion, ou résolution de
  // /api/auth/me au chargement), on recalcule l'affichage du profil et
  // des notifications en conséquence.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateProfileData();
    loadNotifications();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleProfileClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    navigate("/cart");
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    localStorage.setItem("shopflow_notifications", JSON.stringify([]));
    window.dispatchEvent(new Event("notificationUpdated"));
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "Tout") return true;
    if (notif.category === activeTab) return true;
    if (
      activeTab === "Commandes" &&
      notif.text?.toLowerCase().includes("commande")
    ) {
      return true;
    }
    if (
      activeTab === "Fidélité" &&
      (notif.text?.toLowerCase().includes("fidélité") ||
        notif.text?.toLowerCase().includes("bon de réduction"))
    ) {
      return true;
    }
    return false;
  });

  return (
    <header className="shopflow-header page-transition">
      {/* 1. Logo à gauche */}
      <div className="header-left">
        <Link to="/" className="logo-container">
          <img
            src="/ShopFlow Logo.svg"
            alt="Logo ShopFlow"
            className="logo-image"
          />
          <span className="logo-text">ShopFlow</span>
        </Link>
      </div>

      {/* 2. Barre de navigation dynamique améliorée au milieu */}
      <nav className="header-pill-nav">
        <Link
          to="/"
          className={`pill-nav-item ${location.pathname === "/" ? "active" : ""}`}
        >
          <FontAwesomeIcon icon={faHouse} className="pill-icon" />
          <span>Accueil</span>
        </Link>
        <Link
          to="/catalog"
          className={`pill-nav-item ${
            location.pathname === "/catalog" &&
            !location.search.includes("nouveautes")
              ? "active"
              : ""
          }`}
        >
          <FontAwesomeIcon icon={faStore} className="pill-icon" />
          <span>Catalogue</span>
        </Link>
        <Link
          to="/catalog?filter=nouveautes"
          className={`pill-nav-item ${
            location.pathname === "/catalog" &&
            location.search.includes("nouveautes")
              ? "active"
              : ""
          }`}
        >
          <FontAwesomeIcon icon={faStar} className="pill-icon" />
          <span>Nouveautés</span>
        </Link>
        <Link
          to="/contact"
          className={`pill-nav-item ${location.pathname === "/contact" ? "active" : ""}`}
        >
          <FontAwesomeIcon icon={faEnvelope} className="pill-icon" />
          <span>Contact</span>
        </Link>
      </nav>

      {/* 3. Actions à droite */}
      <div className="header-right">
        {/* Notifications */}
        <div
          className="notification-container"
          style={{ position: "relative" }}
          ref={notificationRef}
        >
          <button
            className="icon-btn"
            aria-label="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FontAwesomeIcon icon={faBell} />
            {notifications.length > 0 && (
              <span className="badge">{notifications.length}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown-pro">
              <div className="notifications-dropdown-header">
                <h3>Notifications</h3>
                <div className="notif-tabs">
                  <button
                    className={`tab-btn ${activeTab === "Tout" ? "active" : ""}`}
                    onClick={() => setActiveTab("Tout")}
                  >
                    Tout
                  </button>
                  <button
                    className={`tab-btn ${activeTab === "Commandes" ? "active" : ""}`}
                    onClick={() => setActiveTab("Commandes")}
                  >
                    Commandes
                  </button>
                  <button
                    className={`tab-btn ${activeTab === "Fidélité" ? "active" : ""}`}
                    onClick={() => setActiveTab("Fidélité")}
                  >
                    Fidélité
                  </button>
                </div>
              </div>

              <div className="dropdown-body-pro">
                {filteredNotifications.length === 0 ? (
                  <p className="no-notifs">Aucune notification</p>
                ) : (
                  filteredNotifications.map((notif, index) => (
                    <div
                      key={notif.id ?? `${notif.category ?? "notification"}-${index}`}
                      className="notification-item-pro"
                    >
                      <div
                        className="notif-icon-circle"
                        style={{
                          backgroundColor: notif.bgColor,
                          color: notif.color,
                        }}
                      >
                        <FontAwesomeIcon icon={notif.icon} />
                      </div>
                      <div className="notif-content-pro">
                        <div className="notif-top-row">
                          <h4>{notif.title}</h4>
                          <span className="notif-time">{notif.time}</span>
                        </div>
                        <p>{notif.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="dropdown-footer-pro">
                  <button onClick={handleClearNotifications}>
                    Tout marquer comme lu
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profil : Si déconnecté (pas d'avatar/initiales), affiche l'icône faUser par défaut */}
        <a
          href="/profile"
          onClick={handleProfileClick}
          className="nav-profile-link"
          title="Mon Profil"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          {userData.avatar ? (
            <img
              src={userData.avatar}
              alt="Photo de profil de l'utilisateur"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "1px solid #cbd5e1",
              }}
            />
          ) : userData.userInitials ? (
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#1e3a8a",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "0.8rem",
              }}
            >
              {userData.userInitials}
            </div>
          ) : (
            <>
              <FontAwesomeIcon icon={faUser} /> Compte
            </>
          )}
        </a>

        {/* Panier */}
        <a
          href="/cart"
          onClick={handleCartClick}
          className="icon-btn cart-icon-btn"
          aria-label="Panier"
        >
          <FontAwesomeIcon icon={faShoppingCart} />
          {totalItems > 0 && <span className="badge">{totalItems}</span>}
        </a>
      </div>
    </header>
  );
}
