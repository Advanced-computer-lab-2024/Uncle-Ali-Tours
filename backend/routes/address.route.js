import express from 'express';
import { addAddress, getAddressByUsername, setAddressDefault } from '../controllers/address.controller.js';
const router = express.Router();

router.post('/', addAddress); 
router.get('/:username', getAddressByUsername); 
router.patch('/:id', setAddressDefault);

export default router;
