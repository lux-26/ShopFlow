const statusTypeMap = {
  "En attente": "warning",
  Payé: "success",
  "En cours": "info",
  Livré: "success",
  Annulé: "danger",
};

export function getOrderStatusBadge(status) {
  return { type: statusTypeMap[status] || "default" };
}

export function getPaymentLabel(paymentMethod) {
  const labels = {
    card: "Carte bancaire",
    orange: "Orange Money",
    wave: "Wave",
    cash: "Paiement à la livraison",
  };

  return labels[paymentMethod] || paymentMethod || "Non renseigné";
}

export function formatOrderDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
