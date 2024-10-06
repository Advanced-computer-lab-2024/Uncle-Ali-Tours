import express from 'express';
import { createSeller, deleteSeller, getSellerByName, updateSeller } from './controllers/seller.controller.js';

const router = express.Router();
router.post('/', createSeller);
router.get('/', getSellerByName);
router.put('/', updateSeller);
router.delete('/', deleteSeller);

export default router;
