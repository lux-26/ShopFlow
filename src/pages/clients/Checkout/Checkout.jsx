import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faCreditCard,
  faLock,
  faCheckCircle,
  faChevronRight,
  faDesktop,
} from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../../../context/ToastContext";
import "./Checkout.css";

export default function Checkout() {
  const [shippingMode, setShippingMode] = useState("standard");

  const [paymentMethod, setPaymentMethod] = useState(() => {
    const saved = localStorage.getItem("shopflow_payment_method");
    if (saved === "mobile") return "orange";
    if (saved === "cash") return "cash";
    if (saved === "card") return "card";
    return "card";
  });

  const [cartItems, setCartItems] = useState(
    () => JSON.parse(localStorage.getItem("shopflow_cart")) || [],
  );
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);

  // États pour l'adresse de livraison (initialisés à vide)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  // États pour les champs de paiement
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const { showToast } = useToast();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const shippingFee =
    cartItems.length === 0 ? 0 : shippingMode === "express" ? 2500 : 0;

  const loyaltyDiscount = useLoyaltyPoints ? 5000 : 0;
  const finalTotal = subtotal + shippingFee - loyaltyDiscount;

  const handleConfirmOrder = () => {
    if (cartItems.length === 0) {
      showToast("Attention", "Votre panier est vide !", "error");
      return;
    }

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !address.trim() ||
      !city.trim() ||
      !phone.trim()
    ) {
      showToast(
        "Attention",
        "Veuillez remplir tous les champs de l'adresse de livraison.",
        "error",
      );
      return;
    }

    if (paymentMethod === "card") {
      if (!cardNumber.trim() || !cardExp.trim() || !cardCvc.trim()) {
        showToast(
          "Attention",
          "Veuillez remplir tous les champs de votre carte bancaire.",
          "error",
        );
        return;
      }
    } else if (paymentMethod === "orange" || paymentMethod === "wave") {
      if (!phoneNumber.trim()) {
        showToast(
          "Attention",
          "Veuillez entrer votre numéro de téléphone pour le paiement.",
          "error",
        );
        return;
      }
    }

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

    localStorage.removeItem("shopflow_cart");
    setCartItems([]);

    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("notificationUpdated"));

    showToast(
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
      <div className="checkout-container">
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
          <div className="checkout-left-column">
            <div className="checkout-card">
              <div className="card-section-title">
                <FontAwesomeIcon icon={faTruck} />
                <h2>Adresse de Livraison</h2>
              </div>

              <div className="form-grid-2">
                <div className="form-group-checkout">
                  <label>Prénom</label>
                  <input
                    type="text"
                    placeholder="Ex: Jean"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="form-group-checkout">
                  <label>Nom</label>
                  <input
                    type="text"
                    placeholder="Ex: Dupont"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="form-group-checkout full-width">
                  <label>Adresse complète</label>
                  <input
                    type="text"
                    placeholder="Ex: 123 Rue de la République"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="form-group-checkout">
                  <label>Ville</label>
                  <input
                    type="text"
                    placeholder="Ex: Dakar"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="form-group-checkout">
                  <label>Téléphone</label>
                  <input
                    type="text"
                    placeholder="+221 77 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

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

            <div className="checkout-card mt-24">
              <div className="card-section-title">
                <FontAwesomeIcon icon={faCreditCard} />
                <h2>Moyen de Paiement</h2>
              </div>

              <div className="payment-options-stack">
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
                          alt={`Photo du produit ${item.name}`}
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
                <span>
                  Frais de livraison (
                  {shippingMode === "express" ? "Express" : "Standard"})
                </span>
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
