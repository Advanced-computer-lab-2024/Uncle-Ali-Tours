import mongoose from "mongoose";
const addressSchema = new mongoose.Schema({
    creator: {
        type: String,
        required: true,
    },
    addressLine: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    isDefault: {
        type: Boolean,
        required:false,
        default:false,
    },
    },
    );

const Address = mongoose.model('Address', addressSchema);

export default Address;