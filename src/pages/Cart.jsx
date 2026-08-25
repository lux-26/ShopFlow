import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faTrashCan,
  faLock,
  faTruck,
  faShieldAlt,
  faCircleInfo,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import "./Cart.css";

export default function Cart({ onGoToCheckout }) {
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");

  const [discount, setDiscount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({
    title: "",
    message: "",
    type: "success",
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("shopflow_cart")) || [];
    setCartItems(savedCart);
  }, []);

  const updateCartStorage = (updatedItems) => {
    setCartItems(updatedItems);
    localStorage.setItem("shopflow_cart", JSON.stringify(updatedItems));
  };

  const handleIncrease = (id) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    updateCartStorage(updated);
  };

  const handleDecrease = (id) => {
    const updated = cartItems.map((item) => {
      if (item.id === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    updateCartStorage(updated);
  };

  const triggerPopup = (title, message, type = "success") => {
    setPopupData({ title, message, type });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleRemoveItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    updateCartStorage(updated);
  };

  const handleCheckout = (e) => {
    const currentPoints =
      parseInt(localStorage.getItem("shopflow_loyalty_points")) || 1250;
    const earnedPoints = totalArticles * 150; // Par exemple 150 pts par article
    const newTotalPoints = currentPoints + earnedPoints;

    localStorage.setItem("shopflow_loyalty_points", newTotalPoints.toString());
    if (cartItems.length === 0) {
      e.preventDefault(); // Empêche la redirection si le panier est vide
      triggerPopup(
        "Attention",
        "Votre panier est vide ! Ajoutez des articles.",
        "error",
      );
      return;
    }

    // --- ENREGISTREMENT DE LA COMMANDE POUR LE PROFIL ---
    const existingOrders =
      JSON.parse(localStorage.getItem("shopflow_orders")) || [];

    const newOrder = {
      id: "CMD-" + Math.floor(1000 + Math.random() * 9000),
      status: "EN COURS",
      itemsCount: totalArticles,
      date: "Aujourd'hui",
      price: finalTotal.toLocaleString() + " FCFA",
    };

    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem("shopflow_orders", JSON.stringify(updatedOrders));
    // --------------------------------------------------

    // Création de la notification
    const newNotification = {
      id: Date.now(),
      text: "Votre commande récente a été validée avec succès.",
      time: "À l'instant",
    };

    const existingNotifs =
      JSON.parse(localStorage.getItem("shopflow_notifications")) || [];
    const updatedNotifs = [newNotification, ...existingNotifs];
    localStorage.setItem(
      "shopflow_notifications",
      JSON.stringify(updatedNotifs),
    );

    // Si tu utilises une fonction de callback pour basculer de page
    if (onGoToCheckout) {
      onGoToCheckout();
    }

    window.dispatchEvent(new Event("notificationUpdated"));
    window.dispatchEvent(new Event("orderUpdated"));
  };

  const totalArticles = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = cartItems.length > 0 ? 5000 : 0;
  const finalTotal = subtotal + shippingFee - discount;

  const handleApplyPromo = () => {
    const validPromoCodes = ["SHOPFLOW20", "BIENVENUE2026", "PROMO10"];
    const codeFormatted = promoCode.trim().toUpperCase();
    if (validPromoCodes.includes(codeFormatted)) {
      setDiscount(12000);
      triggerPopup(
        "Succès",
        "Code promo appliqué avec succès ! (-12 000 FCFA)",
        "success",
      );
    } else {
      triggerPopup("Erreur", "Code promo invalide.", "error");
    }
  };

  return (
    <div className="cart-page">
      {/* Pop-up unifié en bas à droite */}
      {showPopup && (
        <div
          className="custom-toast-notification"
          style={{
            borderLeftColor: popupData.type === "error" ? "#dc2626" : "#1e3a8a",
          }}
        >
          <div
            className="toast-icon-wrapper"
            style={{
              color: popupData.type === "error" ? "#dc2626" : "#1e3a8a",
            }}
          >
            <FontAwesomeIcon
              icon={
                popupData.type === "error" ? faCircleExclamation : faCircleInfo
              }
            />
          </div>
          <div className="toast-content">
            <span className="toast-title">{popupData.title}</span>
            <p className="toast-message">{popupData.message}</p>
          </div>
        </div>
      )}

      <div className="cart-container">
        <h1 className="cart-title">Mon Panier</h1>

        <div className="cart-layout">
          {/* COLONNE DE GAUCHE : Liste des produits */}
          <div className="cart-items-list">
            {cartItems.length === 0 ? (
              <p>Votre panier est vide.</p>
            ) : (
              cartItems.map((item) => (
                <div className="cart-item-card" key={item.id}>
                  {/* Wrapper d'image contenant l'image et le badge proprement ajusté */}
                  <div className="cart-item-img-wrapper">
                    {item.badge && (
                      <span className="cart-badge">{item.badge}</span>
                    )}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-img"
                    />
                  </div>

                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p className="cart-item-variant">
                      {item.variant || "Standard"}
                    </p>

                    <div className="cart-item-controls">
                      <div className="quantity-selector">
                        <button onClick={() => handleDecrease(item.id)}>
                          &minus;
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleIncrease(item.id)}>
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="cart-item-pricing">
                    <button
                      className="delete-btn"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                    <div className="prices">
                      <span className="current-price">
                        {(item.price * item.quantity).toLocaleString()} FCFA
                      </span>
                      {item.oldPrice && (
                        <span className="old-price">
                          {(item.oldPrice * item.quantity).toLocaleString()}{" "}
                          FCFA
                        </span>
                      )}
                      {item.quantity > 1 && (
                        <span className="unit-price-sub">
                          {item.price.toLocaleString()} FCFA / unité
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* COLONNE DE DROITE : Récapitulatif */}
          <div className="cart-summary-card">
            <h2>Récapitulatif</h2>

            <div className="summary-line">
              <span>Sous-total ({totalArticles} articles)</span>
              <span>{subtotal.toLocaleString()} FCFA</span>
            </div>
            <div className="summary-line">
              <span>Frais de livraison</span>
              <span>{shippingFee.toLocaleString()} FCFA</span>
            </div>
            {discount > 0 && (
              <div className="summary-line discount">
                <span>Réduction appliquée</span>
                <span>-{discount.toLocaleString()} FCFA</span>
              </div>
            )}

            <hr className="summary-divider" />

            <div className="summary-total-line">
              <span>Total</span>
              <div className="total-amount-wrapper">
                <span className="total-price">
                  {finalTotal.toLocaleString()} FCFA
                </span>
                <span className="taxes-label">Taxes incluses</span>
              </div>
            </div>

            {/* Code Promo */}
            <div className="promo-box">
              <input
                type="text"
                placeholder="Code promo"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button className="apply-promo-btn" onClick={handleApplyPromo}>
                Appliquer
              </button>
            </div>

            {/* Boutons d'action */}
            <Link
              to="/checkout"
              className="btn-checkout"
              onClick={handleCheckout}
            >
              Passer à la caisse &rarr;
            </Link>
            <button
              className="btn-continue"
              onClick={() => (window.location.href = "/")}
            >
              Continuer mes achats
            </button>

            {/* Badges de réassurance */}
            <div className="security-badges">
              <span className="badge-icon">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <span className="badge-icon">
                <FontAwesomeIcon icon={faTruck} />
              </span>
              <span className="badge-icon">
                <FontAwesomeIcon icon={faShieldAlt} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
