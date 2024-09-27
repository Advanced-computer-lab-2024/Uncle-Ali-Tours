import mongoose from "mongoose";

const userSchema = mongoose.Schema({
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
        required: true,}
    },
    {
    timestamp: true,
    });

    const User = mongoose.model('User', userSchema);

    export default User;