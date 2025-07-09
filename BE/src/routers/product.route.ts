import { authenticateToken } from '../middleware/auth.middleware';
import { Router } from 'express';
import * as productController from '../controllers/product.controller';

const router = Router();

router.get('/', productController.getProducts);
router.get('/:product_id', productController.getProductById);
router.post('/', authenticateToken, productController.createProduct);
router.put('/:product_id', authenticateToken, productController.updateProduct);
router.delete('/:product_id', authenticateToken, productController.deleteProduct);

export default router;
