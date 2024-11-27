import Activity from "../models/activity.model.js";
import Bookmark from "../models/bookmark.model.js";

export const addBookmark = async (req, res) => {
    const { userName, activityId } = req.body;

    if (!userName || !activityId) {
        return res.status(400).json({ message: "User name and Activity ID are required" });
    }

    try {
        const existingBookmark = await Bookmark.findOne({ userName, activityId });
        if (existingBookmark) {
            return res.status(400).json({ message: "Activity already bookmarked" });
        }

        const bookmark = new Bookmark({ userName, activityId });
        await bookmark.save();
        res.status(201).json({ message: "Activity bookmarked successfully", bookmark });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBookmarkedActivities = async (req, res) => {
    try {
        const bookmarkedActivities = await Activity.find({ isBookmarked: true });
        res.status(200).json({ success: true, data: bookmarkedActivities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const toggleBookmark = async (req, res) => {
    const { activityId } = req.body;

    if (!activityId) {
        return res.status(400).json({ success: false, message: "Activity ID is required" });
    }

    try {
        // Find the activity
        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(404).json({ success: false, message: "Activity not found" });
        }

        // Toggle the isBookmarked flag
        activity.isBookmarked = !activity.isBookmarked;
        await activity.save();

        res.status(200).json({
            success: true,
            message: activity.isBookmarked ? "Activity bookmarked" : "Bookmark removed",
            activity,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const removeBookmark = async (req, res) => {
    const { userName, activityId } = req.body;

    if (!userName || !activityId) {
        return res.status(400).json({ message: "User name and Activity ID are required" });
    }

    try {
        const deletedBookmark = await Bookmark.findOneAndDelete({ userName, activityId });
        if (!deletedBookmark) {
            return res.status(404).json({ message: "Bookmark not found" });
        }

        res.status(200).json({ message: "Bookmark removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// Create Activity
// Create Activity
export const createActivity = async (req, res) => {
    const activity = req.body;
    console.log(activity)
    const newActivity = new Activity({
        ...activity,
        isAppropriate: activity.isAppropriate !== undefined ? activity.isAppropriate : true // Default to true
    });

    if (!activity.name || !activity.date || !activity.time || !activity.location || !activity.price || !activity.category || activity.bookingOpen === undefined || !activity.creator) {
        return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    const activityExists = await Activity.exists({
        name: activity.name,
        date: activity.date,
        time: activity.time,
        location: activity.location,
        price: activity.price,
        category: activity.category,
        tags: activity.tags || undefined,
        specialDiscounts: activity.specialDiscounts || undefined,
        bookingOpen: activity.bookingOpen,
        creator: activity.creator
    });

    if (activityExists) {
        return res.status(409).json({ success: false, message: "Activity already exists" });
    }

    try {
        await newActivity.save();
        return res.status(201).json({ success: true, data: newActivity });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const toggleActivityAppropriateness = async (req, res) => {
    const { id } = req.params;
    const { isAppropriate } = req.body;
  
    try {
      // Find the activity by ID
      const activity = await Activity.findById(id);
      if (!activity) {
        return res.status(404).json({ success: false, message: "Activity not found" });
      }
  
      // Update the appropriateness status
      activity.isAppropriate = isAppropriate;
  
      // Save the updated activity
      await activity.save();
  
      res.json({
        success: true,
        message: `Activity marked as ${isAppropriate ? "appropriate" : "inappropriate"}`,
        data: activity,
      });
    } catch (error) {
      console.error("Error toggling appropriateness:", error);
      res.status(500).json({ success: false, message: "Error updating activity appropriateness" });
    }
  };
// Get Activities
export const getActivity = async (req, res) => {
    const { filter, sort, minPrice, maxPrice } = req.query;

    let parsedFilter = await filter ? JSON.parse(filter) : {};
    let parsedSort = sort ? JSON.parse(sort) : {};

    // Ensure the filter doesn't include inappropriate activities
    // parsedFilter.isAppropriate = true;

    console.log(parsedFilter);

    if (minPrice || maxPrice) {
        parsedFilter.price = {};

        if (minPrice) {
            parsedFilter.price.$gte = parseFloat(minPrice);
        }

        if (maxPrice) {
            parsedFilter.price.$lte = parseFloat(maxPrice);
        }
    }

    try {
        const activities = await Activity.find(parsedFilter).sort(parsedSort);
        console.log(activities);
        return res.status(200).json({ success: true, data: activities });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

// Update Activity (including isAppropriate flag)
export const updateActivity = async (req, res) => {
    const { id, newActivity } = req.body;
    try {
        const activityExists = await Activity.exists({ _id: id });

        if (!activityExists) {
            return res.status(404).json({ success: false, message: "Activity not found" });
        }

        const updatedActivity = await Activity.findByIdAndUpdate(
            { _id: id },
            { ...newActivity, isAppropriate: newActivity.isAppropriate }, // Allow admin to update isAppropriate
            { new: true, runValidators: true }
        );

        return res.status(200).json({ success: true, data: updatedActivity });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Activity
export const deleteActivity = async (req, res) => {
    const { id } = req.body;
    try {
        await Activity.findOneAndDelete({ _id: id });
        return res.json({ success: true, message: 'Activity deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Create Activity Review
export const createActivityReview = async (req, res) => {
    const { rating, comment, name } = req.body;
    const activity = await Activity.findById(req.params.id);

    if (activity) {
        const review = { rating: Number(rating), comment, name };
        activity.reviews.push(review);
        activity.numReviews = activity.reviews.length;
        activity.rating = activity.reviews.reduce((acc, item) => item.rating + acc, 0) / activity.reviews.length;
        await activity.save();

        return res.status(201).json({
            success: true,
            message: 'Review added',
            review,
            numReviews: activity.numReviews,
            rating: activity.rating,
        });
    } else {
        return res.status(404).json({ message: 'Activity not found' });
    }
};
export const getAllActivities = async (req, res) => {
    try {
      // Fetch all activities from the database
      const activities = await Activity.find({});
      
      res.json({
        success: true,
        data: activities,
      });
    } catch (error) {
      console.error("Error fetching all activities:", error);
      res.status(500).json({ success: false, message: "Failed to fetch all activities" });
    }
  };










  