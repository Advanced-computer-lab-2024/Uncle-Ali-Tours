import Advertiser from "../models/advertiser.model.js"; 
export const createAdvertiser = async (req, res) => {
    const advertiser = req.body;
    

    if (!advertiser.website || !advertiser.hotline || !advertiser.companyProfile || 
        !advertiser.industry || !advertiser.address || !advertiser.email || 
        !advertiser.companyName) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    
    if (!advertiser.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(400).json({ success: false, message: 'Email format is wrong' });
    }

   
    if (!Number.isInteger(advertiser.hotline) || advertiser.hotline <= 0) {
        return res.status(400).json({ success: false, message: 'Hotline must be a valid positive number' });
    }

    
    const newAdvertiser = new Advertiser(advertiser);
    try {
        await newAdvertiser.save();
        res.status(201).json({ success: true, message: "Account created successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getAdvertiser = async (req, res) => {
    const { filter, sort } = req.query;

   y
    let parsedFilter = filter ? JSON.parse(filter) : {};
    let parsedSort = sort ? JSON.parse(sort) : {};

    try {
        
        const advertisers = await Advertiser.find(parsedFilter).sort(parsedSort);
        res.status(200).json({ success: true, data: advertisers });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }


};

   export const updateAdvertiser = async (req, res) => {
    const { companyName, newAdvertiser } = req.body;

    const keys = Object.keys(newAdvertiser);

  
    for (let i = 0; i < keys.length; i++) {
        if (newAdvertiser[keys[i]].length <= 0) {
            return res.status(400).json({ success: false, message: 'All fields are required to update' });
        }
    }

  
    if (newAdvertiser.email) {
        if (!newAdvertiser.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).json({ success: false, message: 'Email format is wrong' });
        }
    }


    if (newAdvertiser.hotline) {
        if (!Number.isInteger(newAdvertiser.hotline) || newAdvertiser.hotline <= 0) {
            return res.status(400).json({ success: false, message: 'Hotline format is wrong' });
        }
    }

    try {
        const advertiserExists = await Advertiser.exists({ companyName });
        if (!advertiserExists) {
            return res.status(404).json({ success: false, message: "Advertiser not found" });
        }

        const updatedAdvertiser = await Advertiser.findOneAndUpdate({ companyName: companyName }, newAdvertiser, { new: true });
        res.status(200).json({ success: true, data: updatedAdvertiser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteAdvertiser = async (req, res) => {
    const { companyName } = req.body;
    
    if (!companyName) {
        return res.status(400).json({ success: false, message: "Company name is required" });
    }

    try {
        const advertiserExists = await Advertiser.exists({ companyName: companyName });

        if (!advertiserExists) {
            return res.status(404).json({ success: false, message: "Advertiser not found" });
        }

        await Advertiser.findOneAndDelete({ companyName: companyName });
        res.json({ success: true, message: 'Advertiser deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



