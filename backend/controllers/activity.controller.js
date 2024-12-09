import Activity from "../models/activity.model.js";
import Advertiser from "../models/advertiser.model.js";
import Bookmark from "../models/bookmark.model.js";
import Notification from "../models/notification.model.js";
import Tourist from "../models/tourist.model.js";
import { sendEmail } from "../util/email.js";
const { EMAIL } = process.env;
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDirectory = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
  }
// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
  });
  
  export const upload = multer({ storage: storage });
  export const uploadMiddleware = upload.single("profilePicture");
  

  export const uploadProductPicture = async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided." });
    }
  
    const { id } = req.params;
    const filePath = `/uploads/${req.file.filename}`;
  
    try {
      const activity = await Activity.findById(id);
      if (!activity) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: " not found." });
      }
  
      // Remove old profile picture file if it exists
      if (activity.profilePicture && fs.existsSync(path.join(__dirname, `../${activity.profilePicture}`))) {
        fs.unlinkSync(path.join(__dirname, `../${activity.profilePicture}`));
      }
  
      // Update seller's profile picture path in the database
      activity.profilePicture = filePath;
      await activity.save();
  
      return res.status(200).json({
        success: true,
        message: "activity picture uploaded successfully",
        profilePicture: `${process.env.SERVER_URL || 'http://localhost:5000'}${filePath}`, // Return the full URL
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      return res.status(500).json({ message: "Profile picture upload failed", error });
    }
  };

  


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

export const getBookmarkedActivitiesForUser = async (req, res) => {
    const { userName } = req.params;

    if (!userName) {
        return res.status(400).json({ message: "User name is required" });
    }

    try {
        const bookmarks = await Bookmark.find({ userName }).populate("activityId");
        res.status(200).json({ bookmarks });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
    const { isAppropriate ,userName ,link} = req.body;
  
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

        const advertiser = await Advertiser.findOne({userName});
        if(!advertiser){
            res.status(402).json({success:false, message :"Advertiser was not found"})
        }
        if (!advertiser.notifications) {
            advertiser.notifications = [];
        }
        const notification = new Notification({
            userName: advertiser.userName,
            title: `Marked as ${isAppropriate?"appropriate":"inappropriate"}`,
            message: `your activity has been marked as ${isAppropriate?"appropriate":"inappropriate"} by admin`,
            link: link // link to promo page
        });
        await notification.save();
        advertiser.notifications.push(notification._id);
        await advertiser.save()
        if(!advertiser.email){
            return  res.status(403).json({success:false, message :"email was not found"});
        }
        if( !advertiser.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ){
            return res.status(405).json({success:false, message: 'email format is wrong' });
        }
        const mailOptions = {
            from: EMAIL,
            to: advertiser.email,
            subject:`Marked as ${isAppropriate?"appropriate":"inappropriate"}`,
        html:`<h1>your activity has been marked as ${isAppropriate?"appropriate":"inappropriate"} by admin</h1><p>${link}</p>`,
        };
        const { success, message: emailMessage } = await sendEmail(mailOptions);
        if(success){
            res.status(200).json({success:true, message : "marked successfuly"});
    }else{
        res.status(500).json({success:false, message :"marked successfuly but problem happend while sending the email"});
    }
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

    // console.log(parsedFilter);

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
        // console.log(activities);
        return res.status(200).json({ success: true, data: activities });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

export const getActivityById = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            return res.status(404).json({ success: false, message: "Activity not found" });
        }

        res.status(200).json({ success: true, data: activity });
        return activity;
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const notifyIntrest = async(touristId,bookingOpen,activityId)=> {
    const tourist = await Tourist.findById(touristId);
    if (!tourist.notifications) {
        tourist.notifications = [];
    }
    const link = `http://localhost:5000/activityDetail/${activityId}`
    const notification = new Notification({
        userName: tourist.userName,
        title: `this activity ${bookingOpen?"is open":"is colsed"}`,
        message: `your intrested activity booking has been marked as ${bookingOpen?"open":"colsed"} by creator`,
        link: link // link to promo page
    });
    await notification.save();
    tourist.notifications.push(notification._id);
    await tourist.save()
}
// Update Activity (including isAppropriate flag)
export const updateActivity = async (req, res) => {
    const { id, newActivity } = req.body;

    if (req.file) {
        newActivity.profilePicture = `/uploads/${req.file.filename}`;
      }
    
    try {
        const activityExists = await Activity.exists({ _id: id });
        if (req.file && activityExists.profilePicture && fs.existsSync(path.join(__dirname, `../${activityExists.profilePicture}`))) {
            fs.unlinkSync(path.join(__dirname, `../${activityExists.profilePicture}`));
          }

        if (!activityExists) {
            return res.status(404).json({ success: false, message: "Activity not found" });
        }
        const activity = await Activity.findById(id);
        if((activity.bookingOpen && !newActivity.bookingOpen) || (!activity.bookingOpen && newActivity.bookingOpen)){
            activity.interstedIn.map((touristId)=>{notifyIntrest(touristId,newActivity.bookingOpen,activity._id)})
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
        const deleted=   await Activity.findOneAndDelete({ _id: id });

        if (deleted.profilePicture && fs.existsSync(path.join(__dirname, `../${deleted.profilePicture}`))) {
            fs.unlinkSync(path.join(__dirname, `../${deleted.profilePicture}`));
          }
        return res.json({ success: true, message: 'Activity deleted successfully' });
        
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
  

    } 

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

  export const interestedIn = async(req, res) => {
    try{
        const {touristId,activityId} = req.body;
        const activity = await Activity.findById(activityId);
        activity.interstedIn.push(touristId);
        await activity.save();
        return res.status(200).json({ success: true,data:activity, message: 'you will get notified when booking is open' });
    }catch(error){
        return res.status(200).json({ success: false, message: error.message });
    }
}

export const removeInterestedIn = async(req, res) => {
    try{
        const {touristId,activityId} = req.body;
        const activity = await Activity.findById(activityId);
        activity.interstedIn = activity.interstedIn.filter(item => item !==touristId);
        await activity.save(); // Save changes to the database
        return res.status(200).json({ success: true,data:activity, message: 'you will not get notified when booking is open' });
    }catch(error){
        return res.status(200).json({ success: false, message: error.message });
    }
}










  