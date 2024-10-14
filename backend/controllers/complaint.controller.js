import Complaint from "../models/complaint.model.js";


export const createComplaint = async (req, res) => {
    const complaintData = req.body;
    if (!complaintData.title || !complaintData.body || !complaintData.creator) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const newComplaint = new Complaint(complaintData);
    try {
        await newComplaint.save();
        return res.status(201).json({ success: true, data: newComplaint });
    } catch (error) {
        res.status(409).json({ success: false, message: error.message });
    }
};