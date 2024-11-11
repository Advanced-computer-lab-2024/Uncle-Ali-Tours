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
            type: String, 
            enum: ['Point'], 
            required: false
        },
        coordinates: {
            type: [Number], 
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
