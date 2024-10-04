import Tourist from "../models/Tourist.model.js";

export const createTourist = async(req,res)=>{
    const tourist = req.body;
    if( !tourist.email | !tourist.userName | !tourist.password | !tourist.mobileNumber | !tourist.nationality | !tourist.dateOfBirth | !tourist.occupation){
            return res.status(400).json({success:false, message: 'All fields are required' });
    }
    if(tourist.email != /^[^\s@]+@[^\s@]+\.[^\s@]+$/){
        return res.status(400).json({success:false, message: 'email format is wrong' });
    }
    if((tourist.mobilenumber != /^10\d{8}$/ & tourist.mobileNumber != /^11\d{8}$/ & tourist.mobileNumber != /^12\d{8}$/ & tourist.mobileNumber != /^15\d{8}$/) | !Number.isInteger(tourist.mobileNumber)){
        return res.status(400).json({success:false, message: 'mobile number format is wrong'});
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setFullYear(today.getFullYear() - 10);
    if(tourist.dateOfBirth > today){
        return res.status(400).json({success:false, message: 'your age is less than 10 years'});
    }
    const newTourist= new Tourist(tourist);
    try{
        await newTourist.save();
        res.status(201).json({success:true ,message:"account created sucssfully"});
    }
    catch(error){
        res.status(500).json({success:false , message:"server error"});
    }
}
export const getTourist = async(req,res) => {
    const { filter, sort } = req.query;
    let parsedFilter = filter ? JSON.parse(filter) : {};
    let parsedSort = sort ? JSON.parse(sort) : {};
    try {
        const activities = await Tourist.find(parsedFilter).sort(parsedSort);
        res.status(200).json({success:true, data: activities});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}