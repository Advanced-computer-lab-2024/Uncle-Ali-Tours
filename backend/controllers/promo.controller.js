import Promo from '../models/promo.model.js';

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