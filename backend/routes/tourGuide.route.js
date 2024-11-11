import express from 'express';
import { upload, uploadFile, creatTourGuide, getTourGuide, updateTourGuide, deleteTourGuide, checkTourGuideBookings, createTourGuideReview } from '../controllers/tourGuide.controller.js';

const router = express.Router();

// Route for creating a tour guide account
router.post("/", creatTourGuide);

// Route for uploading a file
router.post('/upload', upload.single('file'), uploadFile);

// Other routes
router.get("/", getTourGuide);
router.put("/", updateTourGuide);
router.delete("/", deleteTourGuide);
router.get('/checkBookings/:userName', checkTourGuideBookings);
router.post('/:id/reviews', createTourGuideReview);

export default router;
