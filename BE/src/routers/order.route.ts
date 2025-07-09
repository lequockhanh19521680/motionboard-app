import { Router } from "express";
import * as orderController from "../controllers/order.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticateToken, orderController.createOrderFromCart);
router.get("/", authenticateToken, orderController.getOrders);
router.get("/:order_id", authenticateToken, orderController.getOrderDetail);

export default router;
