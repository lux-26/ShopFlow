import { useSearchParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useProducts } from "../../../hooks/useProducts";
import "./SearchPage.css";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const { products, isLoading, error } = useProducts();

  const filteredProducts = useMemo(() => {
    const searchTerm = query.toLowerCase().trim();

    return products.filter((product) => {
      const name = (product.name || "").toLowerCase();
      const category = (product.category || "").toLowerCase();
      return name.includes(searchTerm) || category.includes(searchTerm);
    });
  }, [products, query]);

  // CORRECTION : On passe l'objet product complet dans le state de la navigation
  const handleProductClick = (product) => {
    navigate(`/produit/${product.id}`, { state: { product } });
  };

  return (
    <div className="search-results-container page-transition">
      <h2>Résultats de recherche pour : "{query}"</h2>

      <div className="products-grid">
        {isLoading ? (
          <p>
            <FontAwesomeIcon icon={faSpinner} spin /> Recherche en cours...
          </p>
        ) : error ? (
          <p style={{ color: "#dc2626" }}>{error}</p>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleProductClick(product)}
              style={{ cursor: "pointer" }}
            >
              {product.image && (
                <div className="product-image-container">
                  <img
                    src={product.image || product.imageUrl}
                    alt={`Photo du produit ${product.name}`}
                    className="product-image"
                  />
                </div>
              )}
              <h3>{product.name}</h3>

              {/* CORRECTION DE LA DEVISE : Affichage en FCFA propre */}
              <p className="product-price">
                {typeof product.price === "number"
                  ? `${product.price.toLocaleString()} FCFA`
                  : product.price || "Prix non disponible"}
              </p>
            </div>
          ))
        ) : (
          <p>Aucun produit ne correspond à votre recherche.</p>
        )}
      </div>
    </div>
  );
}
