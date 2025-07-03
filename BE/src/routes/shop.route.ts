import { getAllFromShop } from '../controllers/shop.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getAllFromShop);


export default router;