import { Router } from "express";
import { validatePromo } from "../controllers/promoController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.post("/validate", requireAuth, validatePromo);
export default router;
