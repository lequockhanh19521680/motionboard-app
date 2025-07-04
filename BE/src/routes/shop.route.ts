import * as shopController from '../controllers/shop.controller';
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, shopController.getAllShops);
router.post('/', authenticateToken, shopController.createShop);
router.get('/:shop_id', authenticateToken, shopController.getShopById);
router.put('/:shop_id', authenticateToken, shopController.updateShop);
router.delete('/:shop_id', authenticateToken, shopController.deleteShop);

// Shop order list
router.get('/:shop_id/orders', shopController.getOrdersOfShop);

// Shop revenue (optionally filter by date range)
router.get('/:shop_id/revenue', shopController.getRevenueOfShop);

export default router;