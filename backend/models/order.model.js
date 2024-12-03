import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    creator: {
        type: String,
        required: true,
    },
    products:{
        type: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, required: true, default: 1 }
        }],
        required:true,
    },
    status: {
        type: String,
        default : "shipping",
    },
    deliveryAddress: {
        type: String,
        required:true,
    },
    paymentMethod: {
        type: String,
        required:true,
    },
    total: {
        type: Number,
        required:false,
    },
    },
    {
        timestamps: true
    });

const Order = mongoose.model('Order', orderSchema);

export default Order;