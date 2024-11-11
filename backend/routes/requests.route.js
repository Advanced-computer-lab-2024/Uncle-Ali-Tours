import express from 'express';
import { addRequest , updateRequestStatus,getRequests,getDeleteRequests,getVerifyRequests } from '../controllers/requests.controller.js';

const router = express.Router();

router.post('/', addRequest); // Route to create a complaint
router.get('/', getRequests); // Route to get all complaints
router.get('/delete', getDeleteRequests);
router.get('/verify', getVerifyRequests);
router.patch('/:id/status', updateRequestStatus);
export default router;
