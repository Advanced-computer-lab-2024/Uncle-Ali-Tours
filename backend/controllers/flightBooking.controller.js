import FlightBooking from "../models/flightBooking.model.js";

export const createFlightBooking = async (req, res) =>{
    const flightBooking = req.body;
    const newFlightBooking = new FlightBooking(flightBooking);
    try {
        await newFlightBooking.save();
    } catch (error) {
        console.error("Error in creating Flight Booking", error.message);
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
export const deleteFlightBooking = async (req, res) => {
    try {
        const { id } = req.query;
        const flightBooking = await FlightBooking.findByIdAndDelete(id);
        if (!flightBooking) {
            res.status(404).json({ message: `No flight booking with id: ${id}` });
        } else {
            res.status(200).json({ message: "Flight booking deleted successfully" });
        }
    }
    catch (error) {
        console.error("Error in deleting Flight Booking", error.message);
        res.status(500).json({ message: error.message });
    }
}

