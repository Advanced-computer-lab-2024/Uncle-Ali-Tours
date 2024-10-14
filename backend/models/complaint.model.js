import mongoose from "mongoose";

const complaintModel = new mongoose.Schema({
    title:{
        required: true,
        type: String
    }
    ,
    body:{
        required: true,
        type: String
    },
    status:{
        required: true,
        type: String,
        default: "Pending"
    },
    creator:
    {
        required: true,
        type: String
    }
}, {
    timestamps: true
});

const Complaint = mongoose.model("Complaint", complaintModel);
export default Complaint;
    