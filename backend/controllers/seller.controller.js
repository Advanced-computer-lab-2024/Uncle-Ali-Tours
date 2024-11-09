import Seller from "../models/seller.model.js";
import User from "../models/user.model.js";
export const uploadProfilePicture = async (req, res) => {
    const { userName } = req.body;
    const profilePicture = req.file.filename; // Save only the filename

    try {
        const updatedSeller = await Seller.findOneAndUpdate(
            { userName },
            { profilePicture },
            { new: true }
        );

        res.status(200).json({ success: true, data: updatedSeller });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const createSeller = async (req, res) => {
    const sellerData = req.body;

    if (!sellerData.userName || !sellerData.password|| !sellerData.email) {
        return res.status(400).json({ success: false, message: "All fields are required'" });
    }

    const duplicat = [...await User.find({userName: sellerData.userName}),...await User.find({email: sellerData.email})];
    if(duplicat.length > 0) {
        return res.status(400).json({success: false, message: 'User already exists' });
        
    }

    const newSeller = new Seller(sellerData);

    try {
        await newSeller.save();
        res.status(201).json({ success: true, message: "Seller account created successfully", data: newSeller });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const getSeller = async(req,res) => {
    const { filter, sort } = req.query;
    let parsedFilter = filter ? JSON.parse(filter) : {};
    let parsedSort = sort ? JSON.parse(sort) : {};
    try {
        const Sellers = await Seller.find(parsedFilter).sort(parsedSort);

        res.status(200).json({success:true, data: Sellers});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateSeller = async (req,res) => {
    const {userName,newSeller} = req.body;



    if(newSeller.userName){
        return res.status(400).json({success:false, message: 'user name is not editable'});
    }
  
    if(newSeller.email){
        if( !newSeller.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ){
            return res.status(400).json({success:false, message: 'email format is wrong' });
        }
    }
    if(newSeller.mobileNumber){
        if((!new RegExp(/^010\d{8}$/).test(newSeller.mobileNumber.toString()) & !new RegExp(/^011\d{8}$/).test(newSeller.mobileNumber.toString()) & !new RegExp(/^012\d{8}$/).test(newSeller.mobileNumber.toString()) & !new RegExp(/^015\d{8}$/).test(newSeller.mobileNumber.toString()))){
            return res.status(400).json({success:false, message: 'mobile number format is wrong'});
        }
    }
    
    try {
        const sellerExists = await Seller.exists({userName});
        if(!sellerExists){
            return res.status(404).json({ success: false, message: "seller not found" });
        }
        const updatedSeller = await Seller.findOneAndUpdate({ userName: userName }, newSeller, { new: true });
        res.status(200).json({success:true, data:  updatedSeller});
    }
    catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
}




export const deleteSeller = async (req, res) => {
    const { userName } = req.body; 

    try {
        const sellerExists = await Seller.exists({ userName: userName });

        if (!sellerExists) {
            return res.status(404).json({ success: false, message: "Seller not found" });
        }

        await Seller.findOneAndDelete({ userName: userName });
        res.json({ success: true, message: "Seller profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
