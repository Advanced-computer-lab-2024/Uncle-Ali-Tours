import Tourist from "../models/tourist.model.js";
import User from "../models/user.model.js";
import Itinerary from "../models/itinerary.model.js";
import Activity from "../models/activity.model.js";
import transportationActivity from "../models/transportationActivity.model.js";
import Promo from "../models/promo.model.js"
import Product from "../models/product.model.js";

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

    for (let i=0;i<keys.length-1;i++){
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
        if (newTourist.email){
            const dd = await User.findOneAndUpdate({userName}, {email: newTourist.email}, {new: true});
        }
        res.status(200).json({success:true, data:  updatedTourist});
    }
    catch (error) {
        console.log(error.message);
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
};
}

export const badgeLevel = async (req, res) => {
    const { userName } = req.query;
    try {
        const tourist = await Tourist.findOne({ userName });
        if (!tourist) {
            return res.status(404).json({ success: false, message: "Tourist not found" });
        }

        let level = "level 1";
        if(tourist.myPoints>500000){
            level="level 3";
        }
        else if(tourist.myPoints>100000){
            level="level 2";
        }
        else{
            level="level 1";
        }

        
        const updatedTourist = await Tourist.findOneAndUpdate(
            { userName },
            { badge: level},
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: `Badge ${tourist.badge} .`,
            data: updatedTourist.badge,
        });
    } catch (error) {
        console.error("Error badging:", error);
        res.status(500).json({ success: false, message: "Server error during badging" });
    }
};


export const updateMyPreferences = async (req, res) => {
    const { userName, myPreferences } = req.body; // myPreferences can be an empty array
    try {
        // Fetch the tourist using the correct model
        const tourist = await Tourist.findOne({ userName });
        if (!tourist) {
            return res.status(404).json({ success: false, message: "Tourist not found" });
        }

        // Replace `myPreferences` with the provided array (even if it's empty)
        tourist.myPreferences = myPreferences;
        await tourist.save(); // Save changes to the database

        return res.status(200).json({ success: true, data: tourist.myPreferences, message: 'Preferences updated successfully' });
    } catch (error) {
        console.error("Error updating preferences:", error);
        res.status(500).json({ success: false, message: "Server error during preferences update" });
    }
};
export const updateMyPoints = async (req, res) => {
    const { userName, amountPaid } = req.body;
    console.log(amountPaid)
    if (isNaN(amountPaid) || amountPaid <= 0) {
        return res.status(400).json({ success: false, message: "Invalid amount paid" });
    }

    try {
        const tourist = await Tourist.findOne({ userName });
        if (!tourist) {
            return res.status(404).json({ success: false, message: "Tourist not found" });
        }

        let value = 0;

        // Validate the badge before proceeding
        switch (tourist.badge) {
            case 'level 1':
                value = amountPaid * 0.5;
                break;
            case 'level 2':
                value = amountPaid * 1;
                break;
            case 'level 3':
                value = amountPaid * 1.5;
                break;
            default:
                return res.status(400).json({ success: false, message: "Invalid badge level" });
        }

        // Ensure value is a valid number before adding to points
        if (isNaN(value)) {
            return res.status(400).json({ success: false, message: "Calculated value is invalid" });
        }

        tourist.myPoints += value;

        await tourist.save(); // Save changes to the database
        res.status(200).json({ success: true, message: "Points updated successfully" });

    } catch (error) {
        console.error("Error booking:", error);
        res.status(500).json({ success: false, message: "Server error updating points" });
    }
};


export const bookActivity = async(req,res) => {
    const {userName , _id} = req.body;
    try{
        const tourist = await Tourist.findOne({ userName });
        if (!tourist) {
            return res.status(404).json({ success: false, message: "Tourist not found" });
        }
        // console.log(_id)
        if(tourist.myBookings.includes(_id)){
            return res.status(404).json({ success: false, message: "already booked" });
        }
        tourist.myBookings.push(_id);
        await tourist.save(); // Save changes to the database

        return res.status(200).json({ success: true, data: tourist.myPreferences, message: 'booked successfully' });
        
    }catch (error) {
        console.error("Error booking:", error);
        res.status(500).json({ success: false, message: "Server error during booking" });
    }
}

