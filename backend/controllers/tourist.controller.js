import Activity from "../models/activity.model.js";
import DeliveryAddress from "../models/deliveryAddress.model.js";
import Itinerary from "../models/itinerary.model.js";
import Notification from "../models/notification.model.js";
import Product from "../models/product.model.js";
import Tourist from "../models/tourist.model.js";
import transportationActivity from "../models/transportationActivity.model.js";
import User from "../models/user.model.js";
//import Order from "../models/order.js";
import { checkAndNotifyUpcomingItinerary } from './notification.controller.js';
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
        const Tourists = await Tourist.find(parsedFilter).sort(parsedSort).populate("notifications").populate("promoCodes").populate("productsWishlist").populate("myBookings").populate("ActivityBookings").populate("itineraryBookings");
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
            return res.status(404).json({ success: false, message: "Itinerary not found" });
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
export const addProductToCart = async (req, res) => {
    const { userName, _id  , quantity} = req.body;
    try {
        const tourist = await Tourist.findOne({ userName });
        if (!tourist) {
            return res.status(404).json({ success: false, message: "Tourist not found" });
        }

        // Check if product is already in Cart
        if (tourist.productsCart.includes(_id)) {
            return res.status(404).json({ success: false, message: "Already in Cart" });
        }

        // Add product to Cart
        tourist.productsCart.push({ productId: _id, quantity: quantity });
        await tourist.save(); // Save changes to the database

        // Send the updated cart back in the response
        return res.status(200).json({
            success: true,
            data: tourist.productsCart,  // Return the updated Cart
            message: 'Added to Cart successfully'
        });
    } catch (error) {
        console.error("Error Adding to Cart:", error);
        res.status(500).json({ success: false, message: "Server error during Add to Cart" });
    }
};
export const removeProductCart = async (req, res) => {
    const { userName, productId } = req.body; // Change `_id` to `productId` as per the new schema
    try {
        // Find tourist by username
        const tourist = await Tourist.findOne({ userName });
        if (!tourist) {
            return res.status(404).json({ success: false, message: "Tourist not found" });
        }

        // Find the product in the cart and check if it exists
        const productIndex = tourist.productsCart.findIndex(item => item.productId.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).json({ success: false, message: "Product not found in cart" });
        }

        // Remove the product from the cart
        tourist.productsCart.splice(productIndex, 1);
        
        // Save the tourist with the updated cart
        await tourist.save();
        return res.status(200).json({ success: true, data: tourist.productsCart, message: 'Product removed successfully' });
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ success: false, message: "Server error during removing product from cart" });
    }
};

export const getCartProducts = async (req, res) => {
    const { userName } = req.params; // Get userName from request parameters

    try {
        // Find tourist by username and include productsCart
        const tourist = await Tourist.findOne({ userName }).populate('productsCart.productId'); // Populate productId
        
        if (!tourist) {
            return res.status(404).json({ success: false, message: "Tourist not found" });
        }

        // Map over productsCart to include both productId and quantity
        const cartProducts = tourist.productsCart.map(item => ({
            productId: item.productId,  // The populated product data
            quantity: item.quantity      // The quantity from the cart
        }));

        // Return success response with cartProducts
        return res.status(200).json({ success: true, data: cartProducts });
    } catch (error) {
        console.error("Error Fetching Cart Products:", error);
        res.status(500).json({ success: false, message: "Server error during fetching cart products" });
    }
};

export const getMyUpcomingItineraries = async (req,res) => {
    const {userName} = req.query;
    try{
        const allItineraries = await Tourist.findOne({ userName }).select('itineraryBookings -_id').populate('itineraryBookings');
        if (!allItineraries) {
            return res.status(404).json({ success: false, message: "Tourist or itineraries not found" });
        }

        // Get the current date
        const now = new Date();

        // Filter itineraries to include only those with upcoming dates
        const upcomingItineraries = allItineraries.itineraryBookings.filter(itinerary => {
            if (itinerary.availableDates && itinerary.availableDates.length > 0) {
                const firstAvailableDate = new Date(itinerary.availableDates[0]);
                return firstAvailableDate > now;
            }
            return false; // Exclude itineraries without valid dates
        });

        res.status(200).json({
            success: true,
            data: upcomingItineraries,
            message: 'Upcoming itineraries fetched successfully',
        });
    } catch (error) {
            console.log("Error getting upcoming itineraries:", error);
            res.status(500).json({ success: false, message: "Server error fetching upcoming itineraries" });
        }
}

