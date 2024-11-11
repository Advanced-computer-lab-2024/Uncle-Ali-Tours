// routes/bookings.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middlewares/auth'); // Import the auth middleware

// Route to book an itinerary (POST)
router.post('/', auth, bookingController.bookItinerary);

// Route to get all bookings for a specific user (GET)
router.get('/', auth, bookingController.getUserBookings);

module.exports = router;
