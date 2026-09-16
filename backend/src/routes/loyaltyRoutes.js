import { Router } from "express";
import { getLoyalty, redeemReward } from "../controllers/loyaltyController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", getLoyalty);
router.post("/redeem", redeemReward);

export default router;
