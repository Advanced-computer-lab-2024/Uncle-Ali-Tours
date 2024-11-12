import mongoose from "mongoose";

const touristModel = new mongoose.Schema({
    email : {
        required:true,
        type: String
    },userName:{
        required:true,
        type: String,
        unique: true,
    },password:{
        required:true,
        type: String
    },
    mobileNumber:{
        required:true,
        type: Number
    },nationality:{
        required:true,
        type: String
    },dateOfBirth:{
        required:true,
        type: Date
    },myWallet:{
        type: Number,
        default: 100
    },occupation:{
        required:true,
        type: String
    },purchasedProducts:[{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Product'
    }],
    myPoints:{
        type: Number,
        default: 14000
    },myPreferences:{
        required:true,
        type:[String],
        default:[] 
    },badge:{
        type:String,
        default:"Level 1"
    },myBookings:{
        type:[String],
        required:false
    },ActivityBookings:{
        type:[String],
        required:false
    },itineraryBookings:{
        type:[String],
        required:false
    } 
    },{
        timestamps: true
    });

const Tourist = mongoose.model("Tourist",touristModel);
export default Tourist;