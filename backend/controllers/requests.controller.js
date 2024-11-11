import Request from "../models/requests.model.js";
// Add a new request
export const addRequest = async (req, res) => {
    const requestData = req.body;
    if (!requestData.userName || !requestData.type) {
        return res.status(400).json({ success: false, message: 'Username and type are required' });
    }

    const newRequest = new Request(requestData);

    try {
        await newRequest.save();
        return res.status(201).json({ success: true, data: newRequest });
    } catch (error) {
        return res.status(409).json({ success: false, message: error.message });
    }
};

// Update request status
export const updateRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const request = await Request.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        return res.status(200).json({ success: true, data: request });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get all requests
export const getRequests = async (req, res) => {
    try {
        const requests = await Request.find();
        return res.status(200).json({ success: true, data: requests });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// // Get request by ID
// export const getRequestById = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const request = await Request.findById(id);

//         if (!request) {
//             return res.status(404).json({ success: false, message: 'Request not found' });
//         }

//         return res.status(200).json({ success: true, data: request });
//     } catch (error) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

// Get requests by username
export const getRequestsByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const requests = await Request.find({ username });

        if (requests.length === 0) {
            return res.status(404).json({ success: false, message: 'No requests found' });
        }

        return res.status(200).json({ success: true, data: requests });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// Get all delete requests (type == "delete")
export const getDeleteRequests = async (req, res) => {
    try {
        const deleteRequests = await Request.find({ type: "delete" });

        if (deleteRequests.length === 0) {
            return res.status(404).json({ success: false, message: 'No delete requests found' });
        }

        return res.status(200).json({ success: true, data: deleteRequests });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get all verify requests (type == "verify")
export const getVerifyRequests = async (req, res) => {
    try {
        const verifyRequests = await Request.find({ type: "verify" });

        if (verifyRequests.length === 0) {
            return res.status(404).json({ success: false, message: 'No verify requests found' });
        }

        return res.status(200).json({ success: true, data: verifyRequests });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get request status by username
export const getRequestStatusByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const requests = await Request.find({ userName: username }, { status: 1, _id: 0 }); // Only select the `status` field

        if (requests.length === 0) {
            return res.status(404).json({ success: false, message: 'This user does not have any requests' });
        }

        return res.status(200).json({ success: true, data: requests });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
