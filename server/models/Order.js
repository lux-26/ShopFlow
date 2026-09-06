import mongoose from "mongoose";

// Chaque article est "snapshotté" (nom, image, prix au moment de la commande) :
// si le produit change de prix ou est supprimé plus tard, l'historique de
// commande reste fidèle à ce qui a réellement été payé.
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null, // conservé même si le produit d'origine est supprimé
    },
    name: { type: String, required: true },
    image: { type: String, default: null },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const shippingAddressSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Snapshot du nom/email du client au moment de la commande (évite d'avoir
    // à repeupler `user` juste pour afficher un nom dans le back-office).
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: "Une commande doit contenir au moins un article.",
      },
    },

    shippingAddress: { type: shippingAddressSchema, required: true },
    shippingMode: {
      type: String,
      enum: ["standard", "express"],
      default: "standard",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "orange", "wave", "cash"],
      required: true,
    },

    subtotal: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, required: true, min: 0, default: 0 },
    discount: { type: Number, required: true, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["En attente", "Payé", "En cours", "Livré", "Annulé"],
      default: "En attente",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
