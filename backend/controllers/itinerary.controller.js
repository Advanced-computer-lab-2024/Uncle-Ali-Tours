import Itinerary from "../models/itinerary.model.js";

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
    "pickupLocation.coordinates": itinerary.pickupLocation.coordinates,
    "dropoffLocation.coordinates": itinerary.dropoffLocation.coordinates,
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
        
        if(activityInfo!=0){
            activityInfo=0;
            res.status(400).json({success: false, message: "please fill the activity info"});
            return;
        }
    
        await newItinerary.save();
        res.status(201).json({success:true ,data:newItinerary});
    }
    catch(error){
        res.status(500).json({success:false , message:"server error"});
    }
}

export const getItinerary = async(req, res) => {
    const { filter, sort } = req.query;
    let parsedFilter = filter ? JSON.parse(filter) : {};
    let parsedSort = sort ? JSON.parse(sort) : {};
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