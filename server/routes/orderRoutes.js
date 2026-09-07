import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getOrder,
  listAllOrders,
  listMyOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/mine", requireAuth, listMyOrders);
router.post("/", requireAuth, createOrder);
router.get("/", requireAuth, requireRole("ADMIN"), listAllOrders);
router.get("/:id", requireAuth, getOrder);
router.patch("/:id/status", requireAuth, requireRole("ADMIN"), updateOrderStatus);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteOrder);

export default router;
