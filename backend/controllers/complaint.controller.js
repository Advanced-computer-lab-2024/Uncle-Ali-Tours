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

export const getComplaint = async (req, res) => {
    const { id } = req.params; 

    try {
        
        const complaint = await Complaint.findById(id);

        if (!complaint) {
            return res.status(404).json({ success: false, message: 'Complaint not found' });
        }

        return res.status(200).json({ success: true, data: complaint });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
export const getTouristComplaints = async (req, res) => {
    const { creator } = req.params;

    try {
        const complaints = await Complaint.find({ creator });
        if (complaints.length === 0) {
            return res.status(404).json({ success: false, message: 'No complaints found' });
        }

        return res.status(200).json({ success: true, data: complaints });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};