import Promo from '../models/promo.model.js';
import Tourist from '../models/tourist.model.js';
export const create = async (req, res) => {
    try {

        if (!req.body.code || !req.body.discount) {
            return res.status(400).json({seccess: false, message: "Content can not be empty!" });
        }

        const promo = new Promo({
            code: req.body.code,
            discount: req.body.discount
            
        });
        await promo.save(); 

        res.status(201).json({success: true,message: "Promo created successfully"});
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

export const list = async (req, res) => {
    try {
        const data = await Promo.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const applyPromoCode = async (req, res) => {
    const { userName, promoCode } = req.body;

    try {
        // Find the user and their promo codes
        const user = await Tourist.findOne({ userName }).populate('promoCodes');
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if the promo code exists in the user's promo codes
        const promo = user.promoCodes.find((p) => p.code === promoCode);

        if (!promo) {
            return res.status(400).json({ success: false, message: "Invalid promo code" });
        }

        // Send back promo details, e.g., discount
        res.status(200).json({ success: true, data: { discount: promo.discount } });
    } catch (error) {
        console.error("Error applying promo code:", error);
        res.status(500).json({ success: false, message: "Server error applying promo code" });
    }
};

  
  