import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ["Commandes", "Fidélité", "Système"],
      required: true,
    },
    title: { type: String, required: true, maxlength: 120 },
    text: { type: String, required: true, maxlength: 300 },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("Notification", notificationSchema);
