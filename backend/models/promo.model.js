import mongoose from "mongoose";

const promoSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discount: {
        type: Number,
        required: true
    }
},
{
    timestamps: true
});

const Promo = mongoose.model("Promo", promoSchema);

export default Promo;