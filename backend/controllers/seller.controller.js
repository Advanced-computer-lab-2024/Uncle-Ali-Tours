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
const uploadDocsDirectory = path.join(__dirname, "../uploads/docs");

// Ensure the uploads/docs directory exists
if (!fs.existsSync(uploadDocsDirectory)) {
  fs.mkdirSync(uploadDocsDirectory, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Saving file to:", uploadDocsDirectory);
    cb(null, uploadDocsDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    console.log("Saving file with name:", uniqueName);
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage: storage });
export const uploadMiddleware = upload.fields([
  { name: "taxID", maxCount: 1 },
  { name: "taxationRegistryCard", maxCount: 1 },
]);
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
      success: true,
      message: "Profile picture uploaded successfully",
      profilePicture: filePath,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return res.status(500).json({ message: "Profile picture upload failed", error });
  }
};

// Update Seller function to handle profile photo
export const updateSeller = async (req, res) => {
  const {userName, newSeller} = req.body;

  // If a file is uploaded, set the profilePicture path
  if (req.file) {
    updates.profilePicture = `/uploads/${req.file.filename}`;
  }

  try {
    const seller = await Seller.findOne({userName});
    if (!seller) {
      return res.status(400).json({ message: "Seller not found" });
    }

    // Remove old profile picture if a new one is being uploaded
    if (req.file && seller.profilePicture && fs.existsSync(path.join(__dirname, `../${seller.profilePicture}`))) {
      fs.unlinkSync(path.join(__dirname, `../${seller.profilePicture}`));
    }

    const updatedSeller = await Seller.findOneAndUpdate({userName}, newSeller, {
      new: true,
    }).select("-password");

    res.status(200).json({success:true, message: "Seller updated successfully", seller: updatedSeller });
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

  if (!userName) {
    return res.status(400).json({ success: false, message: "userName is required" });
  }

  try {
    const seller = await Seller.findOne({ userName });
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    await Product.deleteMany({ creator: userName });
    await Seller.findOneAndDelete({ userName });

    // Remove profile picture file if it exists
    if (seller.profilePicture && fs.existsSync(path.join(__dirname, `../${seller.profilePicture}`))) {
      fs.unlinkSync(path.join(__dirname, `../${seller.profilePicture}`));
    }
    
    

    res.json({ success: true, message: "Seller profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting seller:", error); // Log the error for debugging
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }

  
};
const docsUploadDirectory = path.join(
  "C:/Users/loaym/Documents/GitHub/Uncle-Ali-Tours/backend/uploads/docs"
);

// Ensure the uploads/docs directory exists
if (!fs.existsSync(docsUploadDirectory)) {
  fs.mkdirSync(docsUploadDirectory, { recursive: true });
}
export const uploadDocuments = async (req, res) => {
  console.log("Received files:", req.files); // Log the received files
  console.log("Received body:", req.body);   // Log the received body

  if (!req.files) {
    console.log("No files received:", req.body);
    return res.status(400).json({ message: "No files provided." });
  }

  const { userName } = req.body;

  // Get the paths for the uploaded files
  const taxIDPath = req.files["taxID"]
    ? `/uploads/docs/${req.files["taxID"][0].filename}`
    : null;

  const taxationRegistryCardPath = req.files["taxationRegistryCard"]
    ? `/uploads/docs/${req.files["taxationRegistryCard"][0].filename}`
    : null;

  console.log("Tax ID Path:", taxIDPath);
  console.log("Taxation Registry Card Path:", taxationRegistryCardPath);

  try {
    const seller = await Seller.findOne({ userName });
    if (!seller) {
      console.log("Seller not found:", userName);

      // Delete the files if the seller is not found
      if (taxIDPath) fs.unlinkSync(path.join(__dirname, "..", taxIDPath));
      if (taxationRegistryCardPath) fs.unlinkSync(path.join(__dirname, "..", taxationRegistryCardPath));

      return res.status(404).json({ message: "Seller not found." });
    }

    // Update seller's documents in the database
    if (taxIDPath) seller.taxID = taxIDPath;
    if (taxationRegistryCardPath) seller.taxationRegistryCard = taxationRegistryCardPath;

    await seller.save();

    return res.status(200).json({
      success: true,
      message: "Documents uploaded successfully",
      sellerID: taxIDPath,
      taxationRegistryCard: taxationRegistryCardPath,
    });
  } catch (error) {
    console.error("Error uploading documents:", error);
    return res.status(500).json({ message: "Document upload failed", error });
  }
};



export const getUploadedDocuments = async (req, res) => {
  const { userName } = req.query; // Get username from query string
  
  try {
    const seller = await Seller.findOne({ userName });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found." });
    }

    // Send back the document URLs
    return res.status(200).json({
      success: true,
      message: "Documents retrieved successfully",
      documents: {
        sellerID: seller.sellerID || null,
        taxationRegistryCard: seller.taxationRegistryCard || null
      }
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res.status(500).json({ message: "Error fetching documents", error });
  }
};

export const getAllUploadedDocuments = async (req, res) => {
  try {
    const sellers = await Seller.find(); // Find all sellers
    const documents = sellers.map((seller) => ({
      userName: seller.userName,
      profilePicture: seller.profilePicture,
      sellerID: seller.sellerID,
      taxationRegistryCard: seller.taxationRegistryCard,
    }));

    return res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error("Error fetching all documents:", error);
    return res.status(500).json({ message: "Error fetching documents", error });
  }
};



