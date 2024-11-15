import express from 'express';

const router = express.Router();

import { create, list } from '../controllers/promo.controller.js';

router.post('/', create);
router.get('/', list);

export default router;