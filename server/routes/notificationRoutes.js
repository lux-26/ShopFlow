import { Router } from "express";
import {
  listNotifications,
  markAllNotificationsRead,
} from "../controllers/notificationController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", listNotifications);
router.post("/read-all", markAllNotificationsRead);

export default router;
