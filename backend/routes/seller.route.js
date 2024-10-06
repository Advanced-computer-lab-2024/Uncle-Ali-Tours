import express from 'express';
import { createSeller, getSellerByName, updateSeller, deleteSeller } from '../controllers/SellerController.js';

const router = express.Router();
router.post('/sellers', createSeller);
router.get('/sellers/:name', getSellerByName);
router.put('/sellers/:name', updateSeller);
router.delete('/sellers/:name', deleteSeller);

export default router;
