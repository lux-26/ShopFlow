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
import "./Catalog.css";

// Ce catalogue de démonstration est aussi consommé par les pages d'accueil,
// recherche et détail ; il est volontairement conservé à côté de son affichage.
// eslint-disable-next-line react-refresh/only-export-components
export const catalogProducts = [
  {
    id: 1,
    category: "Électronique",
    name: "Casque Audio Premium Sans Fil",
    description:
      "Réduction de bruit active, 30h d'autonomie, son haute fidélité...",
    price: 145000,
    rating: 5,
    reviews: 124,
    badge: "Nouveau",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    category: "Électronique",
    name: "Montre Connectée Sport Pro",
    description:
      "Suivi santé avancé, GPS intégré, étanche 50m. Parfaite pour le sport...",
    price: 85500,
    rating: 4,
    reviews: 89,
    badge: null,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    category: "Électronique",
    name: 'Tablette Graphique Ultra Fine 12"',
    description:
      "Écran Retina, processeur octo-core, idéale pour la création numérique...",
    oldPrice: 250000,
    price: 212500,
    rating: 5,
    reviews: 312,
    badge: "-15%",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 4,
    category: "Électronique",
    name: "Enceinte Bluetooth Portable Waterproof",
    description: "Son à 360°, basses profondes, autonomie de 20 heures...",
    price: 45000,
    rating: 4,
    reviews: 78,
    badge: null,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 5,
    category: "Électronique",
    name: "Appareil Photo Hybride 4K",
    description:
      "Capteur APS-C, autofocus ultra-rapide, idéal pour vlogging...",
    oldPrice: 480000,
    price: 420000,
    rating: 5,
    reviews: 45,
    badge: "Promo",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 6,
    category: "Mode & Vêtements",
    name: "Veste en Jean Casual Urbaine",
    description:
      "100% coton, style intemporel, confortable pour toutes les saisons...",
    price: 35000,
    rating: 4,
    reviews: 56,
    badge: "Tendance",
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 7,
    category: "Mode & Vêtements",
    name: "Sneakers Streetwear Blanche",
    description:
      "Design épuré, semelle ergonomique amortissante, grand confort...",
    oldPrice: 55000,
    price: 44000,
    rating: 5,
    reviews: 180,
    badge: "-20%",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 8,
    category: "Accessoires",
    name: "Sac à Dos Minimaliste en Cuir",
    description:
      "Compartiment pour ordinateur portable 15 pouces, résistant à l'eau...",
    price: 65000,
    rating: 4,
    reviews: 92,
    badge: "Nouveau",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 9,
    category: "Accessoires",
    name: "Lunettes de Soleil Rétro Vintage",
    description: "Monture écaille de tortue, protection UV400 intégrale...",
    price: 20000,
    rating: 4,
    reviews: 34,
    badge: null,
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 10,
    category: "Mobilier",
    name: "Lampe de Bureau LED Design",
    description:
      "Intensité lumineuse réglable, ports de charge USB intégrés...",
    price: 22000,
    rating: 4,
    reviews: 42,
    badge: null,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 11,
    category: "Cuisine & Maison",
    name: "Set de Tasses à Café en Céramique",
    description: "Ensemble de 4 tasses modernes résistantes à la chaleur...",
    price: 15000,
    rating: 5,
    reviews: 95,
    badge: "Populaire",
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 12,
    category: "Mobilier",
    name: "Plante Artificielle Monstera en Pot",
    description:
      "Effet réaliste garanti, aucun entretien nécessaire pour votre salon...",
    oldPrice: 40000,
    price: 32000,
    rating: 5,
    reviews: 67,
    badge: "-20%",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 13,
    category: "Cuisine & Maison",
    name: "Diffuseur d'Huiles Essentielles Aromathérapie",
    description: "Effet lumineux LED apaisant, arrêt automatique sécurisé...",
    price: 28000,
    rating: 4,
    reviews: 110,
    badge: "Nouveau",
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 14,
    category: "Accessoires",
    name: "Chargeurs ",
    description:
      "Compartiment pour ordinateur portable 15 pouces, résistant à l'eau...",
    price: 5000,
    rating: 4,
    reviews: 50,
    badge: "Nouveau",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
  },
];

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

  const [sortOption, setSortOption] = useState("pertinence");
  const [selectedCategory, setSelectedCategory] = useState("Électronique");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedRating, setSelectedRating] = useState(null);
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
    const matchesRating =
      selectedRating === null || product.rating >= selectedRating;

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
    return b.reviews * b.rating - a.reviews * a.rating;
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
                setSelectedRating(null);
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

            {currentProducts.length === 0 ? (
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
                          ({product.reviews})
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
            )}

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
