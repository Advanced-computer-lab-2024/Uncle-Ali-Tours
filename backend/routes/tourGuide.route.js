import express from 'express';
import { upload, uploadProfilePicture,createTourGuide, getTourGuide,getTourGuideReport, updateTourGuide, deleteTourGuide, checkTourGuideBookings, createTourGuideReview } from '../controllers/tourGuide.controller.js';

const router = express.Router();
router.post('/', createTourGuide); // Create a new tour guide
router.get('/', getTourGuide); // Get tour guide details
router.put('/', updateTourGuide); // Update tour guide details
router.delete('/', deleteTourGuide); // Delete a tour guide
router.get('/report/:userName', getTourGuideReport);
// Route to check bookings for a specific tour guide
router.get('/checkBookings/:userName', checkTourGuideBookings);
router.post('/:id/reviews', createTourGuideReview);

// Route for uploading profile picture
router.put('/uploadPicture', upload.single('profilePicture'), uploadProfilePicture);

export default router;
