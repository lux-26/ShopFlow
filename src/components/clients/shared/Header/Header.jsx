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

export default function Header() {
  const [totalItems, setTotalItems] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("Tout");

  const navigate = useNavigate();
  const location = useLocation();

  // Fonction pour récupérer l'avatar (renvoie null si déconnecté ou absent)
  const getValidAvatar = () => {
    try {
      const savedUser = localStorage.getItem("shopflow_user_info");
      if (!savedUser) return null; // Si plus d'infos utilisateur, pas d'avatar

      const avatar = localStorage.getItem("shopflow_user_avatar");
      if (
        avatar &&
        avatar.trim() !== "" &&
        avatar !== "null" &&
        avatar !== "undefined"
      ) {
        return avatar;
      }

      const parsed = JSON.parse(savedUser);
      if (parsed?.avatar && parsed.avatar.trim() !== "") return parsed.avatar;
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const [profileImage, setProfileImage] = useState(getValidAvatar);

  // Fonction pour extraire les initiales (renvoie null si déconnecté ou absent)
  const getUserInitials = () => {
    try {
      const savedUser = localStorage.getItem("shopflow_user_info");
      if (!savedUser) return null; // Si plus d'infos utilisateur, pas d'initiales

      const parsed = JSON.parse(savedUser);
      const fullName =
        parsed?.FullName ||
        parsed?.name ||
        parsed?.fullName ||
        `${parsed?.firstName || ""} ${parsed?.lastName || ""}`;

      if (fullName && fullName.trim() !== "") {
        const parts = fullName.trim().split(" ");
        const first = parts[0] ? parts[0].charAt(0) : "";
        const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
        const initials = (first + last).toUpperCase();
        if (initials) return initials;
      }

      // Fallback sur d'éventuelles anciennes clés
      const legacyName =
        localStorage.getItem("shopflow_user_name") ||
        localStorage.getItem("shopflow_name") ||
        localStorage.getItem("user_name");

      if (legacyName && legacyName.trim() !== "") {
        const parts = legacyName.trim().split(" ");
        const first = parts[0] ? parts[0].charAt(0) : "";
        const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
        const initials = (first + last).toUpperCase();
        if (initials) return initials;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const [userInitials, setUserInitials] = useState(getUserInitials);

  const notificationRef = useRef(null);

  const updateProfileData = () => {
    setProfileImage(getValidAvatar());
    setUserInitials(getUserInitials());
  };

  // Chargement des notifications
  const loadNotifications = () => {
    const isLoggedIn = localStorage.getItem("shopflow_is_logged") === "true";

    if (!isLoggedIn) {
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
    } catch (e) {
      setNotifications([]);
    }
  };

  // Calcul du panier
  const updateCartCount = () => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("shopflow_cart")) || [];
      const count = savedCart.reduce((sum, item) => sum + item.quantity, 0);
      setTotalItems(count);
    } catch (e) {
      setTotalItems(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    loadNotifications();
    updateProfileData();

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
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("notificationUpdated", loadNotifications);
      window.removeEventListener("userAvatarUpdated", updateProfileData);
      window.removeEventListener("userInfoUpdated", updateProfileData);
      window.removeEventListener("userNameUpdated", updateProfileData);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = (e) => {
    e.preventDefault();
    const isLoggedIn = localStorage.getItem("shopflow_is_logged") === "true";
    const savedUser = localStorage.getItem("shopflow_user_info");

    if (isLoggedIn || savedUser) {
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
            alt="Logo Shopflow"
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
                  filteredNotifications.map((notif) => (
                    <div
                      key={notif.id || Math.random()}
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

        {/* Profil / Avatar en priorité, puis Initiales, puis Icône par défaut */}
        <a
          href="/profile"
          onClick={handleProfileClick}
          className="nav-profile-link"
          title="Mon Profil"
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Avatar"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #1e3a8a",
              }}
            />
          ) : userInitials ? (
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
              {userInitials}
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
