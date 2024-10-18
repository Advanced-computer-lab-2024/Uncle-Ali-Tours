import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
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
    location: {
        type: {
            type: String,  // This should be 'Point' to work with GeoJSON data
            enum: ['Point'],  // Only 'Point' is allowed for GeoJSON
            required: false
        },
        coordinates: {
            type: [Number],  // An array to store [longitude, latitude] as per GeoJSON
            required: false
        }
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: false
    },
    specialDiscounts: {
        type: String,
        required: false
    },
    bookingOpen: {
        type: Boolean,
        required: true
    },
    creator: {
        type: String,
        required: true
    }
});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
