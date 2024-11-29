import TourGuide from "../models/tourGuide.model.js";
import User from "../models/user.model.js";
import Itinerary from "../models/itinerary.model.js"; // Assuming itineraries are stored here
import multer from 'multer';
import dotenv from "dotenv";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDirectory = path.join(__dirname, "../uploads");

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Configure multer storage for file uploads
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

// Upload Profile Picture for Tour Guide
export const uploadProfilePicture = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file provided." });
  }

  const { userName } = req.body;
  const filePath = `/uploads/${req.file.filename}`;

  try {
    const guide = await TourGuide.findOne({ userName });
    if (!guide) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Tour guide not found." });
    }

    // Remove old profile picture file if it exists
    if (guide.profilePicture && fs.existsSync(path.join(__dirname, `../${guide.profilePicture}`))) {
      fs.unlinkSync(path.join(__dirname, `../${guide.profilePicture}`));
    }

    // Update guide's profile picture path in the database
    guide.profilePicture = filePath;
    await guide.save();

    return res.status(200).json({
      message: "Profile picture uploaded successfully",
      profilePicture: `http://localhost:5000${filePath}`,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return res.status(500).json({ message: "Profile picture upload failed", error });
  }
};

// Create Tour Guide
export const createTourGuide = async (req, res) => {
  const tourGuideData = req.body;

  if (!tourGuideData.userName || !tourGuideData.password || !tourGuideData.email) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const duplicate = [
    ...await User.find({ userName: tourGuideData.userName }),
    ...await User.find({ email: tourGuideData.email })
  ];
  if (duplicate.length > 0) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }

  const newTourGuide = new TourGuide(tourGuideData);

  try {
    await newTourGuide.save();
    res.status(201).json({ success: true, message: "Tour guide account created successfully", data: newTourGuide });
  } catch (error) {
    console.error("Error creating tour guide:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Tour Guide
export const getTourGuide = async (req, res) => {
  const { userName } = req.query;

  try {
    const guide = await TourGuide.find({ userName }).select("-password").populate("notifications");

    const profilePicturePath = guide.profilePicture
      ? `http://localhost:5000${guide.profilePicture}`
      : null;

    res.status(200).json({
      success: true,
      data: guide,
    });
  } catch (error) {
    console.error("Error fetching tour guide:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update Tour Guide
export const updateTourGuide = async (req, res) => {
  const { userName } = req.body;
  const updates = { ...req.body };

  // If a file is uploaded, set the profilePicture path
  if (req.file) {
    updates.profilePicture = `/uploads/${req.file.filename}`;
  }

  try {
    const guide = await TourGuide.findOne({ userName });
    if (!guide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    if (req.file && guide.profilePicture && fs.existsSync(path.join(__dirname, `../${guide.profilePicture}`))) {
      fs.unlinkSync(path.join(__dirname, `../${guide.profilePicture}`));
    }

    Object.assign(guide, updates);
    await guide.save();

    res.status(200).json({ message: "Tour guide updated successfully", guide });
  } catch (error) {
    console.error("Error updating tour guide:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete Tour Guide
export const deleteTourGuide = async (req, res) => {
  const { userName } = req.body;

  try {
    const guide = await TourGuide.findOne({ userName });
    if (!guide) {
      return res.status(404).json({ success: false, message: "Tour guide not found" });
    }

    if (guide.profilePicture && fs.existsSync(path.join(__dirname, `../${guide.profilePicture}`))) {
      fs.unlinkSync(path.join(__dirname, `../${guide.profilePicture}`));
    }
        if (!tourGuideExists) {
            return res.status(404).json({ success: false, message: "tour Guide is not found" });
        }
        const activeItineraries = await Itinerary.findOne({ creator: userName, numberOfBookings: { $ne: 0 } });
        if (activeItineraries) {
            return res.status(400).json({success: false,message: "Cannot delete tour guide with active bookings in itineraries"});
        }
        await TourGuide.findOneAndDelete({ userName: userName });
        await Itinerary.updateMany(
            { creator: userName },
            { $set: { isActivated: false } }
        );
        res.json({success:true, message: 'tour Guide deleted successfully' });
    } 
   catch (error) {
    console.error("Error deleting tour guide:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Check Tour Guide Bookings
export const checkTourGuideBookings = async (req, res) => {
  const { userName } = req.params;

  try {
    const itineraries = await Itinerary.find({ creator: userName });
    const hasBookings = itineraries.some(itinerary => itinerary.numberOfBookings > 0);

    if (hasBookings) {
      return res.status(200).json({
        success: true,
        message: "At least one itinerary has bookings.",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "No itineraries with bookings found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking bookings",
      error: error.message,
    });
  }
};



export const createTourGuideReview = async (req, res) => {
    const { rating, comment,name  } = req.body;
    console.log('Received rating:', rating);
    console.log('Received comment:', comment);
    console.log('Received username:', name);
    console.log('Received Param:', req.params.id);
    const tourGuideName = req.params.id.trim(); 
    const tourGuide = await TourGuide.findOne({ userName: new RegExp('^' + tourGuideName + '$', 'i') });
    console.log('Received Tour Guide:', tourGuide);
    
    if (!tourGuide) {
        return res.status(404).send('Tour guide not found');
    }
    if (tourGuide) {
        // const alreadyReviewed = itinerary.reviews.find(
        //     (r) => r.user.toString() === name // Use 'name' which is defined
        // );
        // if (alreadyReviewed) {
        //     res.status(400);
        //     throw new Error('Itinerary already reviewed');
        // }
        const review = {
            rating: Number(rating),
            comment,
            name,  
        };
        console.log('Received review:', review);
        tourGuide.reviews.push(review);
        tourGuide.numReviews = tourGuide.reviews.length;
        tourGuide.rating =
            tourGuide.reviews.reduce((acc, item) => item.rating + acc, 0) /
            tourGuide.reviews.length;
        await tourGuide.save();

        res.status(201).json({
            success: true,
            message: 'Review added',
            review,
            numReviews: tourGuide.numReviews,
            rating: tourGuide.rating,
        });
    } else {
        res.status(404);
        throw new Error('Tour Guide not found');
    }
};
export const getTourGuideReport = async (req, res) => {
  try {
      const tourGuideUserName = req.params.userName;
      const itineraries = await Itinerary.find({ creator: tourGuideUserName }).populate('tourists');
      const itinerarytotalTourists = itineraries.reduce((count, itinerary) => {
        const tourists = itinerary.tourists;
        return count + tourists.length;
      }, 0);
      const totalTourists=itinerarytotalTourists;
      const report = {
        totalTourists,
        itineraries: itineraries.map(itinerary => ({
          title: itinerary.name,
          language:itinerary.language,
          numberOfTourists: (itinerary.tourists).length,
        })),
      };
      

      res.status(200).json(report);
  } catch (error) {
    console.error('Error generating report:', error);
      res.status(500).json({ error: 'Failed to generate report' });
  }
};
