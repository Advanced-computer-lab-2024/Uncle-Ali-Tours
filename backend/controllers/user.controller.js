import User from '../models/user.model.js';
import mongoose from 'mongoose';

export const loginUser = async (req, res) => {
    const credentials = req.body;
    try {
        const user = await User.find(credentials);
        if(user.length === 0) {
            return res.status(404).json({success: false, message: 'Wrong credentials' });
        }
        res.json({success: user.length > 0, data: user});
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
}


export const createUser = async (req, res) => {
    const user = req.body;
    if(!user.userName || !user.password || !user.type || !user.email) {
        return res.status(400).json({success:false, message: 'All fields are required' });
        
    }
    const duplicat = await User.find({userName: user.userName});
    if(duplicat.length > 0) {
        return res.status(400).json({success: false, message: 'UserName already exists' });
        
    }
    const newUser = new User(user);
    try {
        await newUser.save();
        return res.status(201).json({success: true, data: newUser});
    } catch (error) {
        res.status(400).json({success: false, message: error.message });
    }
}

export const deleteUser = async (req, res) => {
    const { userName } = req.body;

    if(!userName) {
        return res.status(400).json({success:false, message: 'userName is required' });
        
    }
    
    const user = await User.find({userName: userName});
    if(user.length === 0) {
        return res.status(404).json({success:false, message: 'User does not exist' });
    }

    try {
        await User.findOneAndDelete({ userName: userName });
        res.json({success:true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
}

export const changePassword = async (req, res) => {
    const { userName, oldPassword, newPassword, forgot, email } = req.body;
    try {
    if(forgot) {
        await User.findOneAndUpdate({ email: email }, { password: newPassword });
        return res.json({success:true, message: 'Password changed successfully' });
    }

    if(!userName || !oldPassword || !newPassword) {
        return res.status(400).json({success:false, message: 'All fields are required' });  
    }
    const user = await User.find({userName: userName, password: oldPassword});
    if(user.length === 0) {
        return res.status(404).json({success:false, message: 'Wrong credentials' });
    }
    
        await User.findOneAndUpdate({ userName: userName }, { password: newPassword });
        res.json({success:true, message: 'Password changed successfully' });
    }
    catch (error) {
        return res.status(500).json({success:false, message: error.message });
    }
}

export const getUsersNumber = async (req, res) => {
    try {
        const users = await User.find({type: {$ne: 'admin'}});
        res.json({success:true, data: users.length });
    } catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
}

export const getNewUsersLastMonth = async (req, res) => {
    try {
        const users = await User.find({type:{$ne: "admin"},createdAt: {$gte: new Date(new Date().setMonth(new Date().getMonth() - 1))}});
        res.json({success:true, data: users.length });
    } catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
}


