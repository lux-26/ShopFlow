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
import "../../styles/admin.css";

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [selectedStock, setSelectedStock] = useState("Tous");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  // Exemple de données conformes à l'image
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Smartphone Pro Max",
      sku: "SKU: SP-001",
      category: "Électronique",
      price: "650 000",
      stock: 42,
      status: "En Stock",
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
      statusType: "danger",
      image: null,
    },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "Électronique",
    price: "",
    stock: 10,
  });

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

    const created = {
      id: Date.now(),
      name: newProduct.name,
      sku: newProduct.sku || `SKU: PR-${Math.floor(100 + Math.random() * 900)}`,
      category: newProduct.category,
      price: newProduct.price,
      stock: stockNum,
      status,
      statusType,
      image: null,
    };

    setProducts([created, ...products]);
    setIsModalOpen(false);
    setNewProduct({
      name: "",
      sku: "",
      category: "Électronique",
      price: "",
      stock: 10,
    });
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

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategory === "Toutes" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

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
            onClick={() => setIsModalOpen(true)}
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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-row">
          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="Toutes">Toutes les Catégories</option>
            <option value="Électronique">Électronique</option>
            <option value="Accessoires">Accessoires</option>
            <option value="Informatique">Informatique</option>
          </select>

          <select
            className="filter-select"
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
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
              {filteredProducts.map((item) => (
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
                        <span className="product-name">{item.name}</span>
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
                    <button className="btn-icon" title="Modifier">
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pied de tableau / Pagination */}
        <div className="table-footer-pagination">
          <span className="pagination-info">Affichage 1-3 sur 24 produits</span>

          <div className="pagination-buttons">
            <button className="btn-page-nav" disabled>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button className="btn-page-num active">1</button>
            <button className="btn-page-num">2</button>
            <button className="btn-page-num">3</button>
            <button className="btn-page-nav">
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal d'ajout de produit */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <div className="card-header-flex">
              <h3>Nouveau Produit</h3>
              <button
                className="btn-icon"
                onClick={() => setIsModalOpen(false)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <form onSubmit={handleCreateProduct}>
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

              <div className="modal-actions-right">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary-dark">
                  Créer le produit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
