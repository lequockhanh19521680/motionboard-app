import { getProductFromFilter } from './../controllers/product.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getProductFromFilter);


export default router;