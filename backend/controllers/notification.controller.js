import Notification from "../models/notification.model.js";
import TourGuide from "../models/tourGuide.model.js";
import Tourist from "../models/tourist.model.js";
import Advertiser from "../models/advertiser.model.js";
export const markNotificationAsRead = async (req, res) => {
	try {
		const { userName } = req.body;
		let user = await Tourist.findOne({ userName });
        if(!user)
        user = await TourGuide.findOne({ userName });
        if(!user)
        user = await Advertiser.findOne({ userName });
		if(!user) 
			return res.status(404).json({ success: false, message: "user not found" });
		user.notifications.forEach(async (notification) => {
			const notificationData = await Notification.findByIdAndUpdate(notification, { read: true }, { new: true }); 
			});
		await user.save();
		res.status(200).json({ success: true, message: "Notification marked as read" });
	}
	catch (error) {
		console.error("Error marking notification as read:", error);
		res.status(500).json({ success: false, message: "Server error marking notification as read" });
	}
};