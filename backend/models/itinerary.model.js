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
    type: {
      type: String, // This should be 'Point' to work with GeoJSON data
      enum: ["Point"], // Only 'Point' is allowed for GeoJSON
      required: true,
    },
    coordinates: {
      type: [Number], // An array to store [longitude, latitude] as per GeoJSON
      required: true,
    },
  },
  dropoffLocation: {
    type: {
      type: String, // This should be 'Point' to work with GeoJSON data
      enum: ["Point"], // Only 'Point' is allowed for GeoJSON
      required: true,
    },
    coordinates: {
      type: [Number], // An array to store [longitude, latitude] as per GeoJSON
      required: true,
    },
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
