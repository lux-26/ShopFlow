// Formate un prix numérique en chaîne lisible avec séparateur de milliers français.
// ex: formatPrice(45000) -> "45 000"
export function formatPrice(price) {
  if (price === null || price === undefined || Number.isNaN(Number(price))) {
    return "—";
  }
  return Number(price).toLocaleString("fr-FR");
}

// Dérive le libellé et le type de statut à partir du stock, plutôt que de
// stocker un statut redondant en base (qui pourrait devenir incohérent avec
// le stock réel après une modification directe en base par exemple).
export function getStockStatus(stock) {
  const stockNum = Number(stock);
  if (stockNum === 0) {
    return { label: "Rupture", type: "danger" };
  }
  if (stockNum <= 5) {
    return { label: "Stock Faible", type: "warning" };
  }
  return { label: "En Stock", type: "success" };
}
