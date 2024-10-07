import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema({
  activities: [],
  name: {
    type: String,
    required: true
  },
  preferenceTag: {
    type: String,
    required: true
  },
  pickupLocation: {
    type: String,
    required: true
  },
  dropoffLocation: {
    type: String,
    required: true
  },
  tourLocations: {
    type: [String],
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  availableDates: {
    type: [Date],
    required: true,
  },
  availableTimes: {
    type: [String],
    required: true,
  },
  accessibility: {
    type: Number,
    default: 1,
    required: true,
  },
  creator: {
    type: String,
    required: true
  }
});

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

export default Itinerary;
