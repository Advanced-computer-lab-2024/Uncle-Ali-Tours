import mongoose, { Schema } from "mongoose";

const advertiserModel = new mongoose.Schema({

    username: {
        type:String,
        required:true,
         default: ""
    },

    password: {
        type: String,
        required: true,
    },

    website: {  
        type: String,
        required: false,
        default: ""
    },
    hotline: {
        type: Number,
        required: false,
        default: 0
    },
    companyProfile: { 
        type: String,
        required: false, 
        default: ""
    },
    industry: { 
        type: String,
        required: false, 
        default: ""
    },
    address: { 
        type: String,
        required: false, 
        default: ""
    },

    verified:{
        type : Boolean,
        default : false,
        required : false
    },
   
    email: {
        required: true,
        type: String,
        unique: true 
    },
    companyName: {
        required: false,
        type: String,
        unique: true,
    },
    
}, {
    timestamps: true 
});

const Advertiser = mongoose.model("Advertiser", advertiserModel);
export default Advertiser;