export const getMyPastItineraries = async (req,res) => {
    const {userName} = req.query;
    try{
        const allItineraries = await Tourist.findOne({ userName }).select('itineraryBookings -_id').populate('itineraryBookings');
        if (!allItineraries) {
            return res.status(404).json({ success: false, message: "Tourist or itineraries not found" });
        }

        // Get the current date
        const now = new Date();

        // Filter itineraries to include only those with upcoming dates
        const upcomingItineraries = allItineraries.itineraryBookings.filter(itinerary => {
            if (itinerary.availableDates && itinerary.availableDates.length > 0) {
                const firstAvailableDate = new Date(itinerary.availableDates[0]);
                return firstAvailableDate < now;
            }
            return false; // Exclude itineraries without valid dates
        });

        res.status(200).json({
            success: true,
            data: upcomingItineraries,
            message: 'Past itineraries fetched successfully',
        });
    } catch (error) {
            console.log("Error getting past itineraries:", error);
            res.status(500).json({ success: false, message: "Server error fetching past itineraries" });
        }
}

export const getMyUpcomingActivities = async (req,res) => {
    const {userName} = req.query;
    try{
        const allActivities = await Tourist.findOne({ userName }).select('ActivityBookings -_id').populate('ActivityBookings');
        if (!allActivities) {
            return res.status(404).json({ success: false, message: "Tourist or activities not found" });
        }

        // Get the current date
        const now = new Date();

        // Filter itineraries to include only those with upcoming dates
        const upcomingActivities = allActivities.ActivityBookings.filter(activity => {
            if (activity.date) {
                const activityDate = new Date(activity.date);
                return activityDate > now;
            }
            return false; // Exclude itineraries without valid dates
        });

        res.status(200).json({
            success: true,
            data: upcomingActivities,
            message: 'Upcoming activities fetched successfully',
        });
    } catch (error) {
            console.log("Error getting upcoming activities:", error);
            res.status(500).json({ success: false, message: "Server error fetching upcoming activities" });
        }
}
export const getMyPastActivities = async (req,res) => {
    const {userName} = req.query;
    try{
        const allActivities = await Tourist.findOne({ userName }).select('ActivityBookings -_id').populate('ActivityBookings');
        if (!allActivities) {
            return res.status(404).json({ success: false, message: "Tourist or activities not found" });
        }

        // Get the current date
        const now = new Date();

        // Filter itineraries to include only those with upcoming dates
        const upcomingActivities = allActivities.ActivityBookings.filter(activity => {
            if (activity.date) {
                const activityDate = new Date(activity.date);
                return activityDate < now;
            }
            return false; // Exclude itineraries without valid dates
        });

        res.status(200).json({
            success: true,
            data: upcomingActivities,
            message: 'Past activities fetched successfully',
        });
    } catch (error) {
            console.log("Error getting past activities:", error);
            res.status(500).json({ success: false, message: "Server error fetching past activities" });
        }
}

