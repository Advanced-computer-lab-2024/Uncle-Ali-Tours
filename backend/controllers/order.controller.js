import Order from "../models/order.model.js";
import Tourist from "../models/tourist.model.js";

export const createOrder = async (req, res) => {
    const orderData = req.body;
    if (!orderData.creator) {
        return res.status(400).json({ success: false, message: 'Username is required' });
    }
    if (!orderData.products) {
        return res.status(400).json({ success: false, message: 'Products are required' });
    }
    if (!orderData.deliveryAddress) {
        return res.status(400).json({ success: false, message: 'Delivery address is required' });
    }
    if (!orderData.paymentMethod) {
        return res.status(400).json({ success: false, message: 'Payment method is required' });
    }
    const newOrder = new Order(orderData);

    try {
        await newOrder.save();
        return res.status(201).json({ success: true, data: newOrder });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        return res.status(200).json({ success: true, data: order });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        return res.status(200).json({ success: true, data: orders });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getOrdersByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const orders = await Order.find({ creator: username });

        if (orders.length === 0) {
            return res.status(404).json({ success: false, message: 'No orders found' });
        }

        return res.status(200).json({ success: true, data: orders });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getCurrentOrders = async (req, res) => {
    const { username } = req.params;

    try {
        const orders = await Order.find({ creator: username , status: "shipping" }).populate(
            {
                path: "products",
                populate: {
                    path: "productId",
                    model: "Product"
                }
            }

        );
        if (orders.length === 0) {
            return res.status(404).json({ success: false, message: 'No orders found' });
        }

        return res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.log(error.message)

        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getPastOrders = async (req, res) => {
    const { username } = req.params;

    try {
        const orders = await Order.find({ creator: username , status: "shipped" }).populate(
            {
                path: "products",
                populate: {
                    path: "productId",
                    model: "Product"
                }
            }

        );

        if (orders.length === 0) {
            return res.status(404).json({ success: false, message: 'No orders found' });
        }

        return res.status(200).json({ success: true, data: orders });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id).populate({
            path: "products",
            populate: {
                path: "productId",
                model: "Product",
            },
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error("Error fetching order:", error.message);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

export const cancelOrder = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the order by ID
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        // Check if the order is already cancelled
        if (order.status === 'cancelled') {
            return res.status(400).json({ success: false, message: 'Order is already cancelled.' });
        }

        // Update the order status to 'cancelled'
        order.status = 'cancelled';
        await order.save();

        // Find the tourist (creator) by their username and refund the total to their wallet
        const tourist = await Tourist.findOne({ userName: order.creator });
        if (!tourist) {
            return res.status(404).json({ success: false, message: 'Tourist not found.' });
        }

        // Add the order total to the tourist's wallet
        tourist.myWallet += order.total || 0;
        await tourist.save();

        return res.status(200).json({ success: true, message: 'Order cancelled and refund issued to your wallet.', data: order });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};