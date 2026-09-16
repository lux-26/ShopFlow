import { useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faCartShopping,
  faCircleCheck,
  faBan,
  faCodeCompare,
  faHeart,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import "../../../components/clients/shared/ProductCard/ProductCard.css";
import { useToast } from "../../../context/ToastContext";
import { getBadgeClass } from "../../../utils/badgeUtils";
import { useProduct } from "../../../hooks/useProducts";
import { getStockStatus } from "../../../utils/productUtils";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { showToast } = useToast(); // <--- On récupère le Toast global ici

  // 1. Récupération rapide via le state passé au clic (évite un fetch inutile
  //    quand on arrive depuis une carte produit du catalogue).
  const stateProduct = location.state?.product;

  // 2. Sinon, vrai appel à l'API (cas d'un accès direct par URL / rechargement).
  const {
    product: fetchedProduct,
    isLoading,
    error,
  } = useProduct(stateProduct ? null : id);

  const product = stateProduct || fetchedProduct;

  const [quantity, setQuantity] = useState(1);

  const [isSaved, setIsSaved] = useState(() => {
    const wishlist =
      JSON.parse(localStorage.getItem("shopflow_wishlist")) || [];
    return product
      ? wishlist.some((item) => String(item.id) === String(product.id))
      : false;
  });

  const [isCompared, setIsCompared] = useState(() => {
    const comparison =
      JSON.parse(localStorage.getItem("shopflow_comparison")) || [];
    return product
      ? comparison.some((item) => String(item.id) === String(product.id))
      : false;
  });

  // Les hooks doivent toujours être appelés dans le même ordre, y compris
  // pendant le chargement ou si l'URL pointe vers un produit inexistant.
  if (isLoading) {
    return (
      <div
        className="product-not-found page-transition"
        style={{ padding: "80px 20px", textAlign: "center" }}
      >
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        <p style={{ marginTop: "16px" }}>Chargement du produit...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="product-not-found page-transition"
        style={{ padding: "80px 20px", textAlign: "center" }}
      >
        <h2>Produit introuvable</h2>
        <p>{error || "Désolé, ce produit n'existe pas ou a été supprimé."}</p>
        <Link to="/" className="btn-back">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("shopflow_cart")) || [];
    const existingIndex = cart.findIndex(
      (item) => String(item.id) === String(product.id),
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity =
        (cart[existingIndex].quantity || 1) + quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("shopflow_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));

    showToast(
      "Produit ajouté !",
      `${product.name} a bien été ajouté à votre panier.`,
      "success",
    );
  };

  const handleToggleSave = () => {
    const wishlist =
      JSON.parse(localStorage.getItem("shopflow_wishlist")) || [];
    let updatedWishlist;

    if (isSaved) {
      updatedWishlist = wishlist.filter(
        (item) => String(item.id) !== String(product.id),
      );
      showToast(
        "Retiré des favoris",
        `${product.name} a été retiré de vos favoris.`,
        "info",
      );
    } else {
      updatedWishlist = [...wishlist, product];
      showToast(
        "Favoris mis à jour",
        `${product.name} a été ajouté à vos favoris avec succès !`,
        "success",
      );
    }

    localStorage.setItem("shopflow_wishlist", JSON.stringify(updatedWishlist));
    setIsSaved(!isSaved);
  };

  const handleToggleCompare = () => {
    const comparison =
      JSON.parse(localStorage.getItem("shopflow_comparison")) || [];
    let updatedComparison;

    if (isCompared) {
      updatedComparison = comparison.filter(
        (item) => String(item.id) !== String(product.id),
      );
      showToast(
        "Comparaison",
        `${product.name} a été retiré de la liste de comparaison.`,
        "info",
      );
    } else {
      updatedComparison = [...comparison, product];
      showToast(
        "Comparaison",
        `${product.name} a été ajouté à la comparaison avec succès !`,
        "success",
      );
    }

    localStorage.setItem(
      "shopflow_comparison",
      JSON.stringify(updatedComparison),
    );
    setIsCompared(!isCompared);
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-gallery-section">
          <div className="main-image-wrapper">
            {product.badge && (
              <span className={`product-badge ${getBadgeClass(product.badge)}`}>
                {product.badge}
              </span>
            )}

            <img
              src={product.image || "https://placehold.co/600x600?text=Pas+d%27image"}
              alt={`Photo du produit ${product.name}`}
              className="main-image"
            />
          </div>
        </div>

        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>

          <div className="product-rating">
            <span className="stars">
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon
                  key={i}
                  icon={faStar}
                  className={i < (product.rating || 0) ? "star-active" : "star-inactive"}
                />
              ))}
            </span>
            <span className="reviews-count">
              {product.reviews ? `(${product.reviews} avis)` : "(Aucun avis pour le moment)"}
            </span>
          </div>

          <div className="product-price-tag">
            {product.oldPrice && (
              <span
                style={{
                  textDecoration: "line-through",
                  color: "#94a3b8",
                  fontSize: "0.6em",
                  marginRight: "10px",
                  fontWeight: 500,
                }}
              >
                {product.oldPrice.toLocaleString()} FCFA
              </span>
            )}
            {typeof product.price === "number"
              ? `${product.price.toLocaleString()} FCFA`
              : product.price || "Prix non disponible"}
          </div>

          <p className="product-description-text">
            {product.description ||
              `Découvrez le produit ${product.name}, dans la catégorie ${product.category}.`}
          </p>

          {(() => {
            const stockStatus = getStockStatus(product.stock);
            const isAvailable = stockStatus.type !== "danger";
            return (
              <div className="stock-status">
                <FontAwesomeIcon icon={isAvailable ? faCircleCheck : faBan} />{" "}
                {isAvailable
                  ? `${stockStatus.label} (${product.stock} unités disponibles)`
                  : "Rupture de stock"}
              </div>
            );
          })()}

          <div className="purchase-actions">
            <div className="quantity-selector">
              <button onClick={handleDecrease} disabled={product.stock === 0}>
                &minus;
              </button>
              <span>{quantity}</span>
              <button onClick={handleIncrease} disabled={product.stock === 0}>
                +
              </button>
            </div>
            <button
              className="btn-add-to-cart"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <FontAwesomeIcon icon={faCartShopping} />{" "}
              {product.stock === 0 ? "Indisponible" : "Ajouter au panier"}
            </button>
          </div>

          <div className="product-actions-group">
            <button
              className={`action-btn ${isSaved ? "saved" : ""}`}
              onClick={handleToggleSave}
            >
              <FontAwesomeIcon icon={faHeart} />
              <span>{isSaved ? "Sauvegardé" : "Sauvegarder"}</span>
            </button>

            <button
              className={`action-btn ${isCompared ? "compared" : ""}`}
              onClick={handleToggleCompare}
            >
              <FontAwesomeIcon icon={faCodeCompare} />
              <span>{isCompared ? "Comparé" : "Comparer"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
