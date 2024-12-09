import Address from "../models/address.model.js";
export const addAddress = async (req, res) => {
    const addresstData = req.body;
    if (!addresstData.userName || !addresstData.address || !addresstData.city || !addresstData.country) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newAddress = new Address(addresstData);

    try {
        await newAddress.save();
        return res.status(201).json({ success: true, data: newAddress });
    } catch (error) {
        return res.status(409).json({ success: false, message: error.message });
    }
};

// Update request status
export const setAddressDefault = async (req, res) => {
    const { id } = req.params;

    try {
        const address = await Address.findByIdAndUpdate(
            id,
            { isDefault : true },
            { new: true }
        );

        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        return res.status(200).json({ success: true, data: address });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAddressByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const addresses = await Address.find({ creator: username });

        if (addresses.length === 0) {
            return res.status(404).json({ success: false, message: 'No addreses found' });
        }

        return res.status(200).json({ success: true, data: addresses });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

