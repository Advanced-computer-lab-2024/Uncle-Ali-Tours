import mongoose from "mongoose";

const sellerModel = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        default: ""
    },

    password: {
        type: String,
        required: true,
    },

    email : {
        required:true,
        type: String
    },

 
    description: {
        type: String,
        required: false,
        default: ""
    },

    verified:{
        type : Boolean,
        default : false,
        required : false
    },
   
    
    mobileNumber: {
        type: Number,
        required: false,
        default: 0
    },
   
}, {
    timestamps: true 
});

const Seller = mongoose.model("Seller", sellerModel);
export default Seller;
