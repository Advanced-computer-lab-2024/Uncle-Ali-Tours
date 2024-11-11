import transportationActivity from "../models/transportationActivity.model.js";

export const createActivity = async(req, res) => {
    const activity = req.body;
    const newTransActivity= new transportationActivity(activity);

    if(!activity.name || !activity.date || !activity.time || !activity.pickUpLocation|| !activity.dropOfLocation || !activity.price || activity.bookingOpen==undefined || !activity.creator ){
        res.status(400).json({success: false, message: "please fill all fields"});
        return;
    }

    const activityExists = await transportationActivity.exists({
        name: activity.name,
        date: activity.date,
        time: activity.time,
        pickUplocation: activity.pickUplocation,
        dropOfLocation: activity.dropOfLocation,
        price: activity.price,
        specialDiscounts: activity.specialDiscounts || undefined,
        bookingOpen: activity.bookingOpen,
        creator: activity.creator
    });

    if (activityExists) {
        res.status(409).json({ success: false, message: "Activity already exists" });
        return;
    }


    try{
        await newTransActivity.save();
        res.status(201).json({success:true ,data:newTransActivity});
    }
    catch(error){
        res.status(500).json({success:false , message:error.message});
    }
}

export const getActivity = async(req, res) => {
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
        const activities = await transportationActivity.find(parsedFilter).sort(parsedSort);
        res.status(200).json({success:true, data: activities});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const deleteActivity = async(req, res) => {
    const { id } = req.body;
    try {
        const activityExists = await transportationActivity.exists({ _id: id });

        if (!activityExists) {
            return res.status(404).json({ success: false, message: "Activity not found" });
        }

        await transportationActivity.findOneAndDelete({ _id: id });
        res.json({success:true, message: 'activity deleted successfully' });
    } catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
}

export const updateActivity = async (req, res) => {
    const { id, newActivity } = req.body;
    try {
        const activityExists = await transportationActivity.exists({ _id: id });

        if (!activityExists) {
            return res.status(404).json({ success: false, message: "Activity not found" });
        }

        const updatedActivity = await transportationActivity.findByIdAndUpdate({ _id: id }, newActivity, { new: true , runValidators: true });
        res.status(200).json({success:true, data:  updatedActivity});
    }
    catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
}
