import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },},
    {
    timestamp: true,
    });

    const User = mongoose.model('User', userSchema);

    export default User;