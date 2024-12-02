import Order from "../models/order.model";
export const addOrder = async (req, res) => {
    const requestData = req.body;
    if (!requestData.creator) {
        return res.status(400).json({ success: false, message: 'Username is required' });
    }
    if (!requestData.products) {
        return res.status(400).json({ success: false, message: 'Products are required' });
    }
    if (!requestData.deliveryAddress) {
        return res.status(400).json({ success: false, message: 'Delivery address is required' });
    }
    if (!requestData.paymentMethod) {
        return res.status(400).json({ success: false, message: 'Payment method is required' });
    }
    const newOrder = new Order(requestData);

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