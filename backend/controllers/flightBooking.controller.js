import FlightBooking from "../models/flightBooking.model.js";

export const createFlightBooking = async (req, res) =>{
    const flightBooking = req.body;
    const newFlightBooking = new FlightBooking(flightBooking);
    try {
        await newFlightBooking.save();
        res.status(201).json(newFlightBooking);
    } catch (error) {
        console.error("Error in creating Flight Booking", error.message);
        res.status(409).json({ message: error.message });
    }
}
export const getFlightBookingByCreator = async (req, res) => {
    try {
        const { creator } = req.query;
        const flightBookings = await FlightBooking.find({ creator: creator });
        res.status(200).json(flightBookings);
    } catch (error) {
        console.error("Error in getting Flight Bookings by creator", error.message);
        res.status(500).json({ message: error.message });
    }
}

