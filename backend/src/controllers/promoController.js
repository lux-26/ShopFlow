import PromoCode from "../models/PromoCode.js";

const defaults = [
  { code: "SHOPFLOW20", discountAmount: 12000 },
  { code: "BIENVENUE2026", discountAmount: 12000 },
  { code: "PROMO10", discountAmount: 12000 },
];

export async function validatePromo(request, response) {
  const code = String(request.body?.code || "")
    .trim()
    .toUpperCase();
  if (!code)
    return response.status(400).json({ message: "Code promo requis." });

  let promo = await PromoCode.findOne({ code, isActive: true });
  if (!promo && process.env.NODE_ENV !== "production") {
    await PromoCode.bulkWrite(
      defaults.map((item) => ({
        updateOne: {
          filter: { code: item.code },
          update: { $setOnInsert: item },
          upsert: true,
        },
      })),
    );
    promo = await PromoCode.findOne({ code, isActive: true });
  }

  if (!promo || (promo.expiresAt && promo.expiresAt < new Date())) {
    return response
      .status(400)
      .json({ message: "Code promo invalide ou expiré." });
  }

  return response.json({
    promo: { code: promo.code, discountAmount: promo.discountAmount },
  });
}
