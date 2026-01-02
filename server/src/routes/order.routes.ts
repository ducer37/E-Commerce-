import { Router } from "express";
import orderController from "../controllers/order.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";

const router = Router();

// GET /api/orders/my-orders
router.get("/my-orders", authenticateToken, orderController.getMyOrders);
router.get("/:id", authenticateToken, orderController.getOrderDetail);
router.post("/", authenticateToken, orderController.createOrder);

export default router;
