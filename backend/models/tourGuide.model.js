import mongoose, { Schema } from "mongoose";

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
        required:true,
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
    }},{
        timestamps: true
    }
)

const TourGuide = mongoose.model("TourGuide",tourGuideModel);
export default TourGuide;