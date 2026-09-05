import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { getBadgeClass } from "../../../../utils/badgeUtils";

export default function ProductCard({ product, onAddToCart }) {
  if (!product) return null;

  return (
    <div className="product-card page-transition">
      <div className="product-image-container">
        {product.badge && (
          <span className={`product-badge ${getBadgeClass(product.badge)}`}>
            {product.badge}
          </span>
        )}
        {/* ON PASSE LE PRODUIT VIA LE STATE ICI */}
        <Link to={`/produit/${product.id}`} state={{ product }}>
          <img
            src={product.image || product.imageUrl}
            alt={
              product.name
                ? `Photo du produit ${product.name}`
                : "Photo du produit"
            }
            className="product-image"
          />
        </Link>
      </div>

      <div className="product-info">
        {product.category && (
          <span className="product-category">{product.category}</span>
        )}
        <h3 className="product-title">{product.name}</h3>

        <div className="product-footer">
          <p className="product-price">
            {typeof product.price === "number"
              ? `${product.price.toLocaleString()} FCFA`
              : product.price || "Prix non disponible"}
          </p>

          <button
            className="btn-add-cart"
            onClick={() => onAddToCart(product)}
            title="Ajouter au panier"
          >
            <FontAwesomeIcon icon={faCartShopping} />
          </button>
        </div>
      </div>
    </div>
  );
}
