import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    name: { type: String, required: true }, 
},
{
    timestamps: true,
}
)


const itinerarySchema = new mongoose.Schema({
  activities: [],
  name: {
    type: String,
    required: false
  },
  preferenceTag: {
    type: String,
    required: false
  },
  pickupLocation: {
    type: String,
    required: false
  },
  dropoffLocation: {
    type: String,
    required: false
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
    required: false
  },
  isPayed: {
    type: Boolean,
    default: true,
  },
  numberOfBookings: {
    type: Number,
    default: 0,
  },
  isActivated: {
    type: Boolean,
    default: true,
  },
  isAppropriate: {
    type: Boolean,
    default: true,
    required: false,
  },bookingOpen: {
    type: Boolean,
    default: false,
    required: true
},
  isBooked: {
    type: Boolean,
    default: false,
  },
  reviews: [reviewSchema],
     rating: {
       type: Number,
       required: false,
       default: 0,
     },
     numReviews: {
       type: Number,
       required: false,
       default: 0,
     },
     tourists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tourist' }],
     interstedIn:{
      type:[String]
  }
});

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

export default Itinerary;