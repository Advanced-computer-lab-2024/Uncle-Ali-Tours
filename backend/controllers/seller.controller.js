import Seller from "../models/seller.model.js";

export const createSeller = async (req, res) => {
    const sellerData = req.body;

    if (!sellerData.name || !sellerData.description) {
        return res.status(400).json({ success: false, message: "Name and description are required" });
    }

    const newSeller = new Seller(sellerData);

    try {
        await newSeller.save();
        res.status(201).json({ success: true, message: "Seller account created successfully", data: newSeller });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const getSellerByName = async (req, res) => {
    const { name } = req.params; 

    try {
        const seller = await Seller.findOne({ name: name });

        if (!seller) {
            return res.status(404).json({ success: false, message: "Seller not found" });
        }

        res.status(200).json({ success: true, data: seller });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


export const updateSeller = async (req, res) => {
    const { name } = req.params; 
    const updates = req.body;

    if (updates.name && updates.name.length === 0) {
        return res.status(400).json({ success: false, message: "Name cannot be empty" });
    }

    if (updates.description && updates.description.length === 0) {
        return res.status(400).json({ success: false, message: "Description cannot be empty" });
    }

    try {
        const updatedSeller = await Seller.findOneAndUpdate({ name: name }, updates, { new: true, runValidators: true });

        if (!updatedSeller) {
            return res.status(404).json({ success: false, message: "Seller not found" });
        }

        res.status(200).json({ success: true, data: updatedSeller });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


export const deleteSeller = async (req, res) => {
    const { name } = req.params; 

    try {
        const sellerExists = await Seller.exists({ name: name });

        if (!sellerExists) {
            return res.status(404).json({ success: false, message: "Seller not found" });
        }

        await Seller.findOneAndDelete({ name: name });
        res.json({ success: true, message: "Seller profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
