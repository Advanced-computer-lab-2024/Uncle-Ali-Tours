import TourGuide from "../models/tourGuide.model.js";
import User from "../models/user.model.js";

export const creatTourGuide = async(req,res) =>{
    const tourGuide = req.body;

    if( !tourGuide.email | !tourGuide.userName){//check dol bas el ba2i lazem ykoon verified el awal
        return res.status(400).json({success:false, message: 'All fields are required' });
}
    const duplicat = await User.find({userName: tourGuide.userName});
    if(duplicat.length > 0) {
        return res.status(400).json({success: false, message: 'UserName already exists' });
        
    }
    if( !tourGuide.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ){
        return res.status(400).json({success:false, message: 'email format is wrong' });
    }
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
        if((!newTourGuide.mobileNumber.toString().match(/^10\d{8}$/) & !newTourGuide.mobileNumber.toString().match(/^11\d{8}$/) & !newTourGuide.mobileNumber.toString().match(/^12\d{8}$/) & !newTourGuide.mobileNumber.toString().match(/^15\d{8}$/)) | !Number.isInteger(newTourGuide.mobileNumber)){
            return res.status(400).json({success:false, message: 'mobile number format is wrong'});
        }
    }
    if(newTourGuide.dateOfBirth){
        if(new Date(newTourGuide.dateOfBirth) > today){
            return res.status(400).json({success:false, message: 'your age is less than 10 years'});
        }
    }
    try {
        const tourGuideExists = await TourGuide.exists({userName});
        if(!tourGuideExists){
            return res.status(404).json({ success: false, message: "tour guide not found" });
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