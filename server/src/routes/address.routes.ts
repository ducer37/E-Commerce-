import { Router } from "express";
import addressController from "../controllers/address.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";

const router = Router();

router.use(authenticateToken);

router.get("/", addressController.getList);
router.post("/", addressController.create);
router.put("/:id", addressController.update);
router.delete("/:id", addressController.remove);

export default router;
