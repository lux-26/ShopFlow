import { Router } from "express";
import {
  getCurrentUser,
  login,
  logout,
  register,
  touchPresence,
  uploadAvatar,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { uploadProfileImage } from "../config/uploads.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, getCurrentUser);
router.post("/presence", requireAuth, touchPresence);
router.post(
  "/avatar",
  requireAuth,
  uploadProfileImage.single("avatar"),
  uploadAvatar,
);

export default router;
