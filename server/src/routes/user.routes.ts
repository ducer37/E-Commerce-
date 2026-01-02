import { Router } from "express";
import userController from "../controllers/user.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";

const router = Router();

// GET /api/users/profile
router.get("/profile", authenticateToken, userController.getProfile);
router.put("/profile", authenticateToken, userController.updateProfile);

export default router;
