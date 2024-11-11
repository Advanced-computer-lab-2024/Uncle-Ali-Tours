import Tourist from "../models/tourist.model.js";
import User from "../models/user.model.js";

export const createTourist = async(req,res)=>{
    const tourist = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setFullYear(today.getFullYear() - 10);
    if( !tourist.email | !tourist.userName | !tourist.password | !tourist.mobileNumber | !tourist.nationality | !tourist.dateOfBirth | !tourist.occupation){
            return res.status(400).json({success:false, message: 'All fields are required' });
    }
    const duplicat = [...await User.find({userName: tourist.userName}),...await User.find({email: tourist.email})];
    if(duplicat.length > 0) {
        return res.status(400).json({success: false, message: 'User already exists' });
        
    }
    if( !tourist.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ){
        return res.status(400).json({success:false, message: 'email format is wrong' });
    }
    if((!new RegExp(/^010\d{8}$/).test(tourist.mobileNumber.toString()) & !new RegExp(/^011\d{8}$/).test(tourist.mobileNumber.toString()) & !new RegExp(/^012\d{8}$/).test(tourist.mobileNumber.toString()) & !new RegExp(/^015\d{8}$/).test(tourist.mobileNumber.toString()))){
        return res.status(400).json({success:false, message: 'mobile number format is wrong'});
    }
    tourist.dateOfBirth = Date.parse(tourist.dateOfBirth);
    console.log(tourist.dateOfBirth);
    console.log(new Date(tourist.dateOfBirth));
    if(tourist.dateOfBirth > today){
        return res.status(400).json({success:false, message: 'your age is less than 10 years'});
    }
    const newTourist= new Tourist(tourist);
    try{
        await newTourist.save();
        res.status(201).json({success:true ,message:"account created sucssfully"});
    }
    catch(error){
        res.status(500).json({success:false , message:error.message});
    }
}
export const getTourist = async(req,res) => {
    const { filter, sort } = req.query;
    let parsedFilter = filter ? JSON.parse(filter) : {};
    let parsedSort = sort ? JSON.parse(sort) : {};
    try {
        const Tourists = await Tourist.find(parsedFilter).sort(parsedSort);
       return res.status(200).json({success:true, data: Tourists});
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

    if(newTourist.email){
        if( !newTourist.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ){
            return res.status(400).json({success:false, message: 'email format is wrong' });
        }
    }
    if(newTourist.mobileNumber){
        if((!new RegExp(/^010\d{8}$/).test(newTourist.mobileNumber.toString()) & !new RegExp(/^011\d{8}$/).test(newTourist.mobileNumber.toString()) & !new RegExp(/^012\d{8}$/).test(newTourist.mobileNumber.toString()) & !new RegExp(/^015\d{8}$/).test(newTourist.mobileNumber.toString()))){
            return res.status(400).json({success:false, message: 'mobile number format is wrong'});
        }
    }
    if(newTourist.dateOfBirth){
        newTourist.dateOfBirth = Date.parse(newTourist.dateOfBirth);
        if(newTourist.dateOfBirth > today){
            return res.status(400).json({success:false, message: 'your age is less than 10 years'});
        }
    }
    try {
        const touristExists = await Tourist.find({userName});
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

export const redeemPoints = async (req, res) => {
    const { userName } = req.body;
    try {
        const tourist = await Tourist.findOne({ userName });
        if (!tourist) {
            return res.status(404).json({ success: false, message: "Tourist not found" });
        }

        // Calculate points to currency
        const pointsToCurrency = tourist.myPoints / 100;

        // Update wallet and reset points
        const updatedTourist = await Tourist.findOneAndUpdate(
            { userName },
            { myWallet: tourist.myWallet + pointsToCurrency, myPoints: 0 },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: `Redeemed ${tourist.myPoints} points.`,
            data: updatedTourist,
        });
    } catch (error) {
        console.error("Error redeeming points:", error);
        res.status(500).json({ success: false, message: "Server error during points redemption" });
    }
}

export const checkPurchaseStatusByUsername = async (req, res) => {
    const { username, productId } = req.params;

    try {
        // Find the tourist by username
        const tourist = await Tourist.findOne({ userName : username }).populate('purchasedProducts');

        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found.' });
        }

        // Check if the productId exists in the purchasedProducts array
        const hasPurchased = tourist.purchasedProducts.some(p => p._id.toString() === productId);

        if (hasPurchased) {
            res.status(200).json({ canReview: true, message: 'You can rate/review this product.' });
        } else {
            res.status(200).json({ canReview: false, message: 'You must purchase this product before rating or reviewing it.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error checking purchase status.', error });
    }
};


