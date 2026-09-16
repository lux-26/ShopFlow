const badgeClassMap = {
  stock: "badge-stock",
  "Stock limité": "badge-stock",
  Nouveau: "badge-new",
  Promo: "badge-promo",
  Tendance: "badge-tendance",
  Populaire: "badge-populaire",
};

export function getBadgeClass(badge) {
  if (!badge) return "badge-default";

  return badge.includes("%")
    ? "badge-discount"
    : badgeClassMap[badge] || "badge-default";
}