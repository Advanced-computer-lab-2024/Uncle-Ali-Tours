import mongoose, { Schema } from "mongoose";

const advertiserModel = new mongoose.Schema({
    website: {  
        type: String,
        required: true,
        default: ""
    },
    hotline: {
        type: Number,
        required: true,
        default: 0
    },
    companyProfile: { 
        type: String,
        required: true, 
        default: ""
    },
    industry: { 
        type: String,
        required: true, 
        default: ""
    },
    address: { 
        type: String,
        required: true, 
        default: ""
    },
   
    email: {
        required: true,
        type: String,
        unique: true 
    },
    companyName: {
        required: true,
        type: String,
        unique: true,
    },
    
}, {
    timestamps: true 
});

const Advertiser = mongoose.model("Advertiser", advertiserModel);
export default Advertiser;
