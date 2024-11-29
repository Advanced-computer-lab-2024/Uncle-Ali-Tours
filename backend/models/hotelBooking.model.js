import mongoose from "mongoose";

const hotelBookingSchema = new mongoose.Schema({
    data: [],
    name: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    }
});

const HotelBooking = mongoose.model("HotelBooking", hotelBookingSchema);

export default HotelBooking;