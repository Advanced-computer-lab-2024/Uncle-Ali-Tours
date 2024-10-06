import Activity from "../models/activity.model.js";

export const createActivity = async(req, res) => {
    const activity = req.body;
    const newActivity= new Activity(activity);

    if(!activity.name || !activity.date || !activity.time || !activity.location || !activity.price || !activity.category || activity.bookingOpen==undefined || !activity.creator ){
        res.status(400).json({success: false, message: "please fill all fields"});
    return;
    }

    const activityExists = await Activity.exists({
        name: activity.name,
        date: activity.date,
        time: activity.time,
        "location.coordinates": activity.location.coordinates,
        price: activity.price,
        category: activity.category,
        tags: activity.tags || undefined,
        specialDiscounts: activity.specialDiscounts || undefined,
        bookingOpen: activity.bookingOpen,
        creator: activity.creator
    });

    if (activityExists) {
        res.status(409).json({ success: false, message: "Activity already exists" });
        return;
    }


    try{
        await newActivity.save();
        res.status(201).json({success:true ,data:newActivity});
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
        const activities = await Activity.find(parsedFilter).sort(parsedSort);
        res.status(200).json({success:true, data: activities});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const deleteActivity = async(req, res) => {
    const { id } = req.body;
    try {
        const activityExists = await Activity.exists({ _id: id });

        if (!activityExists) {
            return res.status(404).json({ success: false, message: "Activity not found" });
        }

        await Activity.findOneAndDelete({ _id: id });
        res.json({success:true, message: 'activity deleted successfully' });
    } catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
}

export const updateActivity = async (req, res) => {
    const { id, newActivity } = req.body;
    try {
        const activityExists = await Activity.exists({ _id: id });

        if (!activityExists) {
            return res.status(404).json({ success: false, message: "Activity not found" });
        }

        const updatedActivity = await Activity.findByIdAndUpdate({ _id: id }, newActivity, { new: true , runValidators: true });
        res.status(200).json({success:true, data:  updatedActivity});
    }
    catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
}