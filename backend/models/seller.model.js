import mongoose from "mongoose";

const sellerModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: ""
    },
    description: {
        type: String,
        required: true,
        default: ""
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
