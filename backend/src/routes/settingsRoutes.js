import { Router } from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/settingsController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth, requireRole("ADMIN"));
router.get("/", getSettings);
router.patch("/", updateSettings);

export default router;
