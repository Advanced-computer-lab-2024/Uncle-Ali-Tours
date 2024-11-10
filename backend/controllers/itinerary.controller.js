import Itinerary from "../models/itinerary.model.js";
import asyncHandler from 'express-async-handler';

export const createItinerary = async(req, res) => {
    const itinerary = req.body;
    const newItinerary= new Itinerary(itinerary);
    let activityInfo =0;
   
if(!itinerary.activities || !itinerary.pickupLocation || !itinerary.dropoffLocation || !itinerary.tourLocations || !itinerary.language || !itinerary.price || !itinerary.availableDates || !itinerary.availableTimes || !itinerary.accessibility || !itinerary.creator ){
    res.status(400).json({success: false, message: "please fill all fields"});
    return;
}

const itineraryExists = await Itinerary.exists({
    "activities": itinerary.activities,
    "pickupLocation": itinerary.pickupLocation,
    "dropoffLocation": itinerary.dropoffLocation,
    tourLocations: { $all: itinerary.tourLocations },
    language: itinerary.language,
    price: itinerary.price,
    availableDates: { $all: itinerary.availableDates },
    availableTimes: { $all: itinerary.availableTimes },
    accessibility: itinerary.accessibility,
    creator: itinerary.creator
});

if (itineraryExists) {
    res.status(409).json({ success: false, message: "Itinerary already exists" });
    return;
}

    try{

        itinerary.activities.forEach( activity => {
            if(!activity.name || !activity.duration){
                activityInfo++;
            }
        });
        let tempDates = [];
itinerary.availableDates.forEach(date => {
    const parsedDate = Date.parse(date);
    if (isNaN(parsedDate)) {
        res.status(400).json({ success: false, message: `Invalid date format: ${date}` });
        return;
    }
    tempDates.push(parsedDate);
});
newItinerary.availableDates = tempDates;
        
        if(activityInfo!=0){
            activityInfo=0;
            res.status(400).json({success: false, message: "please fill the activity info"});
            return;
        }
    
        await newItinerary.save();
        res.status(201).json({success:true ,data:newItinerary});
    }
    catch(error){
        res.status(500).json({success:false , message:error.message});
    }
}

export const getItinerary = async(req, res) => {
    const { filter, sort, minPrice, maxPrice } = req.query;
    let parsedFilter = filter ? JSON.parse(filter) : {};
    let parsedSort = sort ? JSON.parse(sort) : {};

    if (minPrice || maxPrice) {
        parsedFilter.price = {};

        if (minPrice) {
            parsedFilter.price.$gte = parseFloat(minPrice);
        }

        if (maxPrice) {
            parsedFilter.price.$lte = parseFloat(maxPrice);
        }
    }

    try {
        const itineraries = await Itinerary.find(parsedFilter).sort(parsedSort);
        res.status(200).json({success:true, data: itineraries});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const deleteItinerary = async(req, res) => {
    const { _id } = req.body;
    try {
        const itineraryExists = await Itinerary.exists({ _id: _id });

        if (!itineraryExists) {
            return res.status(404).json({ success: false, message: "itinerary not found" });
        }

        await Itinerary.findOneAndDelete({ _id: _id });
        res.json({success:true, message: 'itinerary deleted successfully' });
    } catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
}

export const updateItinerary = async (req, res) => {
    const { id, newItinerary } = req.body;
    try {
        const itineraryExists = await Itinerary.exists({ _id: id });

        if (!itineraryExists) {
            return res.status(404).json({ success: false, message: "Itinerary not found" });
        }

        const updatedItinerary = await Itinerary.findByIdAndUpdate(id, newItinerary, { new: true,  runValidators: true });
    
        res.status(200).json({success:true, data:  updatedItinerary});
    }
    catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
}


export const createItineraryReview = async (req, res) => {
    const { rating, comment,name  } = req.body;
    console.log('Received rating:', rating);
    console.log('Received comment:', comment);
    console.log('Received username:', name);
    const itinerary = await Itinerary.findById(req.params.id);
    console.log('Received itinerary:', itinerary);
    if (itinerary) {
        // const alreadyReviewed = itinerary.reviews.find(
        //     (r) => r.user.toString() === name // Use 'name' which is defined
        // );
        // if (alreadyReviewed) {
        //     res.status(400);
        //     throw new Error('Itinerary already reviewed');
        // }
        const review = {
            rating: Number(rating),
            comment,
            name,  
        };
        console.log('Received review:', review);
        itinerary.reviews.push(review);
        itinerary.numReviews = itinerary.reviews.length;
        itinerary.rating =
            itinerary.reviews.reduce((acc, item) => item.rating + acc, 0) /
            itinerary.reviews.length;
        await itinerary.save();

        res.status(201).json({
            success: true,
            message: 'Review added',
            review,
            numReviews: itinerary.numReviews,
            rating: itinerary.rating,
        });
    } else {
        res.status(404);
        throw new Error('Itinerary not found');
    }
};
// Add to itinerary.controller.js

export const activateItinerary = async (req, res) => {
    const { id } = req.body;

    try {
        const itinerary = await Itinerary.findById(id);
        console.log(req.body);
        if (!itinerary) {
            return res.status(404).json({ success: false, message: "Itinerary not found" });
        }

        if (itinerary.isActivated) {
            return res.status(400).json({ success: false, message: "Itinerary is already activated" });
        }

        itinerary.isActivated = true;
        await itinerary.save();

        res.status(200).json({ success: true, message: "Itinerary activated", data: itinerary });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        console.log(error.message);
    }
};

export const deactivateItinerary = async (req, res) => {
    const { id } = req.body;

    try {
        const itinerary = await Itinerary.findById(id);
        console.log(req.body);
        if (!itinerary) {
            console.log("Itinerary not found")
            return res.status(404).json({ success: false, message: "Itinerary not found" });
            
        }

        if (!itinerary.isActivated) {
            console.log("Itinerary is already deactivated")
            return res.status(400).json({ success: false, message: "Itinerary is already deactivated" });
        }

        if (itinerary.numberOfBookings === 0) {
            console.log("Cannot deactiv")
            return res.status(400).json({ success: false, message: "Cannot deactivate itinerary; itinerary has no bookings" });
        }

        itinerary.isActivated = false;
        await itinerary.save();

        res.status(200).json({ success: true, message: "Itinerary deactivated", data: itinerary });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        console.log(error.message);
    }
};
