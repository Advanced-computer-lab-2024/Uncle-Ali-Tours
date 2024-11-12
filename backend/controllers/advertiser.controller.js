import Advertiser from "../models/advertiser.model.js"; 
import User from "../models/user.model.js";
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

export const uploadProfilePicture = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file provided." });
  }

  const { userName } = req.body;
  const filePath = `/uploads/${req.file.filename}`;

  try {
    const advertiser = await Advertiser.findOne({ userName });
    if (!advertiser) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "advertiser not found." });
    }

    // Remove old profile picture file if it exists
    if (advertiser.profilePicture && fs.existsSync(path.join(__dirname, `../${advertiser.profilePicture}`))) {
      fs.unlinkSync(path.join(__dirname, `../${advertiser.profilePicture}`));
    }

    advertiser.profilePicture = filePath;
    await advertiser.save();

    return res.status(200).json({
      success: "Profile picture uploaded successfully",
      profilePicture: `http://localhost:5000${filePath}`,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return res.status(500).json({ message: "Profile picture upload failed", error });
  }
};

export const createAdvertiser = async (req, res) => {
    const advertiser = req.body;
    const newAdvertiser = new Advertiser(advertiser);

    if (!advertiser.userName || !advertiser.password|| !advertiser.email) {
        return res.status(400).json({ success: false, message: "All fields are required'" });
    }

    const duplicat = [...await User.find({userName: advertiser.userName}),...await User.find({email: advertiser.email})];
    if(duplicat.length > 0) {
        return res.status(400).json({success: false, message: 'User already exists' });
        
    }

    try {
        await newAdvertiser.save();
        res.status(201).json({ success: true, message: "Advertiser account created successfully", data: newAdvertiser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAdvertiser = async (req, res) => {
    const { userName } = req.params; // Get userName from route parameters
    try {
        const advertiser = await Advertiser.findOne({ userName });
        if (!advertiser) {
            return res.status(404).json({ success: false, message: "Advertiser not found" });
        }
        
        // Add profile picture path if available
        const profilePicturePath = advertiser.profilePicture
            ? `http://localhost:5000${advertiser.profilePicture}`
            : null;

        res.status(200).json({
            success: true,
            advertiser: { ...advertiser.toObject(), profilePicturePath },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const updateAdvertiser = async (req,res) => {
    const {userName,newAdvertiser} = req.body;
    const updates = { ...req.body };
    if (req.file) {
        updates.profilePicture = `/uploads/${req.file.filename}`;
      }
    

    if(newAdvertiser.userName){
        return res.status(400).json({success:false, message: 'user name is not editable'});
    }

    
  
    if(newAdvertiser.email){
        if( !newAdvertiser.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ){
            return res.status(400).json({success:false, message: 'email format is wrong' });
        }
    }
    if(newAdvertiser.mobileNumber){
        if((!new RegExp(/^010\d{8}$/).test(newAdvertiser.mobileNumber.toString()) & !new RegExp(/^011\d{8}$/).test(newAdvertiser.mobileNumber.toString()) & !new RegExp(/^012\d{8}$/).test(newAdvertiser.mobileNumber.toString()) & !new RegExp(/^015\d{8}$/).test(newAdvertiser.mobileNumber.toString()))){
            return res.status(400).json({success:false, message: 'mobile number format is wrong'});
        }
    }
    
    try {
        const AdvertiserExists = await Advertiser.exists({username: userName});
        if(!AdvertiserExists){
            return res.status(404).json({ success: false, message: "Advertiser not found" });
        }
        if (req.file && AdvertiserExists.profilePicture && fs.existsSync(path.join(__dirname, `../${AdvertiserExists.profilePicture}`))) {
            fs.unlinkSync(path.join(__dirname, `../${AdvertiserExists.profilePicture}`));
          }

        const updatedAdvertiser = await Advertiser.findOneAndUpdate({ username: userName }, newAdvertiser, { new: true });
        res.status(200).json({success:true, data:  updatedAdvertiser});
    }
    catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
}



export const deleteAdvertiser = async (req, res) => {
    const { userName } = req.body; 

    try {
        const AdvertiserExists = await Advertiser.exists({ userName: userName });

        if (!AdvertiserExists) {
            return res.status(404).json({ success: false, message: "Advertiser not found" });
        }

        if (AdvertiserExists.profilePicture && fs.existsSync(path.join(__dirname, `../${AdvertiserExists.profilePicture}`))) {
            fs.unlinkSync(path.join(__dirname, `../${AdvertiserExists.profilePicture}`));
          }
      

        await Advertiser.findOneAndDelete({ userName: userName });
        res.json({ success: true, message: "Advertiser profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
