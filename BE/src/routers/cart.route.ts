import { Router } from "express";
import * as cartController from "../controllers/cart.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticateToken, cartController.getCart);
router.post("/", authenticateToken, cartController.addToCart);
router.patch("/", authenticateToken, cartController.updateCartItem);
router.delete("/:variant_id", authenticateToken, cartController.removeFromCart);

export default router;
