import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faBell,
  faSearch,
  faUser,
  faGift,
  faBox,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import "./Header.css";

export default function Header() {
  const [totalItems, setTotalItems] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("Tout");

  const navigate = useNavigate();

  // Fonction utilitaire pour extraire un avatar valide (ignore l'ancienne image bleue par défaut si besoin)
  const getValidAvatar = () => {
    try {
      const savedUser = localStorage.getItem("shopflow_user_info");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        // Si l'objet utilisateur existe et a un avatar valide (qui n'est pas vide)
        if (
          parsed &&
          parsed.avatar &&
          typeof parsed.avatar === "string" &&
          parsed.avatar.trim() !== ""
        ) {
          return parsed.avatar;
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Si la page de profil n'a pas d'avatar personnalisé, on retourne null pour afficher l'icône "Compte"
    return null;
  };

  const [profileImage, setProfileImage] = useState(getValidAvatar);

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const notificationRef = useRef(null);

  const updateProfileAvatar = () => {
    setProfileImage(getValidAvatar());
  };

  useEffect(() => {
    updateCartCount();
    loadNotifications();
    updateProfileAvatar();

    const handleStorageChange = () => {
      updateProfileAvatar();
      updateCartCount();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("notificationUpdated", loadNotifications);
    window.addEventListener("userAvatarUpdated", updateProfileAvatar);
    window.addEventListener("userInfoUpdated", updateProfileAvatar);

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
      window.removeEventListener("userAvatarUpdated", updateProfileAvatar);
      window.removeEventListener("userInfoUpdated", updateProfileAvatar);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fonction pour gérer le clic sur le profil / compte
  const handleProfileClick = (e) => {
    e.preventDefault();
    const isLoggedIn = localStorage.getItem("shopflow_is_logged") === "true";

    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  // Fonction pour gérer le clic sur le panier
  const handleCartClick = (e) => {
    e.preventDefault();
    const isLoggedIn = localStorage.getItem("shopflow_is_logged") === "true";
    const savedCart = JSON.parse(localStorage.getItem("shopflow_cart")) || [];

    if (!isLoggedIn && savedCart.length > 0) {
      navigate("/login");
    } else {
      navigate("/cart");
    }
  };

  // Calcul du nombre total d'articles dans le panier
  const updateCartCount = () => {
    const savedCart = JSON.parse(localStorage.getItem("shopflow_cart")) || [];
    const count = savedCart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItems(count);
  };

  // Chargement des notifications avec gestion du localStorage
  const loadNotifications = () => {
    const savedNotifs = JSON.parse(
      localStorage.getItem("shopflow_notifications"),
    );

    if (savedNotifs && savedNotifs.length > 0) {
      const formattedNotifs = savedNotifs.map((notif) => {
        let icon = faBox;
        let color = "#64748b";
        let bgColor = "#f1f5f9";

        if (notif.category === "Fidélité") {
          icon = notif.text.includes("points") ? faGift : faFire;
          color = notif.text.includes("points") ? "#10b981" : "#f59e0b";
          bgColor = notif.text.includes("points") ? "#d1fae5" : "#ffedd5";
        } else if (
          notif.category === "Commandes" ||
          notif.text.includes("commande") ||
          notif.text.includes("coupon")
        ) {
          icon = notif.text.includes("coupon") ? faShoppingCart : faBox;
          color = notif.text.includes("coupon") ? "#2563eb" : "#64748b";
          bgColor = notif.text.includes("coupon") ? "#dbeafe" : "#f1f5f9";
        }

        return { ...notif, icon, color, bgColor };
      });

      setNotifications(formattedNotifs);
    } else if (savedNotifs === null) {
      const defaultNotifs = [
        {
          id: 1,
          category: "Fidélité",
          title: "+500 points ajoutés",
          text: "Félicitations ! Vos points de fidélité ont été crédités suite à votre dernier achat.",
          time: "Il y a 2h",
          icon: faGift,
          bgColor: "#d1fae5",
          color: "#10b981",
        },
        {
          id: 2,
          category: "Fidélité",
          title: "Niveau Or atteint",
          text: "Vous êtes désormais membre Or. Profitez de la livraison gratuite sur toutes vos commandes.",
          time: "Hier",
          icon: faFire,
          bgColor: "#ffedd5",
          color: "#f59e0b",
        },
        {
          id: 3,
          category: "Commandes",
          title: "Commande expédiée #1045",
          text: "Votre commande contenant 3 articles a été remise au transporteur.",
          time: "Mercredi",
          icon: faBox,
          bgColor: "#f1f5f9",
          color: "#64748b",
        },
        {
          id: 4,
          category: "Commandes",
          title: "Nouveau coupon disponible",
          text: "Profitez de 15% de réduction sur la nouvelle collection. Valable pendant 7 jours.",
          time: "Lun. dernier",
          icon: faShoppingCart,
          bgColor: "#dbeafe",
          color: "#2563eb",
        },
      ];

      setNotifications(defaultNotifs);
      localStorage.setItem(
        "shopflow_notifications",
        JSON.stringify(defaultNotifs),
      );
    } else {
      setNotifications([]);
    }
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
      notif.text.toLowerCase().includes("commande")
    ) {
      return true;
    }
    if (
      activeTab === "Fidélité" &&
      (notif.text.toLowerCase().includes("fidélité") ||
        notif.text.toLowerCase().includes("bon de réduction"))
    ) {
      return true;
    }
    return false;
  });

  return (
    <header className="shopflow-header">
      {/* 1. Le logo à gauche */}
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

      {/* 2. La barre de recherche au milieu */}
      <form onSubmit={handleSearchSubmit} className="header-search">
        <span className="search-icon">
          <FontAwesomeIcon icon={faSearch} />
        </span>
        <input
          type="text"
          placeholder="Rechercher des produits..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      {/* 3. Les actions à droite (Notifications, Compte, Panier) */}
      <div className="header-right">
        {/* Cloche de notification */}
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
                    <div key={notif.id} className="notification-item-pro">
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

        {/* Compte */}
        <a
          href="/profile"
          onClick={handleProfileClick}
          className="nav-profile-link"
          title="Mon Profil"
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profil"
              className="header-user-avatar"
            />
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
