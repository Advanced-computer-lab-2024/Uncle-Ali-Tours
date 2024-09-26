import User from '../models/user.model.js';
import mongoose from 'mongoose';

export const loginUser = async (req, res) => {
    const credentials = req.body;
    if(!credentials.userName || !credentials.password) {
        return res.status(400).json({ message: 'No credentials sent' });}
    try {
        const user = await User.find(credentials);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createUser = async (req, res) => {
    const user = req.body;
    if(!user.userName || !user.email || !user.password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const newUser = new User(user);
    try {
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({"message":'No user with that id'});
    }
    try {
        await User.findByIdAndDelete(id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
    
}