import { useCallback, useEffect, useState } from "react";
import apiClient from "../utils/apiClient";

/**
 * Charge la liste complète des produits depuis l'API.
 * Le filtrage/tri/pagination restent gérés côté page (Catalog, Home, etc.)
 * pour ne pas perdre les logiques d'affichage déjà en place.
 */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get("/products");
      setProducts(data.products);
    } catch (err) {
      setError(err.message || "Impossible de charger les produits.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    reload();
  }, [reload]);

  return { products, isLoading, error, reload };
}

/**
 * Charge un produit unique par id. Passe silencieusement si id est vide
 * (par exemple pendant le tout premier rendu avant que useParams ne résolve).
 */
export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    apiClient
      .get(`/products/${id}`)
      .then((data) => {
        if (!cancelled) setProduct(data.product);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Produit introuvable.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { product, isLoading, error };
}
