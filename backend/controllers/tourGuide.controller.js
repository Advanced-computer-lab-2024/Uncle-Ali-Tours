import TourGuide from "../models/tourGuide.model.js";
import User from "../models/user.model.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer storage for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'uploads/tourGuides');
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Set a file size limit of 5MB
});

// Upload file handler function
export const uploadFile = (req, res) => {
    const userType = req.body.userType;

    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    res.json({
        success: true,
        message: `File uploaded successfully as ${userType === "tourGuide" ? "photo" : "logo"}`,
        filePath: `/uploads/tourGuides/${req.file.filename}`,
    });
};

// Export upload middleware for use in the route
export { upload };


export const creatTourGuide = async(req,res) =>{
    const tourGuide = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setFullYear(today.getFullYear() - 10);
    if( !tourGuide.email | !tourGuide.userName | !tourGuide.password ){
            return res.status(400).json({success:false, message: 'All fields are required' });
    }

    const duplicat = [...await User.find({userName: tourGuide.userName}),...await User.find({email: tourGuide.email})];
    console.log(duplicat);
    if(duplicat.length > 0) {
        return res.status(400).json({success: false, message: 'User already exists' });
    }

    if( !tourGuide.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ){
        return res.status(400).json({success:false, message: 'email format is wrong' });
    }
    // if((!tourGuide.mobileNumber.toString().match(/^10\d{8}$/) & !tourGuide.mobileNumber.toString().match(/^11\d{8}$/) & !tourGuide.mobileNumber.toString().match(/^12\d{8}$/) & !tourGuide.mobileNumber.toString().match(/^15\d{8}$/)) | !Number.isInteger(tourGuide.mobileNumber)){
    //     return res.status(400).json({success:false, message: 'mobile number format is wrong'});
    // }
    
    // if(new Date(tourGuide.dateOfBirth) > today){
    //     return res.status(400).json({success:false, message: 'your age is less than 10 years'});
    // }
    const newTourGuide= new TourGuide(tourGuide);
    try{
        await newTourGuide.save();
        res.status(201).json({success:true ,message:"account created sucssfully"});
    }
    catch(error){
        res.status(500).json({success:false , message: error.message});
    }
}

export const getTourGuide = async(req,res) => {
    const { filter, sort } = req.query;
    let parsedFilter = filter ? JSON.parse(filter) : {};
    let parsedSort = sort ? JSON.parse(sort) : {};
    try {
        const TourGuides = await TourGuide.find(parsedFilter).sort(parsedSort);
        res.status(200).json({success:true, data: TourGuides});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateTourGuide = async (req,res) => {
    const {userName,newTourGuide} = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setFullYear(today.getFullYear() - 10);

    const keys = Object.keys(newTourGuide)

    for (let i=0;i<keys.length;i++){
        if(newTourGuide[keys[i]].length <= 0){
            return res.status(400).json({success:false, message: 'fields are requierd to update'})
        }
    }
    if(newTourGuide.userName){
        return res.status(400).json({success:false, message: 'user name is not editable'});
    }
    if(newTourGuide.email){
        if( !newTourGuide.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ){
            return res.status(400).json({success:false, message: 'email format is wrong' });
        }
    }
    if(newTourGuide.mobileNumber){
        if((!new RegExp(/^010\d{8}$/).test(newTourGuide.mobileNumber.toString()) & !new RegExp(/^011\d{8}$/).test(newTourGuide.mobileNumber.toString()) & !new RegExp(/^012\d{8}$/).test(newTourGuide.mobileNumber.toString()) & !new RegExp(/^015\d{8}$/).test(newTourGuide.mobileNumber.toString()))){
            return res.status(400).json({success:false, message: 'mobile number format is wrong'});
        }
    }
    if(newTourGuide.dateOfBirth){
        newTourGuide.dateOfBirth = Date.parse(newTourGuide.dateOfBirth);
        if(newTourGuide.dateOfBirth > today){
            return res.status(400).json({success:false, message: 'your age is less than 10 years'});
        }
    }
    try {
        const tourGuideExists = await TourGuide.find({userName : userName});
        if(!tourGuideExists){
            return res.status(404).json({ success: false, message: "tour guide not found" });
        }
        if(!tourGuideExists[0].verified){
            return res.status(400).json({success:false, message: "your are not verified yet" });
        }
        const updatedTourGuide = await TourGuide.findOneAndUpdate({ userName: userName }, newTourGuide, { new: true });
        res.status(200).json({success:true, data:  updatedTourGuide});
    }
    catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
}
export const deleteTourGuide = async(req, res) => {
    const { userName } = req.body;
    console.log(userName);
    if(!userName){
        return res.status(404).json({ success: false, message: "user name is requierd" });
    }
    try {
        const tourGuideExists = await TourGuide.exists({ userName: userName });

        if (!tourGuideExists) {
            return res.status(404).json({ success: false, message: "tour Guide is not found" });
        }

        await TourGuide.findOneAndDelete({ userName: userName });
        res.json({success:true, message: 'tour Guide deleted successfully' });
    } catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
}
export const checkTourGuideBookings = async (req, res) => {
    const { userName } = req.params;  // Get tour guide's userName from request params

    try {
        // Fetch itineraries created by this tour guide
        const itineraries = await Itinerary.find({ creator: userName });

        // Check if any itinerary has bookings (numberOfBookings > 0)
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
}