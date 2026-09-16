import { Router } from "express";
import { deleteUser, listUsers } from "../controllers/userController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth, requireRole("ADMIN"));
router.get("/", listUsers);
router.delete("/:id", deleteUser);

export default router;
