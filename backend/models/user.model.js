import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,},

    email: {
        type: String,
        required: true,
        unique: true,
    },
    chosenCurrency: {
        type: String,
        default: "EGP",
    },
    currencyRate: {
        type: Number,
        default: 1.0,
    }
    },
    {
    timestamps: true,
    });

    const User = mongoose.model('User', userSchema);

    export default User;