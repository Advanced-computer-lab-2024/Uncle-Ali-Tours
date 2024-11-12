import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Seller from "../models/seller.model.js";
import User from "../models/user.model.js";
import Product from '../models/product.model.js'; 



dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDirectory = path.join(__dirname, "../uploads");

// Ensure the uploads directory exists
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

// Upload Profile Picture for Seller
export const uploadProfilePicture = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file provided." });
  }

  const { userName } = req.body;
  const filePath = `/uploads/${req.file.filename}`;

  try {
    const seller = await Seller.findOne({ userName });
    if (!seller) {
      // Remove the uploaded file if seller is not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Seller not found." });
    }

    // Remove old profile picture file if it exists
    if (seller.profilePicture && fs.existsSync(path.join(__dirname, `../${seller.profilePicture}`))) {
      fs.unlinkSync(path.join(__dirname, `../${seller.profilePicture}`));
    }

    // Update seller's profile picture path in the database
    seller.profilePicture = filePath;
    await seller.save();

    return res.status(200).json({
      message: "Profile picture uploaded successfully",
      profilePicture: `http://localhost:5000${filePath}`,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return res.status(500).json({ message: "Profile picture upload failed", error });
  }
};

// Update Seller function to handle profile photo
export const updateSeller = async (req, res) => {
  const { sellerId } = req.params; // Assuming seller ID is passed in params
  const updates = { ...req.body };

  // If a file is uploaded, set the profilePicture path
  if (req.file) {
    updates.profilePicture = `/uploads/${req.file.filename}`;
  }

  try {
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Remove old profile picture if a new one is being uploaded
    if (req.file && seller.profilePicture && fs.existsSync(path.join(__dirname, `../${seller.profilePicture}`))) {
      fs.unlinkSync(path.join(__dirname, `../${seller.profilePicture}`));
    }

    const updatedSeller = await Seller.findByIdAndUpdate(sellerId, updates, {
      new: true,
    }).select("-password");

    res.status(200).json({ message: "Seller updated successfully", seller: updatedSeller });
  } catch (error) {
    console.error("Error updating seller:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get Seller
export const getSeller = async (req, res) => {
  const { userName } = req.query;

  try {
    const seller = await Seller.findOne({ userName }).select("-password");
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const profilePicturePath = seller.profilePicture
      ? `http://localhost:5000${seller.profilePicture}`
      : null;

    res.status(200).json({
      success: true,
      seller: { ...seller.toObject(), profilePicturePath },
    });
  } catch (error) {
    console.error("Error fetching seller:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Create Seller
export const createSeller = async (req, res) => {
  const sellerData = req.body;

  if (!sellerData.userName || !sellerData.password || !sellerData.email) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const duplicate = [
    ...await User.find({ userName: sellerData.userName }),
    ...await User.find({ email: sellerData.email })
  ];
  if (duplicate.length > 0) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }

  const newSeller = new Seller(sellerData);

  try {
    await newSeller.save();
    res.status(201).json({ success: true, message: "Seller account created successfully", data: newSeller });
  } catch (error) {
    console.error("Error creating seller:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Seller
export const deleteSeller = async (req, res) => {
  const { userName } = req.body;

  try {
    const seller = await Seller.findOne({ userName });
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
        }
        await Product.findAndDelete({creator:userName});
        await Seller.findOneAndDelete({ userName: userName });
        // Remove profile picture file if it exists
    if (seller.profilePicture && fs.existsSync(path.join(__dirname, `../${seller.profilePicture}`))) {
      fs.unlinkSync(path.join(__dirname, `../${seller.profilePicture}`));
    }
        res.json({ success: true, message: "Seller profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
