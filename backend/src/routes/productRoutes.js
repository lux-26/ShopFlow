import { Router } from "express";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { uploadProductImage } from "../config/uploads.js";

const router = Router();

// Lecture : ouverte à tous (catalogue public + back-office).
router.get("/", listProducts);
router.get("/:id", getProduct);

// Écriture : réservée aux administrateurs.
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  uploadProductImage.single("image"),
  createProduct,
);
router.put(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  uploadProductImage.single("image"),
  updateProduct,
);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteProduct);

export default router;
