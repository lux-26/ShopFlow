import mongoose from "mongoose";

const loyaltyEntrySchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    points: { type: Number, required: true },
    type: { type: String, enum: ["positive", "negative"], required: true },
  },
  { timestamps: true },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["CUSTOMER", "ADMIN"],
      default: "CUSTOMER",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastSeenAt: {
      type: Date,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    loyaltyPoints: {
      type: Number,
      min: 0,
      default: 0,
    },
    loyaltyHistory: {
      type: [loyaltyEntrySchema],
      default: [],
    },
    // Réinitialisation de mot de passe : on ne stocke JAMAIS le token en clair,
    // seulement son empreinte (sha256), avec une expiration courte.
    resetPasswordTokenHash: {
      type: String,
      default: null,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
      select: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
