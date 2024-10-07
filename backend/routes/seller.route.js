import express from 'express';
import { createSeller, deleteSeller, getSeller, updateSeller } from "../controllers/seller.controller.js";

const router = express.Router();
router.post('/', createSeller);
router.get('/', getSeller);
router.put('/', updateSeller);
router.delete('/', deleteSeller);

export default router;
