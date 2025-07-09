import { authenticateToken } from '../middleware/auth.middleware';
import { Router } from 'express';
import * as productController from '../controllers/product.controller';

const router = Router();

router.get('/brands', productController.getBrands);                // Đặt trước
router.post('/brands', authenticateToken, productController.createBrand); // Đặt trước

router.get('/', productController.getProducts);
router.post('/', authenticateToken, productController.createProduct);

router.get('/:product_id', productController.getProductById);
router.put('/:product_id', authenticateToken, productController.updateProduct);
router.delete('/:product_id', authenticateToken, productController.deleteProduct);
router.post("/:product_id/rating", authenticateToken, productController.rateProduct);
router.get("/:product_id/rating", productController.getProductRatings);
router.delete("/:product_id/rating", authenticateToken, productController.deleteProductRating);

export default router;
