import mongoose, { Schema } from "mongoose";

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

const tourGuideModel = new mongoose.Schema({
    mobileNumber :{
        type : Number,
        required : false
    },
    yearsOfExperience:{
        type : Number,
        required : false,
        default : 0
    },
    previousWork:{
        type : String,
        required : false,
        default : ""
    },
    verified:{
        type : Boolean,
        default : false,
        required : false
    },
    email : {
        required:false,
        type: String
    },
    userName:{
        required:true,
        type: String,
        unique: true,
    },
    nationality:{
        required:false,
        type: String
    },dateOfBirth:{
        required:false,
        type: Date
    },password:{
        required:true,
        type:String
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
    },{
        timestamps: true
    }
)

const TourGuide = mongoose.model("TourGuide",tourGuideModel);
export default TourGuide;