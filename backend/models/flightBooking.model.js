import mongoose from "mongoose";

const flightBookingSchema = new mongoose.Schema({
    data: [],
    creator: {
        type: String,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    }
});

const FlightBooking = mongoose.model("FlightBooking", flightBookingSchema);

export default FlightBooking;