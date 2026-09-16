import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faLocationDot,
  faPaperPlane,
  faCircleCheck,
  faStore,
  faShieldHalved,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import "./Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="contact-page page-transition">
      <div className="contact-container">
        {/* SECTION À PROPOS / NOTRE HISTOIRE */}
        <div className="about-shopflow-card">
          <div className="about-header-icon">
            <FontAwesomeIcon icon={faStore} />
          </div>
          <h2>À propos de ShopFlow</h2>
          <p className="about-text">
            Né à Dakar, <strong>ShopFlow</strong> est bien plus qu'une simple
            plateforme e-commerce : c'est une vitrine moderne pensée pour offrir
            une expérience de shopping fluide, rapide et sécurisée. Notre
            mission est de rapprocher les consommateurs des meilleurs produits
            électroniques, de mode et d'articles de maison avec un service de
            proximité irréprochable.
          </p>
          <div className="about-features-grid">
            <div className="about-feature">
              <FontAwesomeIcon icon={faTruckFast} className="feat-icon" />
              <span>Livraison rapide à Dakar et partout au Sénégal</span>
            </div>
            <div className="about-feature">
              <FontAwesomeIcon icon={faShieldHalved} className="feat-icon" />
              <span>Paiement sécurisé et garantie qualité</span>
            </div>
          </div>
        </div>

        {/* EN-TÊTE CONTACT */}
        <div className="contact-header">
          <h1>Besoin d'aide ? Contactez-nous</h1>
          <p>
            Notre équipe est à votre écoute pour toute question relative à vos
            commandes ou produits.
          </p>
        </div>

        {/* GRILLE FORMULAIRE & COORDONNÉES */}
        <div className="contact-grid">
          {/* Informations de contact */}
          <div className="contact-info-card">
            <h2>Nos Coordonnées</h2>
            <p className="info-desc">
              Préférez-vous nous contacter directement ? Retrouvez-nos canaux
              officiels ci-dessous.
            </p>

            <div className="info-item">
              <div className="icon-box">
                <FontAwesomeIcon icon={faLocationDot} />
              </div>
              <div>
                <h3>Localisation</h3>
                <p>Dakar, Sénégal</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-box">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <div>
                <h3>Téléphone / WhatsApp</h3>
                <p>+221 77 000 00 00</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-box">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <div>
                <h3>Email</h3>
                <p>support@shopflow.sn</p>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="contact-form-card">
            <h2>Envoyez-nous un message</h2>

            {submitted && (
              <div className="success-banner">
                <FontAwesomeIcon icon={faCircleCheck} />
                <span>
                  Votre message a bien été transmis ! Nous vous répondrons sous
                  24h.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Nom complet</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Ablaye Tamba"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Adresse Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ex: ablaye@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Sujet</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Ex: Suivi de commande #1024"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Écrivez votre message ici..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-submit-contact">
                <FontAwesomeIcon icon={faPaperPlane} /> Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