export const bookRealActivity = async(req,res) => {
    const {userName , _id} = req.body;
    try{
        const tourist = await Tourist.findOne({ userName });
        if (!tourist) {
            return res.status(404).json({ success: false, message: "Tourist not found" });
        }
        // console.log(_id)
        if(tourist.ActivityBookings.includes(_id)){
            return res.status(404).json({ success: false, message: "already booked" });
        }
        tourist.ActivityBookings.push(_id);
        await tourist.save(); // Save changes to the database
        

        return res.status(200).json({ success: true, data: tourist.myPreferences, message: 'booked successfully' });
        
    }catch (error) {
        console.error("Error booking:", error);
        res.status(500).json({ success: false, message: "Server error during booking" });
    }
}

export const bookitineraryActivity = async(req,res) => {
    const {userName , _id} = req.body;
    try{
        const tourist = await Tourist.findOne({ userName });
        if (!tourist) {
            return res.status(404).json({ success: false, message: "Tourist not found" });
        }
        // console.log(_id)
        if(tourist.itineraryBookings.includes(_id)){
            return res.status(404).json({ success: false, message: "already booked" });
        }
        tourist.itineraryBookings.push(_id);
        await tourist.save(); // Save changes to the database
        const itinerary = await Itinerary.findById(_id);
        // Increment the number of bookings
        itinerary.numberOfBookings += 1;
        await itinerary.save();

        await tourist.save(); // Save changes to the database
        return res.status(200).json({ success: true, data: tourist.myPreferences, message: 'booked successfully' });
        
    }catch (error) {
        console.error("Error booking:", error);
        res.status(500).json({ success: false, message: "Server error during booking" });
    }
}

export const unBook = async(req,res) => {
    const {userName , _id} = req.body;
    try{
        const tourist = await Tourist.findOne({ userName });
        
        if (!tourist) {
            return res.status(404).json({ success: false, message: "Tourist not found" });
        }
        console.log(_id)
        if(!tourist.myBookings.includes(_id)){
            return res.status(404).json({ success: false, message: "not booked" });
        }
        const activity = await transportationActivity.findById(_id);
        if (!activity) {
            return res.status(404).json({ success: false, message: "Activity not found" });
        }

        // Get the current date and time
        const now = new Date();

        // Check if the activity's start time is at least 48 hours away
        const activityStartTime = new Date(activity.date); // Assuming startTime is a field in the Activity model
        const timeDiff = activityStartTime - now;

        // 48 hours in milliseconds
        const fortyEightHours = 48 * 60 * 60 * 1000;

        if (timeDiff <= fortyEightHours) {
            return res.status(400).json({
                success: false,
                message: "You cannot unbook this activity less than 48 hours before its start time."
            });
        }
        tourist.myBookings = tourist.myBookings.filter(item => item !==_id);
        await tourist.save(); // Save changes to the database

        return res.status(200).json({ success: true, data: tourist.myPreferences, message: 'unbooked successfully' });
        
    }catch (error) {
        console.error("Error booking:", error);
        res.status(500).json({ success: false, message: "Server error during unbooking" });
    }
}

export const unBookRealActivity = async(req,res) => {
    const {userName , _id} = req.body;
    try{
        const tourist = await Tourist.findOne({ userName });
        if (!tourist) {
            return res.status(404).json({ success: false, message: "Tourist not found" });
        }
        console.log(_id)
        if(!tourist.ActivityBookings.includes(_id)){
            return res.status(404).json({ success: false, message: "not booked" });
        }
        const realActivity = await Activity.findById(_id);
        if (!realActivity) {
            return res.status(404).json({ success: false, message: "Activity not found" });
        }

        // Get the current date and time
        const now = new Date();

        // Check if the activity's start time is at least 48 hours away
        const activityStartTime = new Date(realActivity.date); // Assuming startTime is a field in the Activity model
        const timeDiff = activityStartTime - now;

        // 48 hours in milliseconds
        const fortyEightHours = 48 * 60 * 60 * 1000;

        if (timeDiff <= fortyEightHours) {
            return res.status(400).json({
                success: false,
                message: "You cannot unbook this activity less than 48 hours before its start time."
            });
        }
        tourist.ActivityBookings = tourist.ActivityBookings.filter(item => item !==_id);
        await tourist.save(); // Save changes to the database
       

        return res.status(200).json({ success: true, data: tourist.myPreferences, message: 'unbooked successfully' });
        
    }catch (error) {
        console.error("Error booking:", error);
        res.status(500).json({ success: false, message: "Server error during unbooking" });
    }
}

