import express from 'express';
import { upload, uploadProfilePicture,createTourGuide, getTourGuide, updateTourGuide, deleteTourGuide, checkTourGuideBookings, createTourGuideReview } from '../controllers/tourGuide.controller.js';

const router = express.Router();

// Define routes for tour guide-related endpoints
router.post('/', createTourGuide); // Create a new tour guide
router.get('/', getTourGuide); // Get tour guide details
router.put('/', updateTourGuide); // Update tour guide details
router.delete('/', deleteTourGuide); // Delete a tour guide

// Route to check bookings for a specific tour guide
router.get('/checkBookings/:userName', checkTourGuideBookings);
router.post('/:id/reviews', createTourGuideReview);

// Route for uploading profile picture
router.put('/uploadPicture', upload.single('profilePicture'), uploadProfilePicture);

export default router;
