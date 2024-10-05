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
    },mobileNumber:{
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
        default: 0
    },occupation:{
        required:true,
        type: String
    },},{
        timestamps: true
    });

const Tourist = mongoose.model("Tourist",touristModel);
export default Tourist;