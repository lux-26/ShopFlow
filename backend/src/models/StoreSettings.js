import mongoose from "mongoose";

const storeSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "default" },
    storeName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      default: "ShopFlow",
    },
    storeEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      default: "contact@shopflow.ci",
    },
    currency: { type: String, enum: ["XOF", "EUR", "USD"], default: "XOF" },
    notificationsEnabled: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("StoreSettings", storeSettingsSchema);
