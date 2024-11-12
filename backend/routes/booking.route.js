import express from 'express';
import { bookItineraries, getUserBookings } from '../controllers/bookingController.js';

const router = express.Router();

router.post("/book-it", bookItineraries); // Route to book an itinerary

router.get("/get-bookings", getUserBookings); // Route to get bookings for a specific user

export default router;
