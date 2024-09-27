import User from '../models/user.model.js';
import mongoose from 'mongoose';

export const loginUser = async (req, res) => {
    const credentials = req.body;
    // if(!credentials.userName || !credentials.password) {
    //     return res.status(400).json({success: false, message: 'No credentials sent' });}
    try {
        const user = await User.find(credentials);
        res.json({success: user.length > 0, data: user});
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
}

export const createUser = async (req, res) => {
    const user = req.body;
    if(!user.userName || !user.password || !user.type) {
        console.log('All fields are required');
        return res.status(400).json({success:false, message: 'All fields are required' });
        
    }
    const duplicat = await User.find({userName: user.userName});
    if(duplicat.length > 0) {
        console.log('UserName already exists');
        return res.status(400).json({success: false, message: 'UserName already exists' });
        
    }
    const newUser = new User(user);
    try {
        await newUser.save();
        console.log('User created successfully');
        return res.status(201).json({success: true, data: newUser});
    } catch (error) {
        res.status(409).json({success: false, message: error.message });
        return console.log(error.message);
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success: false, message:'No user with that id'});
    }
    try {
        await User.findByIdAndDelete(id);
        res.json({success:true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({success:false, message: error.message });
        
    }
    
}