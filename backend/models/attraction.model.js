import mongoose from "mongoose";

const attractionModel = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    unique: true
  },
  description: {
    required: true,
    type: String
  },
  pictures:
    {
      type: String
    },
  location: {
    required: true,
    type: String
  },
  openingHours: {
    required: true,
    type: String
  },
  ticketPrices: {
    required: true,
    type: {
      foreigner: Number,
      native: Number,
      student: Number
    }
  },
  rating: {
    type: Number,
    default: 0
  },
}, {
  timestamps: true
});

const Attraction = mongoose.model("Attraction", attractionModel);
export default Attraction;