export const getMyOrders = async (req, res) => {
    const { userName } = req.query;

    try {
        // Validate input
        if (!userName) {
            return res.status(400).json({ success: false, message: "User name is required" });
        }

        // Find all orders where the creator matches the userName
        const orders = await Order.find({ creator: userName }).populate('products'); // Populate the products if needed

        if (!orders || orders.length === 0) {
            return res.status(404).json({ success: false, message: "No orders found for this user" });
        }

        res.status(200).json({
            success: true,
            data: orders,
            message: "Orders fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: "Server error fetching orders" });
    }
}

export const getMyCurrentOrders = async (req, res) => {
    const { userName } = req.query;

    try {
        // Validate input
        if (!userName) {
            return res.status(400).json({ success: false, message: "User name is required" });
        }

        // Find all orders where the creator matches the userName and status is "Shipping"
        const currentOrders = await Order.find({ creator: userName, status: "Shipping" }).populate('products');

        if (!currentOrders || currentOrders.length === 0) {
            return res.status(404).json({ success: false, message: "No current orders found for this user" });
        }

        res.status(200).json({
            success: true,
            data: currentOrders,
            message: "Current orders fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching current orders:", error);
        res.status(500).json({ success: false, message: "Server error fetching current orders" });
    }
}
export const getMyPastOrders = async (req, res) => {
    const { userName } = req.query;

    try {
        // Validate input
        if (!userName) {
            return res.status(400).json({ success: false, message: "User name is required" });
        }

        // Find all orders where the creator matches the userName and status is "Shipped"
        const pastOrders = await Order.find({ creator: userName, status: "Shipped" }).populate('products');

        if (!pastOrders || pastOrders.length === 0) {
            return res.status(404).json({ success: false, message: "No past orders found for this user" });
        }

        res.status(200).json({
            success: true,
            data: pastOrders,
            message: "Past orders fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching past orders:", error);
        res.status(500).json({ success: false, message: "Server error fetching past orders" });
    }
}


export const markNotificationAsRead = async (req, res) => {
	try {
		const { userName } = req.body;
		console.log(userName);
		const tourist = await Tourist.findOne({ userName });
		if (!tourist) 
			return res.status(404).json({ success: false, message: "Tourist not found" });
		tourist.notifications.forEach(async (notification) => {
			const notificationData = await Notification.findByIdAndUpdate(notification, { read: true }, { new: true }); 
			console.log(notificationData);
			});
		await tourist.save();
		res.status(200).json({ success: true, message: "Notification marked as read" });
	}
	catch (error) {
		console.error("Error marking notification as read:", error);
		res.status(500).json({ success: false, message: "Server error marking notification as read" });
	}
};

// Handle successful payment
export const handleSuccessfulPaymentForTourist = async (req, res) => {
    try {
        const { username, items, type , amountPaid } = req.body;
        console.log("before checking fields","username:",username,"items:",items,"amount:" ,amountPaid);
      // Validate request body
        if (!username || !items || !type ) {
        return res.status(400).json({ message: "Missing required fields." });
        }

        if (isNaN(amountPaid) || amountPaid <= 0) {
            return res.status(400).json({ success: false, message: "Invalid amount paid" });
        }

      // Find the tourist by username
        const tourist = await Tourist.findOne({ userName: username });
        if (!tourist) {
        return res.status(404).json({ message: "Tourist not found." });
        }

      // Ensure items is an array
        const itemsArray = Array.isArray(items) ? items : [items];

      // Add each item to the touristItems array
        itemsArray.forEach(item => {
            // console.log(item);
            tourist.touristItems.push({ itemData: item.itemData ,quantity:item.quantity ,itemDetails:item.itemDetails, type });
        });

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

      // Save the updated tourist document
        await tourist.save();
        // console.log(tourist);
        res.status(200).json({ message: "Item successfully added to tourist items.", tourist });
    } catch (error) {
        console.error("Error handling successful payment:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};



export const addDeliveryAddress = async (req, res) => {

    console.log('Request body:', req.body); 
  try {
    const {  addressLine1, addressLine2, city, state, zipCode, country, isDefault } = req.body;

    if (!addressLine1 || !city || !state || !zipCode || !country) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newAddress = new DeliveryAddress({
      
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country,
      isDefault: isDefault || false,
    });

    await newAddress.save();
    return res.status(201).json({ message: 'Delivery address added successfully', address: newAddress });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding address', error });
  }
};


export const getAllAddresses = async (req, res) => {
  try {
    const addresses = await DeliveryAddress.find({ userName: req.params.userName });
    return res.status(200).json(addresses);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving addresses', error });
  }
};


export const setActiveAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

  
    await DeliveryAddress.updateMany({ userName: req.body.userName }, { $set: { isDefault: false } });

   
    const updatedAddress = await DeliveryAddress.findByIdAndUpdate(addressId, { isDefault: true }, { new: true });

    return res.status(200).json({ message: 'Default address set successfully', address: updatedAddress });
  } catch (error) {
    return res.status(500).json({ message: 'Error setting active address', error });
  }
};


export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const deletedAddress = await DeliveryAddress.findByIdAndDelete(addressId);

    if (!deletedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }

    return res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting address', error });
  }
};



export const checkUpcomingItineraryNotifications = async (req, res) => {
    try {
        const { userName } = req.params;

    
        const result = await checkAndNotifyUpcomingItinerary(userName);

        if (result.success) {
            return res.status(200).json({ success: true, message: result.message });
        } else {
            return res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error("Error checking upcoming itinerary notifications:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};





