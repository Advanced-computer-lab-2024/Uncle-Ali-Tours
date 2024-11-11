// controllers/bookingController.js
import Booking from '../models/Booking.js';

exports.bookItinerary = async (req, res) => {
  try {
    
    const { itineraryId,userName } = req.body;

    if (!itineraryId) {
      return res.status(400).json({ message: 'Itinerary ID is required.' });
    }

    // Create and save the new booking
    const newBooking = new Booking({ userName, itineraryId });
    await newBooking.save();

    res.status(201).json({ message: 'Itinerary booked successfully!', booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to book itinerary', error: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ userId }).populate('itineraryId'); // Populates itinerary details if needed
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve bookings', error: error.message });
  }
};
