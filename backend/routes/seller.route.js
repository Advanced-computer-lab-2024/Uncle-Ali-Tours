import express from 'express';
import { createSeller, getSellerByName, updateSeller, deleteSeller } from '../controllers/SellerController.js';

const router = express.Router();
router.post('/', createSeller);
router.get('/', getSellerByName);
router.put('/', updateSeller);
router.delete('/', deleteSeller);

export default router;
