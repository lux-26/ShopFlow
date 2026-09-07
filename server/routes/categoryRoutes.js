import { Router } from "express";
import {
  listCategories,
  updateCategory,
} from "../controllers/categoryController.js";
import { uploadCategoryImage } from "../config/uploads.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.get("/", listCategories);
router.put(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  uploadCategoryImage.single("image"),
  updateCategory,
);
export default router;
