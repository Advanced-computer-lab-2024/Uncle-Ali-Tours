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
    numberOfBookings: {
        type:Number,
        required:false,
        deafult:0,
    },
    isActivated: {
        type: Boolean,
        required:false,
        default:true,
    },
    creator: {
        type: String,
        required: true
    },
    isBookmarked: { type: Boolean, 
        default: false 
    }, // Add this flag

    isAppropriate: { // Add this field
        type: Boolean,
        required: false,
        default: true, // Set default as true
    },
    reviews: [reviewSchema],
     rating: {
       type: Number,
       required: true,
       default: 0,
     },
     numReviews: {
       type: Number,
       required: true,
       default: 0,
     },
     tourists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tourist' , default: []}],
});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
