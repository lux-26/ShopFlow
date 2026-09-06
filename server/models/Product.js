import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 60,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    oldprice: {
      type: Number,
      min: 0,
      default: null,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    // Pas d'enum strict volontairement : le badge peut être un libellé fixe
    // ("Nouveau", "Tendance"...) ou une réduction dynamique ("-15%", "-30%"...).
    // La cohérence des couleurs est assurée côté front par src/utils/badgeUtils.js.
    badge: {
      type: String,
      trim: true,
      maxlength: 20,
      default: null,
    },
    // Chemin relatif servi statiquement par Express (ex: /uploads/products/xxx.jpg).
    // null tant qu'aucune image n'a été uploadée.
    image: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
