import express from 'express';
import { createComplaint, getComplaint,getTouristComplaints, getAllComplaints,updateComplaintStatus } from '../controllers/complaint.controller.js';

const router = express.Router();

router.post('/', createComplaint); // Route to create a complaint
router.get('/', getAllComplaints); // Route to get all complaints
router.get('/:id', getComplaint);  // Route to get a complaint by ID
router.get("/by-creator/:creator",getTouristComplaints);
router.patch('/:id', updateComplaintStatus); // Route to update complaint status


export default router;
