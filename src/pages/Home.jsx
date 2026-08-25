import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { catalogProducts as PRODUCTS } from "./Catalog"; // Correction de l'import ici
import ProductCard from "../components/ProductCard";
import heroImg from "../assets/hero.jpeg";
import "./Home.css";

const CATEGORIES = [
  {
    id: 1,
    name: "Électronique",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
  },
  {
    id: 2,
    name: "Accessoires",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80",
  },
  {
    id: 3,
    name: "Mobilier",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80",
  },
  {
    id: 4,
    name: "Beauté",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&q=80",
  },
  {
    id: 5,
    name: "Mode & Vêtements",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&q=80",
  },
  {
    id: 6,
    name: "Sport & Loisirs",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=300&q=80",
  },
  {
    id: 7,
    name: "Cuisine & Maison",
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300&q=80",
  },
  {
    id: 8,
    name: "Informatique",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&q=80",
  },
];

export default function Home() {
  const categoriesRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [addedProductTitle, setAddedProductTitle] = useState("");

  const scrollLeft = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleAddToCart = (product) => {
    const currentCart = JSON.parse(localStorage.getItem("shopflow_cart")) || [];
    const existingIndex = currentCart.findIndex(
      (item) => item.id === product.id,
    );

    if (existingIndex > -1) {
      currentCart[existingIndex].quantity += 1;
    } else {
      currentCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("shopflow_cart", JSON.stringify(currentCart));
    setAddedProductTitle(product.name);
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 3000);

    window.dispatchEvent(new Event("cartUpdated"));
  };

  useEffect(() => {
    const isFirstVisit = localStorage.getItem("shopflow_is_logged") === null;
    if (isFirstVisit) {
      localStorage.setItem("shopflow_is_logged", "false");
    }
  }, []);

  return (
    <div className="home-page">
      {/* Pop-up unifié en bas à droite */}
      {showPopup && (
        <div
          className="custom-toast-notification"
          style={{ borderLeftColor: "#1e3a8a" }}
        >
          <div className="toast-icon-wrapper" style={{ color: "#1e3a8a" }}>
            <FontAwesomeIcon icon={faCircleInfo} />
          </div>
          <div className="toast-content">
            <span className="toast-title">Produit ajouté !</span>
            <p className="toast-message">
              {addedProductTitle} a bien été ajouté à votre panier.
            </p>
          </div>
        </div>
      )}

      {/* Bannière Hero */}
      <section
        className="hero-banner"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="hero-image-overlay"></div>
      </section>

      {/* Section Catégories */}
      <section className="categories-section">
        <div className="categories-header">
          <h2>Catégories</h2>
          <div className="categories-nav-buttons">
            <button
              onClick={scrollLeft}
              className="nav-btn"
              aria-label="Défiler vers la gauche"
            >
              &lt;
            </button>
            <button
              onClick={scrollRight}
              className="nav-btn"
              aria-label="Défiler vers la droite"
            >
              &gt;
            </button>
          </div>
        </div>
        <div className="categories-grid" ref={categoriesRef}>
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="category-card">
              <div className="category-img-container">
                <img src={cat.image} alt={cat.name} />
              </div>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section Tendances Actuelles (Catalogue) */}
      <section className="catalog-section">
        <div className="catalog-header">
          <h2>Tendances Actuelles</h2>
          <p>Les choix favoris de notre communauté</p>
        </div>

        <div className="product-grid">
          {PRODUCTS && PRODUCTS.length > 0 ? (
            PRODUCTS.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))
          ) : (
            <p>Chargement des produits...</p>
          )}
        </div>

        {/* Bouton Voir tout le catalogue */}
        <div className="catalog-footer">
          <Link to="/catalog" className="btn-view-all">
            Voir tout le catalogue
          </Link>
        </div>
      </section>
    </div>
  );
}
