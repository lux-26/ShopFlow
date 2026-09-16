import { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../../../components/clients/shared/ProductCard/ProductCard";
import heroImg from "../../../assets/hero.jpeg";
import { useToast } from "../../../context/ToastContext";
import { useProducts } from "../../../hooks/useProducts";
import apiClient from "../../../utils/apiClient";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const categoriesRef = useRef(null);
  const [categories, setCategories] = useState([]);

  const { showToast } = useToast();
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

    showToast(
      "Produit ajouté !",
      `${product.name} a bien été ajouté à votre panier.`,
      "success",
    );

    window.dispatchEvent(new Event("cartUpdated"));
  };

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

  const handleCategoryClick = (categoryName) => {
    navigate(`/catalog?category=${encodeURIComponent(categoryName)}`);
  };

  useEffect(() => {
    const isFirstVisit = localStorage.getItem("shopflow_is_logged") === null;
    if (isFirstVisit) {
      localStorage.setItem("shopflow_is_logged", "false");
    }
  }, []);

  const { products, isLoading } = useProducts();

  useEffect(() => {
    apiClient
      .get("/categories")
      .then((data) => setCategories(data.categories))
      .catch(() => setCategories([]));
  }, []);

  const trendingProducts = products.slice(0, 4);

  return (
    <div className="home-page page-transition">
      {/* Bannière Hero */}
      <section
        className="hero-banner"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="hero-image-overlay"></div>
        <div className="hero-content">
          <span className="hero-badge">Nouvelle Collection 2026</span>
          <h1>La précision rencontre l'élégance</h1>
          <p>
            Découvrez notre sélection rigoureuse de produits haut de gamme
            conçus pour élever votre quotidien. Le design minimaliste au service
            de la performance.
          </p>
          <Link to="/catalog" className="hero-btn">
            Explorer le catalogue
          </Link>
        </div>
      </section>

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
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => handleCategoryClick(cat.name)}
              style={{ cursor: "pointer" }}
            >
              <div className="category-img-container">
                <img src={cat.image} alt={`Catégorie ${cat.name}`} />
              </div>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="catalog-section">
        <div className="catalog-header">
          <h2>Tendances Actuelles</h2>
          <p>Les choix favoris de notre communauté</p>
        </div>

        <div className="product-grid">
          {isLoading ? (
            <p>Chargement des produits...</p>
          ) : trendingProducts.length > 0 ? (
            trendingProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))
          ) : (
            <p>Aucun produit disponible pour le moment.</p>
          )}
        </div>

        {/* Bouton Voir tout le catalogue avec une classe dédiée */}
        <div className="catalog-footer">
          <Link to="/catalog" className="btn-view-all btn-view-all-soft">
            Voir tout le catalogue &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