export const unItiniraryBook = async(req,res) => {
    const {userName , _id} = req.body;
    try{
        const tourist = await Tourist.findOne({ userName });
        if (!tourist) {
            return res.status(404).json({ success: false, message: "Tourist not found" });
        }
        console.log(_id)
        if(!tourist.itineraryBookings.includes(_id)){
            return res.status(404).json({ success: false, message: "not booked" });
        }
        const itinerarry = await Itinerary.findById(_id);
        console.log(itinerarry)
        if (!itinerarry) {
            return res.status(404).json({ success: false, message: "Activity not found" });
        }

        // Get the current date and time
        const now = new Date();

        // Check if the activity's start time is at least 48 hours away
        const itinerarryStartTime = new Date(itinerarry.availableDates[0]); // Assuming startTime is a field in the Activity model
        const timeDiff = itinerarryStartTime - now;

        // 48 hours in milliseconds
        const fortyEightHours = 48 * 60 * 60 * 1000;
        // console.log(timeDiff)
        if (timeDiff <= fortyEightHours) {
            return res.status(400).json({
                success: false,
                message: "You cannot unbook this activity less than 48 hours before its start time."
            });
        }
        tourist.itineraryBookings = tourist.itineraryBookings.filter(item => item !==_id);
        const itinerary = await Itinerary.findById(_id);
        
    
        // Increment the number of bookings
        itinerary.numberOfBookings -= 1;
        await itinerary.save();

        await tourist.save(); // Save changes to the database
        
        return res.status(200).json({ success: true, data: tourist.myPreferences, message: 'unbooked successfully' });
        
    }catch (error) {
        console.error("Error booking:", error);
        res.status(500).json({ success: false, message: "Server error during unbooking" });
    }
}


export const getMyPromos = async (req, res) => {
    const { userName } = req.body;
    try {

        const promos = await Tourist.findOne({ userName }).select('promoCodes -_id').populate('promoCodes');
        res.status(200).json({ success: true, data: promos.promoCodes });
    } catch (error) {
        console.log("Error getting promos:", error);
        res.status(500).json({ success: false, message: "Server error getting promos" });

    }
}

export const addProductWishlist = async (req, res) => {
    const { userName, _id } = req.body;
    try {
        const tourist = await Tourist.findOne({ userName });
        if (!tourist) {
            return res.status(404).json({ success: false, message: "Tourist not found" });
        }

        // Check if product is already in wishlist
        if (tourist.productsWishlist.includes(_id)) {
            return res.status(404).json({ success: false, message: "Already in Wishlist" });
        }

        // Add product to wishlist
        tourist.productsWishlist.push(_id);
        await tourist.save(); // Save changes to the database

        // Send the updated wishlist back in the response
        return res.status(200).json({
            success: true,
            data: tourist.productsWishlist,  // Return the updated wishlist
            message: 'Added to wishlist successfully'
        });
    } catch (error) {
        console.error("Error Adding to Wishlist:", error);
        res.status(500).json({ success: false, message: "Server error during Add to Wishlist" });
    }
};
export const removeProductWishlist = async(req,res) => {
    const {userName , _id} = req.body;
    try{
        const tourist = await Tourist.findOne({ userName });
        if (!tourist) {
            return res.status(404).json({ success: false, message: "Tourist not found" });
        }
        console.log(_id)
        if(!tourist.productsWishlist.includes(_id)){
            return res.status(404).json({ success: false, message: "not in wishlist" });
        }
        const product = await Product.findById(_id);
        console.log(product)
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        tourist.productsWishlist = tourist.productsWishlist.filter(item => item !==_id);
        await tourist.save();
        return res.status(200).json({ success: true, data: tourist.myPreferences, message: 'removed successfully' });
        
    }catch (error) {
        console.error("Error Adding to Wishlist:", error);
        res.status(500).json({ success: false, message: "Server error during Removing from wishlist" });
    }
}

export const getWishlistedProducts = async (req, res) => {
    const { userName } = req.params; // Get userName from request parameters

    try {
        // Find tourist by username and populate productsWishlist
        const tourist = await Tourist.findOne({ userName }).populate('productsWishlist');
        
        if (!tourist) {
            return res.status(404).json({ success: false, message: "Tourist not found" });
        }

        // Find the products in the wishlist
        const wishlistedProducts = await Product.find({ _id: { $in: tourist.productsWishlist } });

        // Return success response with wishlisted products
        return res.status(200).json({ success: true, data: wishlistedProducts });
    } catch (error) {
        console.error("Error Fetching Wishlisted Products:", error);
        res.status(500).json({ success: false, message: "Server error during fetching wishlisted products" });
    }
};