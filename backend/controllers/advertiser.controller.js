import Advertiser from "../models/advertiser.model.js"; 
import Activity from "../models/activity.model.js";
import User from "../models/user.model.js";
export const createAdvertiser = async (req, res) => {
    const advertiser = req.body;
    const newAdvertiser = new Advertiser(advertiser);

    if (!advertiser.userName || !advertiser.password|| !advertiser.email) {
        return res.status(400).json({ success: false, message: "All fields are required'" });
    }

    const duplicat = [...await User.find({userName: advertiser.userName}),...await User.find({email: advertiser.email})];
    if(duplicat.length > 0) {
        return res.status(400).json({success: false, message: 'User already exists' });
        
    }

    try {
        await newAdvertiser.save();
        res.status(201).json({ success: true, message: "Advertiser account created successfully", data: newAdvertiser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAdvertiser = async(req,res) => {
    const { filter, sort } = req.query;
    let parsedFilter = filter ? JSON.parse(filter) : {};
    let parsedSort = sort ? JSON.parse(sort) : {};
    try {
        const Advertisers = await Advertiser.find(parsedFilter).sort(parsedSort);

        res.status(200).json({success:true, data: Advertisers});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateAdvertiser = async (req,res) => {
    const {userName,newAdvertiser} = req.body;



    if(newAdvertiser.userName){
        return res.status(400).json({success:false, message: 'user name is not editable'});
    }
  
    if(newAdvertiser.email){
        if( !newAdvertiser.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ){
            return res.status(400).json({success:false, message: 'email format is wrong' });
        }
    }
    if(newAdvertiser.mobileNumber){
        if((!new RegExp(/^010\d{8}$/).test(newAdvertiser.mobileNumber.toString()) & !new RegExp(/^011\d{8}$/).test(newAdvertiser.mobileNumber.toString()) & !new RegExp(/^012\d{8}$/).test(newAdvertiser.mobileNumber.toString()) & !new RegExp(/^015\d{8}$/).test(newAdvertiser.mobileNumber.toString()))){
            return res.status(400).json({success:false, message: 'mobile number format is wrong'});
        }
    }
    
    try {
        const AdvertiserExists = await Advertiser.exists({username: userName});
        if(!AdvertiserExists){
            return res.status(404).json({ success: false, message: "Advertiser not found" });
        }
        const updatedAdvertiser = await Advertiser.findOneAndUpdate({ username: userName }, newAdvertiser, { new: true });
        res.status(200).json({success:true, data:  updatedAdvertiser});
    }
    catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
}



export const deleteAdvertiser = async (req, res) => {
    const { userName } = req.body; 

    try {
        const AdvertiserExists = await Advertiser.exists({ userName: userName });

        if (!AdvertiserExists) {
            return res.status(404).json({ success: false, message: "Advertiser not found" });
        }
        const activeActivities = await Activity.findOne({ creator: userName, numberOfBookings: { $ne: 0 } });
        if (activeActivities) {
            return res.status(400).json({success: false,message: "Cannot delete advertiser with active bookings in activities"});
        }
        await Advertiser.findOneAndDelete({ userName: userName });
        await Activity.updateMany(
            { creator: userName },
            { $set: { isActivated: false } }
        );
        res.json({ success: true, message: "Advertiser profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
