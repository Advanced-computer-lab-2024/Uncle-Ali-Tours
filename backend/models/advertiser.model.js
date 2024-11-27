import mongoose from "mongoose";

const advertiserModel = new mongoose.Schema({

    userName: {
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
        unique: true,
        type: String
    },
    companyName: {
        required: false,
        type: String,
    },
    activities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
    itineraries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary' }],
}, {
    timestamps: true 
});

const Advertiser = mongoose.model("Advertiser", advertiserModel);
export default Advertiser;
