import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMagnifyingGlass,
  faSliders,
  faBell,
  faChevronLeft,
  faChevronRight,
  faPenToSquare,
  faTrashCan,
  faImage,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../../context/ToastContext";
import { getBadgeClass } from "../../utils/badgeUtils";
import "../../styles/admin.css";

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [selectedStock, setSelectedStock] = useState("Tous");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const { showToast } = useToast();

  // Liste complète des catégories disponibles dans le site
  const categoriesList = [
    "Électronique",
    "Accessoires",
    "Informatique",
    "Vêtements",
    "Chaussures",
    "Maison & Décoration",
    "Beauté & Santé",
    "Sports & Loisirs",
  ];

  // Liste complète des badges disponibles dans le site
  const badgesList = [
    { label: "Aucun", value: null },
    { label: "Nouveau", value: "Nouveau" },
    { label: "Promo", value: "Promo" },
    { label: "Tendance", value: "Tendance" },
    { label: "Populaire", value: "Populaire" },
    { label: "-15%", value: "-15%" },
    { label: "-20%", value: "-20%" },
  ];

  // Exemple de données enrichies
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Smartphone Pro Max",
      sku: "SKU: SP-001",
      category: "Électronique",
      price: "650 000",
      stock: 42,
      status: "En Stock",
      badge: "Nouveau",
      statusType: "success",
      image: null,
    },
    {
      id: 2,
      name: "Casque Audio Sans Fil",
      sku: "SKU: CA-042",
      category: "Accessoires",
      price: "85 000",
      stock: 3,
      status: "Stock Faible",
      badge: "Promo",
      statusType: "warning",
      image: null,
    },
    {
      id: 3,
      name: "Clavier Mécanique",
      sku: "SKU: KB-109",
      category: "Informatique",
      price: "45 000",
      stock: 0,
      status: "Rupture",
      badge: "Tendance",
      statusType: "danger",
      image: null,
    },
    {
      id: 4,
      name: 'Écran Gaming 27"',
      sku: "SKU: EC-014",
      category: "Informatique",
      price: "210 000",
      stock: 15,
      status: "En Stock",
      badge: "Populaire",
      statusType: "success",
      image: null,
    },
    {
      id: 5,
      name: "Basket Sport Urban",
      sku: "SKU: BS-022",
      category: "Chaussures",
      price: "35 000",
      stock: 8,
      status: "En Stock",
      badge: "-15%",
      statusType: "success",
      image: null,
    },
    {
      id: 6,
      name: "Veste Casual Homme",
      sku: "SKU: VS-102",
      category: "Vêtements",
      price: "50 000",
      stock: 2,
      status: "Stock Faible",
      badge: "-20%",
      statusType: "warning",
      image: null,
    },
  ]);

  // CORRECTION : Ajout de la propriété badge dans l'état initial du formulaire
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "Électronique",
    price: "",
    stock: 10,
    badge: null,
    image: null,
  });

  // null = mode création ; sinon contient l'id du produit en cours de modification
  const [editingProductId, setEditingProductId] = useState(null);

  const emptyProduct = {
    name: "",
    sku: "",
    category: "Électronique",
    price: "",
    stock: 10,
    badge: null,
    image: null,
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProductId(null);
    setNewProduct(emptyProduct);
  };

  // Ouvre le modal pré-rempli avec les données du produit à modifier
  const handleEditProduct = (item) => {
    setNewProduct({
      name: item.name,
      sku: item.sku,
      category: item.category,
      price: item.price,
      stock: item.stock,
      badge: item.badge,
      image: item.image,
    });
    setEditingProductId(item.id);
    setIsModalOpen(true);
  };

  // Lit le fichier choisi et le transforme en aperçu affichable (data URL)
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setNewProduct((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    const stockNum = Number(newProduct.stock);
    let status = "En Stock";
    let statusType = "success";

    if (stockNum === 0) {
      status = "Rupture";
      statusType = "danger";
    } else if (stockNum <= 5) {
      status = "Stock Faible";
      statusType = "warning";
    }

    if (editingProductId) {
      // MODE ÉDITION : on met à jour le produit existant, sans changer son id
      setProducts(
        products.map((p) =>
          p.id === editingProductId
            ? {
                ...p,
                name: newProduct.name,
                sku: newProduct.sku,
                category: newProduct.category,
                price: newProduct.price,
                stock: stockNum,
                status,
                statusType,
                badge: newProduct.badge,
                image: newProduct.image,
              }
            : p,
        ),
      );
      handleCloseModal();
      showToast(
        "Produit modifié !",
        `Le produit "${newProduct.name}" a été mis à jour avec succès.`,
        "success",
      );
      return;
    }

    // MODE CRÉATION
    const created = {
      id: Date.now(),
      name: newProduct.name,
      sku: newProduct.sku || `SKU: PR-${Math.floor(100 + Math.random() * 900)}`,
      category: newProduct.category,
      price: newProduct.price,
      stock: stockNum,
      status,
      statusType,
      badge: newProduct.badge, // Récupération propre du badge sélectionné
      image: newProduct.image,
    };

    setProducts([created, ...products]);
    setCurrentPage(1);
    handleCloseModal();
    showToast(
      "Produit ajouté !",
      `Le produit "${created.name}" a été créé avec succès.`,
      "success",
    );
  };

  const handleDeleteProduct = (id, name) => {
    setProducts(products.filter((p) => p.id !== id));
    showToast(
      "Produit supprimé",
      `Le produit "${name}" a été supprimé.`,
      "success",
    );
  };

  // Filtrage des produits selon la recherche, la catégorie et le stock
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategory === "Toutes" || p.category === selectedCategory;

    let matchesStock = true;
    if (selectedStock === "in_stock") matchesStock = p.stock > 5;
    if (selectedStock === "low_stock")
      matchesStock = p.stock > 0 && p.stock <= 5;
    if (selectedStock === "out_of_stock") matchesStock = p.stock === 0;

    return matchesSearch && matchesCat && matchesStock;
  });

  // Calculs pour la pagination
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const safeCurrentPage = currentPage > totalPages ? 1 : currentPage;

  const indexOfLastItem = safeCurrentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const displayStart = totalItems === 0 ? 0 : indexOfFirstItem + 1;
  const displayEnd = Math.min(indexOfLastItem, totalItems);

  return (
    <div className="admin-content-wrapper page-transition">
      {/* En-tête */}
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Gestion des Produits</h1>
          <p className="page-subtitle">
            Gérez votre catalogue, les prix et l'état des stocks.
          </p>
        </div>
        <div className="header-right-actions">
          <button className="btn-icon-bell" title="Notifications">
            <FontAwesomeIcon icon={faBell} />
            <span className="bell-badge"></span>
          </button>
          <button
            className="btn btn-primary-dark"
            onClick={() => {
              setNewProduct(emptyProduct);
              setEditingProductId(null);
              setIsModalOpen(true);
            }}
          >
            <FontAwesomeIcon icon={faPlus} /> Nouveau Produit
          </button>
        </div>
      </div>

      {/* Carte Filtres & Recherche */}
      <div className="card filters-container-card">
        <div className="search-box-large">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="filters-row">
          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="Toutes">Toutes les Catégories</option>
            {categoriesList.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={selectedStock}
            onChange={(e) => {
              setSelectedStock(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="Tous">Tous les Stocks</option>
            <option value="in_stock">En Stock</option>
            <option value="low_stock">Stock Faible</option>
            <option value="out_of_stock">Rupture</option>
          </select>

          <button className="btn-filter-action">
            <FontAwesomeIcon icon={faSliders} /> Filtres
          </button>
        </div>
      </div>

      {/* Tableau des produits */}
      <div className="card table-card">
        <div className="table-responsive">
          <table className="shopflow-table">
            <thead>
              <tr>
                <th>PRODUIT</th>
                <th>CATÉGORIE</th>
                <th>PRIX (FCFA)</th>
                <th>STOCK</th>
                <th>STATUT</th>
                <th style={{ textAlign: "right" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length > 0 ? (
                currentProducts.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="product-item-cell">
                        <div className="product-thumb">
                          {item.image ? (
                            <img src={item.image} alt={item.name} />
                          ) : (
                            <FontAwesomeIcon
                              icon={faImage}
                              className="thumb-placeholder"
                            />
                          )}
                        </div>
                        <div className="product-info-text">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              flexWrap: "wrap",
                            }}
                          >
                            <span className="product-name">{item.name}</span>
                            {/* Affichage dynamique du badge avec réinitialisation du positionnement CSS */}
                            {item.badge && (
                              <span
                                className={`pill-badge ${getBadgeClass(item.badge)}`}
                                style={{
                                  position: "static",
                                  display: "inline-flex",
                                  fontSize: "10px",
                                  padding: "2px 8px",
                                }}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <span className="product-sku">{item.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-muted">{item.category}</td>
                    <td className="font-bold">{item.price}</td>
                    <td>
                      <span
                        className={
                          item.stock === 0
                            ? "stock-text-out"
                            : item.stock <= 5
                              ? "stock-text-low"
                              : "stock-text-normal"
                        }
                      >
                        {item.stock} unités
                      </span>
                    </td>
                    <td>
                      <span className={`pill-badge badge-${item.statusType}`}>
                        <span className="badge-dot"></span>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn-icon"
                        title="Modifier"
                        onClick={() => handleEditProduct(item)}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        className="btn-icon text-danger"
                        title="Supprimer"
                        onClick={() => handleDeleteProduct(item.id, item.name)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    Aucun produit trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pied de tableau / Pagination dynamique */}
        <div className="table-footer-pagination">
          <span className="pagination-info">
            Affichage {displayStart}-{displayEnd} sur {totalItems} produits
          </span>

          <div className="pagination-buttons">
            <button
              className="btn-page-nav"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={safeCurrentPage === 1}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  className={`btn-page-num ${safeCurrentPage === pageNumber ? "active" : ""}`}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              className="btn-page-nav"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={safeCurrentPage === totalPages || totalPages === 0}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal d'ajout / modification de produit */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <div className="card-header-flex">
              <h3>
                {editingProductId ? "Modifier le produit" : "Nouveau Produit"}
              </h3>
              <button className="btn-icon" onClick={handleCloseModal}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <form onSubmit={handleCreateProduct}>
              <div className="form-group mb-3">
                <label>Image du produit</label>
                <div
                  onClick={() =>
                    document.getElementById("product-image-input").click()
                  }
                  style={{
                    width: "100%",
                    height: "140px",
                    border: "2px dashed #cbd5e1",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    overflow: "hidden",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  {newProduct.image ? (
                    <img
                      src={newProduct.image}
                      alt="Aperçu du produit"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div style={{ textAlign: "center", color: "#94a3b8" }}>
                      <FontAwesomeIcon
                        icon={faImage}
                        style={{ fontSize: "1.8rem" }}
                      />
                      <p style={{ margin: "6px 0 0", fontSize: "0.8rem" }}>
                        Cliquez pour choisir une image
                      </p>
                    </div>
                  )}
                </div>
                <input
                  id="product-image-input"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </div>

              <div className="form-group mb-3">
                <label>Nom du produit</label>
                <input
                  type="text"
                  className="form-control"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label>SKU</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="ex: SP-001"
                  value={newProduct.sku}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, sku: e.target.value })
                  }
                />
              </div>

              <div className="form-group mb-3">
                <label>Catégorie</label>
                <select
                  className="form-control"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                >
                  {categoriesList.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-3">
                <label>Prix (FCFA)</label>
                <input
                  type="text"
                  className="form-control"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label>Stock de départ</label>
                <input
                  type="number"
                  className="form-control"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, stock: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label>Badge du produit</label>
                <select
                  className="form-control"
                  value={newProduct.badge || ""}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      badge: e.target.value === "" ? null : e.target.value,
                    })
                  }
                >
                  {badgesList.map((b, index) => (
                    <option key={index} value={b.value !== null ? b.value : ""}>
                      {b.label}
                    </option>
                  ))}
                </select>
                {newProduct.badge && (
                  <span
                    className={`pill-badge ${getBadgeClass(newProduct.badge)}`}
                    style={{ marginTop: "8px", display: "inline-flex" }}
                  >
                    Aperçu : {newProduct.badge}
                  </span>
                )}
              </div>

              <div className="modal-actions-right">
                <button
                  type="button"
                  className="btn"
                  onClick={handleCloseModal}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary-dark">
                  {editingProductId
                    ? "Enregistrer les modifications"
                    : "Créer le produit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
