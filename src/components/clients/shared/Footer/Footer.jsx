import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import "./Footer.css";

export default function Footer() {
  const navigate = useNavigate();

  // Intercepte le clic pour vérifier si l'utilisateur est connecté
  const handleAccountClick = (e) => {
    e.preventDefault();
    const isLogged = localStorage.getItem("shopflow_is_logged");

    if (isLogged) {
      navigate("/profile"); // S'il est connecté, va sur le profil
    } else {
      navigate("/login"); // S'il est déconnecté, redirige vers la connexion !
    }
  };

  return (
    <footer className="shopflow-footer page-transition">
      <div className="footer-container">
        {/* Colonne 1 : Logo, description et réseaux sociaux */}
        <div className="footer-col">
          <div className="footer-logo">
            <span className="logo-text">ShopFlow</span>
          </div>

          <p className="footer-desc">
            Votre destination e-commerce de confiance pour une expérience
            d'achat fluide, rapide et sécurisée.
          </p>

          <div className="social-links">
            <a href="#facebook" aria-label="Facebook">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="#twitter" aria-label="Twitter">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="#instagram" aria-label="Instagram">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="#linkedin" aria-label="LinkedIn">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
        </div>

        {/* Colonne 2 : Navigation */}
        <div className="footer-col">
          <h3>Navigation</h3>

          <ul>
            <li>
              <a href="/">Accueil</a>
            </li>

            <li>
              <a href="/cart">Panier</a>
            </li>

            <li>
              {/* Utilisation du gestionnaire de clic pour bloquer l'accès si déconnecté */}
              <a
                href="/profile"
                onClick={handleAccountClick}
                style={{ cursor: "pointer" }}
              >
                Mon Compte
              </a>
            </li>

            <li>
              <a href="/loyalty">Programme Fidélité</a>
            </li>
          </ul>
        </div>

        {/* Colonne 3 : Aide & Support */}
        <div className="footer-col">
          <h3>Aide & Support</h3>

          <ul>
            <li>
              <a href="#faq">Centre d'aide / FAQ</a>
            </li>
            <li>
              <a href="#shipping">Suivi de commande</a>
            </li>
            <li>
              <a href="#returns">Retours et Remboursements</a>
            </li>
            <li>
              <a href="#terms">Conditions Générales</a>
            </li>
          </ul>
        </div>

        {/* Colonne 4 : Contact */}
        <div className="footer-col">
          <h3>Contactez-nous</h3>

          <p>
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            Dakar, Sénégal
          </p>

          <p>
            <FontAwesomeIcon icon={faPhone} />
            +221 33 000 00 00
          </p>

          <p>
            <FontAwesomeIcon icon={faEnvelope} />
            support@shopflow.com
          </p>
        </div>
      </div>

      {/* Barre de bas de page */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ShopFlow. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
