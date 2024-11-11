import mongoose from "mongoose";

const transportaionActivitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    pickUpLocation: {
        type: String,  // This should be 'Point' to work with GeoJSON data
        required: true
    },
    dropOfLocation: {
        type: String,  // This should be 'Point' to work with GeoJSON data
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    bookingOpen: {
        type: Boolean,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
});

const transportationActivity = mongoose.model("transportationActivity", transportaionActivitySchema);

export default transportationActivity;
