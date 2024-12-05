import Notification from "../models/notification.model.js";
import TourGuide from "../models/tourGuide.model.js";
import Tourist from "../models/tourist.model.js";
import Advertiser from "../models/advertiser.model.js";
import moment from 'moment';  // Ensure moment is installed
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


// Function to check if a tourist has any upcoming itineraries in 2 days
export const checkAndNotifyUpcomingItinerary = async (userName) => {
    try {
        // Find the tourist by userName
        const tourist = await Tourist.findOne({ userName });

        if (!tourist) {
            return { success: false, message: "Tourist not found" };
        }

        // Loop over their itinerary items
        for (const itineraryItem of tourist.itinerary) {
            // Assume each itineraryItem has a 'date' field that is the date of the activity
            const activityDate = moment(itineraryItem.date);
            const currentDate = moment();
            const daysRemaining = activityDate.diff(currentDate, 'days');

            // If the activity is happening in exactly 2 days
            if (daysRemaining === 2) {
                // Check if notification already exists for this itinerary
                const existingNotification = await Notification.findOne({
                    userName: tourist.userName,
                    link: `/tourist/${tourist.userName}/itinerary/${itineraryItem._id}`
                });

                if (existingNotification) {
                    return { success: false, message: "Notification already sent for this itinerary" };
                }

                // Create a new notification
                const notification = new Notification({
                    userName: tourist.userName,
                    title: "Upcoming Activity",
                    message: `Your activity "${itineraryItem.name}" is happening in 2 days!`,
                    link: `/tourist/${tourist.userName}/itinerary/${itineraryItem._id}`,
                });

                // Save the notification
                await notification.save();

                // Optionally, you can add the notification to the tourist's notifications array
                tourist.notifications.push(notification._id);
                await tourist.save();
            }
        }

        return { success: true, message: "Notification sent if any itinerary is in 2 days" };
    } catch (error) {
        console.error("Error checking upcoming itinerary:", error);
        return { success: false, message: "Server error while checking itinerary" };
    }
};
