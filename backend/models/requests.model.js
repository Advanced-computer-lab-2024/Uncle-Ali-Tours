import mongoose from "mongoose";
const requestSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: false,
    },
    userType: {
        type: String,
        required : false,
    },
    userID: {
        type: Number,
        required : false,
    },
    status: {
        type: String,
        default: "pending",
        required: false,
    },
    type:{
        type: String,
        required: false,
    }
    },
    {
        timestamps: true
    });

const Request = mongoose.model('Request', requestSchema);

export default Request;