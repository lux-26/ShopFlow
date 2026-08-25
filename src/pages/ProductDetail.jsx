import { useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faCartShopping,
  faCircleCheck,
  faCodeCompare,
  faBolt,
  faMicrophone,
  faPlay,
  faHeart,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { faBluetooth } from "@fortawesome/free-brands-svg-icons";
import "../components/ProductCard.css";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();

  // 1. Récupération prioritaire via le state passé au clic
  let rawProduct = location.state?.product;

  const defaultProducts = [
    {
      id: 1,
      name: "Montre Connectée Sport Edition",
      price: 49.99,
      category: "Accessoires",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: 2,
      name: "Écouteurs TWS Pro Sans Fil",
      price: 29.99,
      category: "Accessoires",
      image:
        "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: 3,
      name: "Chargeur Rapide USB-C GaN 90W",
      price: 39.99,
      category: "Accessoires",
      image:
        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: 4,
      name: "Sac à dos pour PC Portable",
      price: 24.99,
      category: "Bagagerie",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
    },
  ];

  // 2. Si absent du state, on cherche dans le localStorage et les produits par défaut
  if (!rawProduct) {
    const savedProducts =
      JSON.parse(localStorage.getItem("shopflow_products")) || [];
    const allProducts = [...savedProducts, ...defaultProducts];

    rawProduct = allProducts.find((p) => {
      const matchId = String(p.id) === String(id);
      const matchSlug =
        p.name?.toLowerCase().replace(/\s+/g, "-") === String(id).toLowerCase();
      const matchIncludes = String(id).includes(String(p.id));
      return matchId || matchSlug || matchIncludes;
    });

    if (!rawProduct && allProducts.length > 0) {
      rawProduct = allProducts[0];
    }
  }

  // S'il est vraiment introuvable
  if (!rawProduct) {
    return (
      <div
        className="product-not-found"
        style={{ padding: "80px 20px", textAlign: "center" }}
      >
        <h2>Produit introuvable</h2>
        <p>Désolé, ce produit n'existe pas ou a été supprimé.</p>
        <Link to="/" className="btn-back">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  // 3. NORMALISATION : On s'assure d'uniformiser les données peu importe d'où vient le clic (Accueil, Catalogue, Recherche)
  const product = {
    ...rawProduct,
    id: rawProduct.id || id,
    name:
      rawProduct.name ||
      rawProduct.title ||
      rawProduct.nom ||
      "Produit sans nom",
    price:
      rawProduct.price !== undefined
        ? rawProduct.price
        : rawProduct.tarif || rawProduct.montant || 0,
    image:
      rawProduct.image ||
      rawProduct.img ||
      rawProduct.imageUrl ||
      defaultProducts[0].image,
    category: rawProduct.category || rawProduct.categorie || "Accessoires",
    description: rawProduct.description || rawProduct.desc || "",
  };

  const productImages = [
    product.image,
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=500&auto=format&fit=crop&q=60",
  ];

  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [isSaved, setIsSaved] = useState(() => {
    const wishlist =
      JSON.parse(localStorage.getItem("shopflow_wishlist")) || [];
    return wishlist.some((item) => String(item.id) === String(product.id));
  });

  const [isCompared, setIsCompared] = useState(() => {
    const comparison =
      JSON.parse(localStorage.getItem("shopflow_comparison")) || [];
    return comparison.some((item) => String(item.id) === String(product.id));
  });

  const [activeImage, setActiveImage] = useState(productImages[0]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVideoActive, setIsVideoActive] = useState(false);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const triggerNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
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
    triggerNotification("Produit ajouté au panier avec succès !");
  };

  const handleToggleSave = () => {
    const wishlist =
      JSON.parse(localStorage.getItem("shopflow_wishlist")) || [];
    let updatedWishlist;

    if (isSaved) {
      updatedWishlist = wishlist.filter(
        (item) => String(item.id) !== String(product.id),
      );
      triggerNotification("Retiré de vos favoris.");
    } else {
      updatedWishlist = [...wishlist, product];
      triggerNotification("Ajouté à vos favoris avec succès !");
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
      triggerNotification("Retiré de la liste de comparaison.");
    } else {
      updatedComparison = [...comparison, product];
      triggerNotification("Ajouté à la comparaison avec succès !");
    }

    localStorage.setItem(
      "shopflow_comparison",
      JSON.stringify(updatedComparison),
    );
    setIsCompared(!isCompared);
  };

  return (
    <div className="product-detail-page">
      {showToast && (
        <div className="custom-toast-notification">
          <div className="toast-icon-wrapper">
            <FontAwesomeIcon icon={faCircleInfo} />
          </div>
          <div className="toast-content">
            <span className="toast-title">Succès</span>
            <p className="toast-message">{toastMessage}</p>
          </div>
        </div>
      )}

      <div className="product-detail-container">
        <div className="product-gallery-section">
          <div className="main-image-wrapper">
            {product.badge && (
              <span className="badge-new">{product.badge}</span>
            )}

            {isVideoActive ? (
              <div className="video-container">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Démonstration produit"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <img
                src={activeImage}
                alt={product.name}
                className="main-image"
              />
            )}
          </div>

          <div className="thumbnails-grid">
            {productImages.map((img, index) => (
              <div
                key={index}
                className={`thumb ${!isVideoActive && activeIndex === index ? "active" : ""}`}
                onClick={() => {
                  setActiveImage(img);
                  setActiveIndex(index);
                  setIsVideoActive(false);
                }}
              >
                <img src={img} alt={`miniature ${index + 1}`} />
              </div>
            ))}

            <div
              className={`thumb thumb-video ${isVideoActive ? "active" : ""}`}
              onClick={() => {
                setIsVideoActive(true);
              }}
            >
              <img
                src={product.image}
                alt="aperçu vidéo"
                className="thumb-video-img"
              />
              <div className="play-overlay">
                <FontAwesomeIcon icon={faPlay} />
              </div>
            </div>
          </div>
        </div>

        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>

          <div className="product-rating">
            <span className="stars">
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
            </span>
            <span className="reviews-count">(128 avis)</span>
          </div>

          {/* CORRECTION DE LA DEVISE : Affichage en FCFA pour tout harmoniser */}
          <div className="product-price-tag">
            {typeof product.price === "number"
              ? `${product.price.toLocaleString()} FCFA`
              : product.price || "Prix non disponible"}
          </div>

          <p className="product-description-text">
            {product.description ||
              `Découvrez le produit ${product.name}, conçu pour vous offrir une performance optimale dans la catégorie ${product.category}. Qualité garantie et design soigné.`}
          </p>

          <div className="stock-status">
            <FontAwesomeIcon icon={faCircleCheck} /> En stock - Expédition
            immédiate
          </div>

          <div className="purchase-actions">
            <div className="quantity-selector">
              <button onClick={handleDecrease}>&minus;</button>
              <span>{quantity}</span>
              <button onClick={handleIncrease}>+</button>
            </div>
            <button className="btn-add-to-cart" onClick={handleAddToCart}>
              <FontAwesomeIcon icon={faCartShopping} /> Ajouter au panier
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

          <div className="product-features-list">
            <div className="feature-item">
              <FontAwesomeIcon icon={faBluetooth} /> Bluetooth 5.2 avec portée
              de 15 mètres
            </div>
            <div className="feature-item">
              <FontAwesomeIcon icon={faBolt} /> Charge rapide : 5 heures
              d'écoute en 10 minutes
            </div>
            <div className="feature-item">
              <FontAwesomeIcon icon={faMicrophone} /> Microphones intégrés pour
              des appels clairs
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
