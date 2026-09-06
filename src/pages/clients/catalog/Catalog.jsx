import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faCartPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../../../context/ToastContext";
import { getBadgeClass } from "../../../utils/badgeUtils";
import { useProducts } from "../../../hooks/useProducts";
import "./Catalog.css";

const ALL_CATEGORIES = [
  "Électronique",
  "Accessoires",
  "Mobilier",
  "Beauté",
  "Mode & Vêtements",
  "Sport & Loisirs",
  "Cuisine & Maison",
  "Informatique",
];

export default function Catalog() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");
  const categoryParam = searchParams.get("category");

  const { showToast } = useToast();

  const { products, isLoading, error, reload } = useProducts();

  const [sortOption, setSortOption] = useState("pertinence");
  const [selectedCategory, setSelectedCategory] = useState("Électronique");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const displayedCategory = categoryParam || selectedCategory;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const filteredProducts = catalogProducts.filter((product) => {
    const matchesMinPrice =
      priceRange.min === "" || product.price >= Number(priceRange.min);
    const matchesMaxPrice =
      priceRange.max === "" || product.price <= Number(priceRange.max);

    if (filterParam === "nouveautes") {
      const isNewBadge = product.badge === "Nouveau";
      return isNewBadge && matchesMinPrice && matchesMaxPrice && matchesRating;
    }

    const matchesSearch =
      searchQuery.trim() === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      product.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());

    if (searchQuery.trim() !== "") {
      return (
        matchesSearch && matchesMinPrice && matchesMaxPrice && matchesRating
      );
    }

    const matchesCategory = product.category === displayedCategory;
    return (
      matchesCategory && matchesMinPrice && matchesMaxPrice && matchesRating
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "price-asc") return a.price - b.price;
    if (sortOption === "price-desc") return b.price - a.price;
    // "Pertinence" par défaut : l'ordre renvoyé par l'API (plus récent d'abord).
    return 0;
  });

  const itemsPerPage = 3;
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const safeCurrentPage = currentPage > totalPages ? 1 : currentPage;

  const indexOfLastItem = safeCurrentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

    // Déclenchement propre du toast global positionné en haut à droite via Portal
    showToast(
      "Succès",
      `${product.name} a bien été ajouté au panier avec succès.`,
      "success",
    );

    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="catalog-page page-transition">
      <div className="catalog-container">
        <div className="catalog-header">
          <h1 className="catalog-title">
            {filterParam === "nouveautes"
              ? "✨ Nouveautés"
              : `Catalogue : ${displayedCategory}`}
          </h1>
          <div className="catalog-sort">
            <label htmlFor="sort-select">Trier par : </label>
            <select
              id="sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="pertinence">Pertinence</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>
        </div>

        <div className="catalog-layout">
          <aside className="filters-sidebar">
            <h2>Filtres</h2>

            {filterParam !== "nouveautes" && (
              <div className="filter-group">
                <h3>Catégorie</h3>
                {ALL_CATEGORIES.map((cat) => (
                  <label key={cat}>
                    <input
                      type="radio"
                      name="category"
                      checked={displayedCategory === cat}
                      onChange={() => {
                        setSelectedCategory(cat);
                        setCurrentPage(1);
                        navigate(
                          `/catalog?category=${encodeURIComponent(cat)}`,
                          {
                            replace: true,
                          },
                        );
                      }}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            )}

            <div className="filter-group">
              <h3>Prix (FCFA)</h3>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => {
                    setPriceRange({ ...priceRange, min: e.target.value });
                    setCurrentPage(1);
                  }}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => {
                    setPriceRange({ ...priceRange, max: e.target.value });
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <div className="filter-group">
              <h3>Évaluation</h3>
              <label>
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === 4}
                  onChange={() => {
                    setSelectedRating(selectedRating === 4 ? null : 4);
                    setCurrentPage(1);
                  }}
                />
                <span className="stars">★★★★☆</span> & up
              </label>
              <label>
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === 3}
                  onChange={() => {
                    setSelectedRating(selectedRating === 3 ? null : 3);
                    setCurrentPage(1);
                  }}
                />
                <span className="stars">★★★☆☆</span> & up
              </label>
            </div>

            <button
              className="btn-reset"
              onClick={() => {
                navigate("/catalog");
                setSelectedCategory("Électronique");
                setPriceRange({ min: "", max: "" });
                setSortOption("pertinence");
                setSearchQuery("");
                setCurrentPage(1);
              }}
            >
              Réinitialiser
            </button>
          </aside>

          <main className="catalog-main">
            {filterParam !== "nouveautes" && (
              <form
                onSubmit={handleSearchSubmit}
                className="catalog-search-bar"
              >
                <FontAwesomeIcon
                  icon={faSearch}
                  className="catalog-search-icon"
                />
                <input
                  type="text"
                  placeholder="Rechercher un produit dans cette catégorie..."
                  className="catalog-search-input"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </form>
            )}
            isLoading ? (
            <div className="catalog-empty">
              <p>
                <FontAwesomeIcon icon={faSpinner} spin /> Chargement des
                produit...
              </p>
            </div>
            ): error ? (
            <div className="catalog-empty">
              <p style={{ color: "#dc2626" }}>{error}</p>
              <button className="btn-reset" onClick={reload}>
                Réessayer
              </button>
            </div>
            ): currentProducts.length === 0 ? (
              <div className="catalog-empty">
                <p>Aucun produit ne correspond à vos critères de recherche.</p>
              </div>
            ) : (
              <div className="catalog-grid">
                {currentProducts.map((product) => (
                  <div key={product.id} className="catalog-product-card">
                    <Link
                      to={`/produit/${product.id}`}
                      className="product-image-container"
                    >
                      {product.badge && (
                        <span
                          className={`product-badge ${getBadgeClass(
                            product.badge,
                          )}`}
                        >
                          {product.badge}
                        </span>
                      )}
                      <img
                        src={product.image}
                        alt={`Photo du produit ${product.name}`}
                      />
                    </Link>

                    <div className="product-card-body">
                      <div className="product-rating">
                        {[...Array(5)].map((_, i) => (
                          <FontAwesomeIcon
                            key={i}
                            icon={faStar}
                            className={
                              i < product.rating
                                ? "star-active"
                                : "star-inactive"
                            }
                          />
                        ))}
                        <span className="reviews-count">
                          ({product.reviews || 0})
                        </span>
                      </div>

                      <h3 className="product-title">
                        <Link
                          to={`/produit/${product.id}`}
                          className="product-title-link"
                        >
                          {product.name}
                        </Link>
                      </h3>


                      <p className="product-desc">{product.description}</p>

                      <div className="product-footer-card">
                        <div className="price-box">
                          {product.oldPrice && (
                            <span className="old-price">
                              {product.oldPrice.toLocaleString()} FCFA
                            </span>
                          )}
                          <span
                            className={
                              product.oldPrice
                                ? "current-price price-discount"
                                : "current-price price-normal"
                            }
                          >
                            {product.price.toLocaleString()} FCFA
                          </span>
                        </div>
                        <button
                          className="btn-add-cart-catalog"
                          aria-label="Ajouter au panier"
                          onClick={() => handleAddToCart(product)}
                        >
                          <FontAwesomeIcon icon={faCartPlus} />
                          Ajouter au panier
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  disabled={safeCurrentPage === 1}
                  onClick={() => handlePageChange(safeCurrentPage - 1)}
                >
                  &lt;
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      className={`page-btn ${
                        safeCurrentPage === pageNumber ? "active" : ""
                      }`}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  className="page-btn"
                  disabled={safeCurrentPage === totalPages}
                  onClick={() => handlePageChange(safeCurrentPage + 1)}
                >
                  &gt;
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
