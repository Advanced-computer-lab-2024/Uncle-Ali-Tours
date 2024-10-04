import Activity from "../models/activity.model.js";

export const createActivity = async(req, res) => {
    const activity = req.body;
    const newActivity= new Activity(activity);
    try{
        await newActivity.save();
        res.status(201).json({success:true ,data:newActivity});
    }
    catch(error){
        res.status(500).json({success:false , message:"server error"});
    }
}

export const getActivity = async(req, res) => {
    const { filter, sort } = req.query;
    let parsedFilter = filter ? JSON.parse(filter) : {};
    let parsedSort = sort ? JSON.parse(sort) : {};
    try {
        const activities = await Activity.find(parsedFilter).sort(parsedSort);
        res.status(200).json({success:true, data: activities});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const deleteActivity = async(req, res) => {
    const { name } = req.body;
    try {
        const activityExists = await Activity.exists({ name: name });

        if (!activityExists) {
            return res.status(404).json({ success: false, message: "Activity not found" });
        }

        await Activity.findOneAndDelete({ name: name });
        res.json({success:true, message: 'activity deleted successfully' });
    } catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
}

export const updateActivity = async (req, res) => {
    const { name, newActivity } = req.body;
    try {
        const activityExists = await Activity.exists({ name: name });

        if (!activityExists) {
            return res.status(404).json({ success: false, message: "Activity not found" });
        }

        const updatedActivity = await Activity.findOneAndUpdate({ name: name }, newActivity, { new: true });
        res.status(200).json({success:true, data:  updatedActivity});
    }
    catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
}