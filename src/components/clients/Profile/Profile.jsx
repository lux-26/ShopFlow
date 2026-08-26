import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import ProfileSidebar from "./ProfileSidebar";
import ProfileInfos from "./ProfileInfos";
import ProfileSecurity from "./ProfileSecurity";
import ProfileNotifs from "./ProfileNotifs";
import ProfilePayment from "./ProfilePayment";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
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

  // Fonction pour charger les données du localStorage
  const loadProfileData = () => {
    const savedUser = localStorage.getItem("shopflow_user_info");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.fullName && !parsedUser.firstName) {
        const parts = parsedUser.fullName.trim().split(" ");
        parsedUser.firstName = parts[0] || "";
        parsedUser.lastName = parts.slice(1).join(" ") || "";
      }
      if (!parsedUser.avatar) {
        parsedUser.avatar =
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
      }
      setUserInfo(parsedUser);
    }

    const savedOrders = localStorage.getItem("shopflow_orders");
    if (savedOrders) {
      try {
        setRecentOrders(JSON.parse(savedOrders));
      } catch (e) {
        setRecentOrders([]);
      }
    } else {
      setRecentOrders([]);
    }

    const savedPoints = localStorage.getItem("shopflow_loyalty_points");
    if (savedPoints !== null) {
      setLoyaltyPoints(parseInt(savedPoints, 10));
    } else {
      localStorage.setItem("shopflow_loyalty_points", "1250"); // Valeur par défaut
    }
  };

  useEffect(() => {
    loadProfileData();

    // Écouter les mises à jour de commandes en temps réel
    const handleOrderUpdate = () => {
      loadProfileData();
    };

    window.addEventListener("orderUpdated", handleOrderUpdate);
    window.addEventListener("storage", handleOrderUpdate);

    return () => {
      window.removeEventListener("orderUpdated", handleOrderUpdate);
      window.removeEventListener("storage", handleOrderUpdate);
    };
  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem("shopflow_user_info", JSON.stringify(userInfo));
    showCustomToast("Succès", "Profil mis à jour avec succès !");
  };

  const handleLogout = () => {
    if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
      localStorage.removeItem("shopflow_is_logged");
      localStorage.removeItem("shopflow_user_avatar");
      window.dispatchEvent(new Event("storage"));
      showCustomToast("Déconnexion", "Déconnexion réussie ! Redirection...");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
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
    <div className="profile-page-container">
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
          />
        )}
        {activeTab === "security" && <ProfileSecurity />}
        {activeTab === "notifications" && (
          <ProfileNotifs notifs={notifs} toggleNotif={toggleNotif} />
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
