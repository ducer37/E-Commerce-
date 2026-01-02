import { Router } from "express";
import cartController from "../controllers/cartController";
import { authenticateToken } from "../middlewares/auth.middlewares";

const router = Router();

router.use(authenticateToken);

router.get("/", cartController.getCart);
router.post("/add", cartController.addToCart);
router.put("/:id", cartController.updateItem);
router.delete("/:id", cartController.removeItem);

export default router;
