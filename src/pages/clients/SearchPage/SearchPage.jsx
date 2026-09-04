import { useSearchParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { catalogProducts } from "../catalog/Catalog";
import "../SearchPage/SearchPage";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const filteredProducts = useMemo(() => {
    const savedProducts =
      JSON.parse(localStorage.getItem("shopflow_products")) || catalogProducts;

    const searchTerm = query.toLowerCase().trim();

    const results = savedProducts.filter((product) => {
      const name = (product.name || product.title || "").toLowerCase();
      const category = (
        product.category ||
        product.categorie ||
        ""
      ).toLowerCase();

      // On vérifie si la recherche correspond au nom OU à la catégorie
      return name.includes(searchTerm) || category.includes(searchTerm);
    });

    return results;
  }, [query]);

  // CORRECTION : On passe l'objet product complet dans le state de la navigation
  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  return (
    <div className="search-results-container page-transition">
      <h2>Résultats de recherche pour : "{query}"</h2>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
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
                    alt={product.name}
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
