import { getAllCategory } from '../controllers/category.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getAllCategory);

export default router;