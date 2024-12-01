import Order from "../models/order.model";
export const addOrder = async (req, res) => {
    const {creator,products} = req.body;
    if (!requestData.creator) {
        return res.status(400).json({ success: false, message: 'Username is required' });
    }
    if (!requestData.products) {
        return res.status(400).json({ success: false, message: 'Products are required' });
    }

    const newOrder = new Order(requestData);

    try {
        await newRequest.save();
        return res.status(201).json({ success: true, data: newRequest });
    } catch (error) {
        return res.status(409).json({ success: false, message: error.message });
    }
};
