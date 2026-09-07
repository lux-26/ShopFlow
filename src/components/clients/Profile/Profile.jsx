import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import ProfileSidebar from "./ProfileSidebar";
import ProfileInfos from "./ProfileInfos";
import ProfileSecurity from "./ProfileSecurity";
import ProfileNotifs from "./ProfileNotifs";
import ProfileOrders from "./ProfileOrders";
import ProfilePayment from "./ProfilePayment";
import { useAuth } from "../../../context/AuthContext";
import apiClient from "../../../utils/apiClient";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState("infos");

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    avatar:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(1250);

  const [toastData, setToastData] = useState(null);

  const showCustomToast = (title, message) => {
    setToastData({ title, message });
    setTimeout(() => {
      setToastData(null);
    }, 3000);
  };

  // Fonction pour charger les données du profil : infos et fidélité restent en
  // localStorage pour l'instant (édition de profil réelle = prochaine étape),
  // mais les commandes viennent maintenant réellement de l'API.
  const loadProfileData = () => {
    const savedUser = localStorage.getItem("shopflow_user_info");
    const parsedUser = savedUser ? JSON.parse(savedUser) : {};
    const serverName =
      user?.name || parsedUser.name || parsedUser.fullName || "";
    const nameParts = serverName.trim().split(/\s+/).filter(Boolean);

    const profileData = {
      ...parsedUser,
      firstName: user ? nameParts[0] || "" : parsedUser.firstName || "",
      lastName: user ? nameParts.slice(1).join(" ") : parsedUser.lastName || "",
      email: user?.email || parsedUser.email || "",
      avatar: user?.avatar || parsedUser.avatar || "",
    };

    if (savedUser) {
      if (parsedUser.fullName && !parsedUser.firstName) {
        const parts = parsedUser.fullName.trim().split(" ");
        profileData.firstName = parts[0] || "";
        profileData.lastName = parts.slice(1).join(" ") || "";
      }
      if (!profileData.avatar) {
        profileData.avatar =
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
      }
    }

    setUserInfo(profileData);

    const savedPoints = localStorage.getItem("shopflow_loyalty_points");
    if (savedPoints !== null) {
      setLoyaltyPoints(parseInt(savedPoints, 10));
    } else {
      localStorage.setItem("shopflow_loyalty_points", "1250"); // Valeur par défaut
    }
  };

  // Charge les vraies commandes du client et les adapte au format attendu par
  // ProfileInfos/ProfileOrders (id affiché, compteur d'articles, prix formaté).
  const loadOrders = async () => {
    try {
      const data = await apiClient.get("/orders/mine");
      const mapped = data.orders.map((order) => ({
        id: order.orderNumber,
        status: order.status.toUpperCase(),
        itemsCount: order.itemsCount,
        date: new Date(order.createdAt).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        price: `${order.total.toLocaleString("fr-FR")} FCFA`,
      }));
      setRecentOrders(mapped);
    } catch {
      setRecentOrders([]);
    }
  };

  useEffect(() => {
    // Chargement différé pour éviter une mise à jour d'état synchrone dans
    // l'effet tout en gardant la synchronisation avec le stockage local.
    const initialLoadId = window.setTimeout(() => {
      loadProfileData();
      loadOrders();
    }, 0);

    // Écouter les mises à jour de commandes en temps réel
    const handleOrderUpdate = () => {
      loadOrders();
    };
    const handleStorageUpdate = () => {
      loadProfileData();
    };

    window.addEventListener("orderUpdated", handleOrderUpdate);
    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.clearTimeout(initialLoadId);
      window.removeEventListener("orderUpdated", handleOrderUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
    // La fonction utilise les données serveur de l'utilisateur courant.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSaveProfile = () => {
    localStorage.setItem("shopflow_user_info", JSON.stringify(userInfo));
    showCustomToast("Succès", "Profil mis à jour avec succès !");
  };

  const handleLogout = async () => {
    await logout();
    showCustomToast("Déconnexion", "Déconnexion réussie ! Redirection...");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

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

  return (
    <div className="profile-page-container page-transition">
      <ProfileSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        handleLogout={handleLogout}
      />

      <div className="profile-main-content">
        {activeTab === "infos" && (
          <ProfileInfos
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            handleSaveProfile={handleSaveProfile}
            recentOrders={recentOrders}
            loyaltyPoints={loyaltyPoints}
            triggerPopup={showCustomToast}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "security" && <ProfileSecurity />}
        {activeTab === "notifications" && (
          <ProfileNotifs notifs={notifs} toggleNotif={toggleNotif} />
        )}

        {activeTab === "orders" && (
          <ProfileOrders
            recentOrders={recentOrders}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "payment" && (
          <ProfilePayment triggerPopup={showCustomToast} />
        )}
      </div>

      {toastData && (
        <div className="shopflow-toast-popup">
          <div className="toast-icon-wrapper">
            <FontAwesomeIcon icon={faCircleInfo} />
          </div>
          <div className="toast-text-content">
            <strong>{toastData.title}</strong>
            <p>{toastData.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
