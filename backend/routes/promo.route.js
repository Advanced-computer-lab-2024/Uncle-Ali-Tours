import express from 'express';

const router = express.Router();

import { applyPromoCode, create, list } from '../controllers/promo.controller.js';

router.post('/', create);
router.get('/', list);
router.post('/applyPromo',applyPromoCode);

export default router;