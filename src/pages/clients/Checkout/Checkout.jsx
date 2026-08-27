import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faCreditCard,
  faLock,
  faCheckCircle,
  faChevronRight,
  faDesktop,
  faCircleInfo,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import "./Checkout.css";

export default function Checkout() {
  const [shippingMode, setShippingMode] = useState("standard");

  // CORRECTION : On initialise le moyen de paiement depuis le localStorage ("shopflow_payment_method")
  const [paymentMethod, setPaymentMethod] = useState(() => {
    const saved = localStorage.getItem("shopflow_payment_method");
    if (saved === "mobile") return "orange"; // "mobile" dans le profil correspond à orange/wave par défaut
    if (saved === "cash") return "cash";
    if (saved === "card") return "card";
    return "card"; // Valeur par défaut de secours
  });

  const [useFidelityPoints, setUseFidelityPoints] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);

  // États pour les champs de paiement
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({
    title: "",
    message: "",
    type: "success",
  });

  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Les frais de livraison sont à 0 si le panier est vide, sinon selon le mode
  const shippingFee =
    cartItems.length === 0 ? 0 : shippingMode === "express" ? 2500 : 0;

  const loyaltyDiscount = useLoyaltyPoints ? 5000 : 0;
  const finalTotal = subtotal + shippingFee - loyaltyDiscount;

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("shopflow_cart")) || [];
    setCartItems(savedCart);
  }, []);

  const triggerPopup = (title, message, type = "success") => {
    setPopupData({ title, message, type });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  // Fonction unique et corrigée de confirmation de commande
  const handleConfirmOrder = () => {
    if (cartItems.length === 0) {
      triggerPopup("Attention", "Votre panier est vide !", "error");
      return;
    }

    // Vérification pour la Carte Bancaire
    if (paymentMethod === "card") {
      if (!cardNumber.trim() || !cardExp.trim() || !cardCvc.trim()) {
        triggerPopup(
          "Attention",
          "Veuillez remplir tous les champs de votre carte bancaire.",
          "error",
        );
        return;
      }
    }

    // Vérification du numéro pour Orange Money ou Wave
    if (
      (paymentMethod === "orange" || paymentMethod === "wave") &&
      !phoneNumber.trim()
    ) {
      triggerPopup(
        "Attention",
        "Veuillez entrer votre numéro de téléphone pour le paiement.",
        "error",
      );
      return;
    }

    // 1. Créer une nouvelle notification de commande validée
    const newNotification = {
      id: Date.now(),
      text: "Votre commande récente a été validée avec succès.",
      time: "À l'instant",
      category: "Commandes",
    };

    const existingNotifs =
      JSON.parse(localStorage.getItem("shopflow_notifications")) || [];
    const updatedNotifs = [newNotification, ...existingNotifs];
    localStorage.setItem(
      "shopflow_notifications",
      JSON.stringify(updatedNotifs),
    );

    // 2. Vider le panier dans le localStorage
    localStorage.removeItem("shopflow_cart");
    setCartItems([]);

    // 3. Déclencher les événements de mise à jour pour le reste de l'application
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("notificationUpdated"));

    // 4. Déclencher le pop-up de succès et rediriger
    triggerPopup(
      "Confirmation",
      "Commande validée avec succès ! Merci pour vos achats.",
      "success",
    );

    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="checkout-page page-transition">
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

      <div className="checkout-container">
        {/* En-tête : Titre + Fil d'Ariane des étapes */}
        <div className="checkout-header-main">
          <h1>Paiement Sécurisé</h1>
          <div className="checkout-steps">
            <span className="step-item completed">
              <span className="step-circle">
                <FontAwesomeIcon icon={faCheckCircle} />
              </span>{" "}
              Livraison
            </span>
            <span className="step-separator">
              <FontAwesomeIcon icon={faChevronRight} size="xs" />
            </span>
            <span className="step-item active">
              <span className="step-circle number">2</span> Paiement
            </span>
            <span className="step-separator">
              <FontAwesomeIcon icon={faChevronRight} size="xs" />
            </span>
            <span className="step-item">
              <span className="step-circle number">3</span> Confirmation
            </span>
          </div>
        </div>

        <div className="checkout-grid-layout">
          {/* COLONNE DE GAUCHE : Formulaires (Adresse, Livraison, Paiement) */}
          <div className="checkout-left-column">
            {/* Bloc Adresse de Livraison */}
            <div className="checkout-card">
              <div className="card-section-title">
                <FontAwesomeIcon icon={faTruck} />
                <h2>Adresse de Livraison</h2>
              </div>

              <div className="form-grid-2">
                <div className="form-group-checkout">
                  <label>Prénom</label>
                  <input type="text" defaultValue="Jean" />
                </div>
                <div className="form-group-checkout">
                  <label>Nom</label>
                  <input type="text" defaultValue="Dupont" />
                </div>
                <div className="form-group-checkout full-width">
                  <label>Adresse complète</label>
                  <input
                    type="text"
                    defaultValue="123 Rue de la République, Quartier des Arts"
                  />
                </div>
                <div className="form-group-checkout">
                  <label>Ville</label>
                  <input type="text" defaultValue="Dakar" />
                </div>
                <div className="form-group-checkout">
                  <label>Téléphone</label>
                  <input type="text" defaultValue="+221 77 123 45 67" />
                </div>
              </div>

              {/* Mode de livraison */}
              <div className="delivery-mode-section mt-24">
                <label className="section-sub-label">Mode de livraison</label>

                <div
                  className={`delivery-option-box ${shippingMode === "standard" ? "selected" : ""}`}
                  onClick={() => setShippingMode("standard")}
                >
                  <div className="delivery-option-info">
                    <input
                      type="radio"
                      checked={shippingMode === "standard"}
                      readOnly
                    />
                    <div>
                      <strong>Standard</strong>
                      <p>3 à 5 jours ouvrés</p>
                    </div>
                  </div>
                  <span className="price-tag free">Gratuit</span>
                </div>

                <div
                  className={`delivery-option-box ${shippingMode === "express" ? "selected" : ""}`}
                  onClick={() => setShippingMode("express")}
                >
                  <div className="delivery-option-info">
                    <input
                      type="radio"
                      checked={shippingMode === "express"}
                      readOnly
                    />
                    <div>
                      <strong>Express</strong>
                      <p>Livraison demain avant 13h</p>
                    </div>
                  </div>
                  <span className="price-tag">2 500 FCFA</span>
                </div>
              </div>
            </div>

            {/* Bloc Moyen de Paiement */}
            <div className="checkout-card mt-24">
              <div className="card-section-title">
                <FontAwesomeIcon icon={faCreditCard} />
                <h2>Moyen de Paiement</h2>
              </div>

              <div className="payment-options-stack">
                {/* Option 1 : Carte Bancaire */}
                <div
                  className={`payment-option-card ${paymentMethod === "card" ? "selected" : ""}`}
                >
                  <div
                    className="payment-option-header"
                    onClick={() => setPaymentMethod("card")}
                  >
                    <input
                      type="radio"
                      checked={paymentMethod === "card"}
                      readOnly
                    />
                    <span>Carte Bancaire</span>
                    <FontAwesomeIcon
                      icon={faCreditCard}
                      className="ms-auto card-brand-icon"
                    />
                  </div>

                  {paymentMethod === "card" && (
                    <div className="card-sub-form">
                      <div className="form-group-checkout full-width mb-12">
                        <label>Numéro de carte</label>
                        <div className="input-with-icon">
                          <input
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                          />
                          <FontAwesomeIcon
                            icon={faCreditCard}
                            className="field-icon"
                          />
                        </div>
                      </div>
                      <div className="form-row-2">
                        <div className="form-group-checkout">
                          <label>Date d'expiration</label>
                          <input
                            type="text"
                            placeholder="MM/AA"
                            value={cardExp}
                            onChange={(e) => setCardExp(e.target.value)}
                          />
                        </div>
                        <div className="form-group-checkout">
                          <label>CVC</label>
                          <input
                            type="password"
                            placeholder="123"
                            maxLength="4"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Option 2 : Orange Money */}
                <div
                  className={`payment-option-card ${paymentMethod === "orange" ? "selected" : ""}`}
                >
                  <div
                    className="payment-option-header"
                    onClick={() => setPaymentMethod("orange")}
                  >
                    <input
                      type="radio"
                      checked={paymentMethod === "orange"}
                      readOnly
                    />
                    <span>Orange Money</span>
                    <span className="operators-hint">Sécurisé</span>
                  </div>

                  {paymentMethod === "orange" && (
                    <div className="card-sub-form">
                      <div className="form-group-checkout full-width">
                        <label>Numéro de téléphone Orange Money</label>
                        <input
                          type="text"
                          placeholder="Ex: +221 70 000 00 00"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <small className="form-hint">
                          Un code de validation USSD vous sera envoyé.
                        </small>
                      </div>
                    </div>
                  )}
                </div>

                {/* Option 3 : Wave */}
                <div
                  className={`payment-option-card ${paymentMethod === "wave" ? "selected" : ""}`}
                >
                  <div
                    className="payment-option-header"
                    onClick={() => setPaymentMethod("wave")}
                  >
                    <input
                      type="radio"
                      checked={paymentMethod === "wave"}
                      readOnly
                    />
                    <span>Wave</span>
                    <span className="operators-hint">Instantané</span>
                  </div>

                  {paymentMethod === "wave" && (
                    <div className="card-sub-form">
                      <div className="form-group-checkout full-width">
                        <label>Numéro de téléphone Wave</label>
                        <input
                          type="text"
                          placeholder="Ex: +221 70 000 00 00"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <small className="form-hint">
                          Assurez-vous d'avoir l'application Wave ouverte pour
                          valider le paiement.
                        </small>
                      </div>
                    </div>
                  )}
                </div>

                {/* Option 4 : Paiement à la livraison */}
                <div
                  className={`payment-option-card simple ${paymentMethod === "cash" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("cash")}
                >
                  <div className="payment-option-header">
                    <input
                      type="radio"
                      checked={paymentMethod === "cash"}
                      readOnly
                    />
                    <span>Paiement à la livraison</span>
                  </div>
                  <FontAwesomeIcon icon={faTruck} className="operators-hint" />
                </div>
              </div>
            </div>
          </div>

          {/* COLONNE DE DROITE : Résumé de la commande */}
          <div className="checkout-right-column">
            <div className="checkout-card summary-card">
              <h2>Résumé de la commande</h2>

              <div className="checkout-items-list">
                {cartItems.length === 0 ? (
                  <p className="empty-checkout-text">Votre panier est vide.</p>
                ) : (
                  cartItems.map((item) => (
                    <div className="checkout-item" key={item.id}>
                      <div className="checkout-item-info">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="checkout-item-img"
                        />
                        <div>
                          <h4>{item.name}</h4>
                          <span className="checkout-item-variant">
                            {item.variant || "Standard"}{" "}
                            {item.quantity > 1 ? `(x${item.quantity})` : ""}
                          </span>
                        </div>
                      </div>
                      <span className="checkout-item-price">
                        {(item.price * item.quantity).toLocaleString()} FCFA
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="loyalty-box">
                <div className="loyalty-info">
                  <span className="loyalty-icon">
                    <FontAwesomeIcon icon={faDesktop} />
                  </span>
                  <div>
                    <strong>Récompense Fidélité</strong>
                    <p>
                      Solde : 1 250 points
                      <br />
                      Valeur : 5 000 FCFA
                    </p>
                  </div>
                </div>
                <div className="loyalty-action">
                  <label htmlFor="loyaltyCheck">Utiliser mes points</label>
                  <input
                    type="checkbox"
                    id="loyaltyCheck"
                    checked={useLoyaltyPoints}
                    onChange={(e) => setUseLoyaltyPoints(e.target.checked)}
                  />
                </div>
              </div>

              <div className="summary-line">
                <span>Sous-total</span>
                <span>{subtotal.toLocaleString()} FCFA</span>
              </div>
              <div className="summary-line">
                <span>Frais de livraison (Express)</span>
                <span>{shippingFee.toLocaleString()} FCFA</span>
              </div>

              {useLoyaltyPoints && (
                <div className="summary-line discount">
                  <span>Remise fidélité</span>
                  <span>-5 000 FCFA</span>
                </div>
              )}

              <hr className="summary-divider" />

              <div className="summary-total-line">
                <span>Total</span>
                <span className="total-price">
                  {finalTotal.toLocaleString()} FCFA
                </span>
              </div>

              <button className="btn-confirm-pay" onClick={handleConfirmOrder}>
                <FontAwesomeIcon icon={faLock} />
                {paymentMethod === "card" && "Payer par Carte"}
                {paymentMethod === "orange" && "Payer via Orange Money"}
                {paymentMethod === "wave" && "Payer via Wave"}
                {paymentMethod === "cash" && "Confirmer la commande"}
              </button>

              <p className="secure-text">
                <FontAwesomeIcon icon={faLock} /> Paiement 100% sécurisé et
                chiffré
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
