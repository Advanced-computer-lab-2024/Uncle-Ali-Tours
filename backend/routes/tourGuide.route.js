import express from 'express';
import { 
  upload, 
 
  createTourGuide, 
  getTourGuide, 
  updateTourGuide, 
  deleteTourGuide, 
  checkTourGuideBookings 
} from '../controllers/tourGuide.controller.js';

const router = express.Router();

// Define routes
router.get("/", getTourGuide); // Get tour guide details
router.post("/", createTourGuide); // Create tour guide account
 // Upload a file
router.put("/", updateTourGuide); // Update tour guide details
router.delete("/", deleteTourGuide); // Delete tour guide account
router.get('/checkBookings/:userName', checkTourGuideBookings); // Check bookings by username

export default router;
