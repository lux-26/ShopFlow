import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import apiClient from "../../utils/apiClient";
import { useToast } from "../../context/ToastContext";
import "./AdminCategories.css";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const { showToast } = useToast();

  const loadCategories = async () => {
    try {
      const { categories: data } = await apiClient.get("/categories");
      setCategories(data);
      setDrafts(
        Object.fromEntries(
          data.map((category) => [category.id, category.name]),
        ),
      );
    } catch (error) {
      showToast(
        "Erreur",
        error.message || "Impossible de charger les catégories.",
        "error",
      );
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCategories();
    // Le chargement est volontairement effectué une seule fois à l’ouverture.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveCategory = async (category) => {
    const body = new FormData();
    body.append("name", drafts[category.id]);
    if (files[category.id]) body.append("image", files[category.id]);
    try {
      const { category: updated } = await apiClient.put(
        `/categories/${category.id}`,
        body,
      );
      setCategories((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setFiles((current) => ({ ...current, [category.id]: null }));
      showToast(
        "Catégorie enregistrée",
        "Le nom et l’image ont été mis à jour.",
        "success",
      );
    } catch (error) {
      showToast(
        "Erreur",
        error.message || "Impossible d’enregistrer la catégorie.",
        "error",
      );
    }
  };

  const handleImageChange = (categoryId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFiles((current) => ({ ...current, [categoryId]: file }));
    setPreviews((current) => ({
      ...current,
      [categoryId]: URL.createObjectURL(file),
    }));
  };

  return (
    <div className="admin-content-wrapper page-transition">
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Gestion des catégories</h1>
          <p className="page-subtitle">
            Modifiez les noms et les images affichés sur la boutique.
          </p>
        </div>
      </div>
      <div className="card categories-admin-card">
        <div className="categories-admin-list">
          {categories.map((category) => (
            <div key={category.id} className="category-admin-row">
              <div className="category-admin-preview">
                <img
                  src={previews[category.id] || category.image}
                  alt={category.name}
                />
                <label
                  htmlFor={`category-image-${category.id}`}
                  title="Changer l’image"
                  aria-label={`Changer l’image de ${category.name}`}
                  className="category-admin-camera"
                >
                  <FontAwesomeIcon icon={faCamera} />
                </label>
                <input
                  id={`category-image-${category.id}`}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(event) => handleImageChange(category.id, event)}
                  style={{ display: "none" }}
                />
              </div>
              <div className="category-admin-fields">
                <label htmlFor={`category-${category.id}`}>
                  Nom de la catégorie
                </label>
                <input
                  id={`category-${category.id}`}
                  className="form-control"
                  type="text"
                  value={drafts[category.id] || ""}
                  onChange={(event) =>
                    setDrafts((current) => ({
                      ...current,
                      [category.id]: event.target.value,
                    }))
                  }
                />
                {files[category.id] && (
                  <span className="category-admin-file-name">
                    Nouvelle image : {files[category.id].name}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="btn btn-primary-dark category-admin-save"
                onClick={() => saveCategory(category)}
              >
                Enregistrer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
