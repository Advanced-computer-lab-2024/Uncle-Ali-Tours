// controllers/bookingController.js
import BookingModel from "../models/Booking.model";
// Book an itinerary
export const bookItineraries = async (req, res) => {
  const itBooking = req.body;
    const newItBooking = new BookingModel(itBooking);
    try {
        await newItBooking.save();
        res.status(201).json(newItBooking);
    } catch (error) {
        console.error("Error in creating itinerary Booking", error.message);
        res.status(409).json({ message: error.message });
    }
};

// Get bookings for a specific user
export const getUserBookings = async (req, res) => {
  try {
    const { creator } = req.query;
    const itBookings = await BookingModel.find({ creator: creator });
    res.status(200).json(itBookings);
} catch (error) {
    console.error("Error in getting itinerary Bookings by creator", error.message);
    res.status(500).json({ message: error.message });
}
};


