import Tourist from "../models/tourist.model.js";

export const createTourist = async(req,res)=>{
    const tourist = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setFullYear(today.getFullYear() - 10);
    if( !tourist.email | !tourist.userName | !tourist.password | !tourist.mobileNumber | !tourist.nationality | !tourist.dateOfBirth | !tourist.occupation){
            return res.status(400).json({success:false, message: 'All fields are required' });
    }
    if( !tourist.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ){
        return res.status(400).json({success:false, message: 'email format is wrong' });
    }
    if((!tourist.mobileNumber.toString().match(/^10\d{8}$/) & !tourist.mobileNumber.toString().match(/^11\d{8}$/) & !tourist.mobileNumber.toString().match(/^12\d{8}$/) & !tourist.mobileNumber.toString().match(/^15\d{8}$/)) | !Number.isInteger(tourist.mobileNumber)){
        return res.status(400).json({success:false, message: 'mobile number format is wrong'});
    }
    
    if(new Date(tourist.dateOfBirth) > today){
        return res.status(400).json({success:false, message: 'your age is less than 10 years'});
    }
    const newTourist= new Tourist(tourist);
    try{
        await newTourist.save();
        res.status(201).json({success:true ,message:"account created sucssfully"});
    }
    catch(error){
        res.status(500).json({success:false , message:"server Error"});
    }
}
export const getTourist = async(req,res) => {
    const { filter, sort } = req.query;
    let parsedFilter = filter ? JSON.parse(filter) : {};
    let parsedSort = sort ? JSON.parse(sort) : {};
    try {
        const Tourists = await Tourist.find(parsedFilter).sort(parsedSort);
        res.status(200).json({success:true, data: Tourists});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateTourist = async (req,res) => {
    const {userName,newTourist} = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setFullYear(today.getFullYear() - 10);

    const keys = Object.keys(newTourist)

    for (let i=0;i<keys.length;i++){
        if(newTourist[keys[i]].length <= 0){
            return res.status(400).json({success:false, message: 'fields are requierd to update'})
        }
    }
    if(newTourist.userName){
        return res.status(400).json({success:false, message: 'user name is not editable'});
    }
    if(newTourist.myWallet){
        return res.status(400).json({success:false, message: 'wallet is not editable'});
    }
    if(newTourist.email){
        if( !newTourist.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ){
            return res.status(400).json({success:false, message: 'email format is wrong' });
        }
    }
    if(newTourist.mobileNumber){
        if((!newTourist.mobileNumber.toString().match(/^10\d{8}$/) & !newTourist.mobileNumber.toString().match(/^11\d{8}$/) & !newTourist.mobileNumber.toString().match(/^12\d{8}$/) & !newTourist.mobileNumber.toString().match(/^15\d{8}$/)) | !Number.isInteger(newTourist.mobileNumber)){
            return res.status(400).json({success:false, message: 'mobile number format is wrong'});
        }
    }
    if(newTourist.dateOfBirth){
        if(new Date(newTourist.dateOfBirth) > today){
            return res.status(400).json({success:false, message: 'your age is less than 10 years'});
        }
    }
    try {
        const touristExists = await Tourist.exists({userName});
        if(!touristExists){
            return res.status(404).json({ success: false, message: "tourist not found" });
        }
        const updatedTourist = await Tourist.findOneAndUpdate({ userName: userName }, newTourist, { new: true });
        res.status(200).json({success:true, data:  updatedTourist});
    }
    catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
}

export const deleteTourist = async(req, res) => {
    const { userName } = req.body;
    if(!userName){
        return res.status(404).json({ success: false, message: "user name is requierd" });
    }
    try {
        const touristExists = await Tourist.exists({ userName: userName });

        if (!touristExists) {
            return res.status(404).json({ success: false, message: "tourist not found" });
        }

        await Tourist.findOneAndDelete({ userName: userName });
        res.json({success:true, message: 'tourist deleted successfully' });
    } catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
}