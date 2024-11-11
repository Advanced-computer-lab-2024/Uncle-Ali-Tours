import mongoose from "mongoose";

const hotelBookingSchema = new mongoose.Schema({
    data: [],
    creator: {
        type: String,
        required: true
    }
});

const HotelBooking = mongoose.model("HotelBooking", hotelBookingSchema);

export default HotelBooking;