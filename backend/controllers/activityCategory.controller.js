import ActivityCategory from "../models/activityCategory.model.js";
import mongoose from "mongoose";

export const getCategories = async (req, res) => {
    const { filter, sort } = req.body;  //{ filter: {"name": "test"}, sort: {"age" : 1} }
    try {
        const categories = await ActivityCategory.find(filter).sort(sort);
        res.status(200).json({success:true, data: categories});
    } catch (error) {
        res.status(404).json({success: false, message: error.message });
    }
}

export const createCategory = async (req, res) => {
    const category = req.body;
    if(!category.name) {
        return res.status(400).json({success:false, message: 'Name is required' });
    }
    const duplicate = await ActivityCategory.find({name: category.name});
    if(duplicate.length > 0) {
        return res.status(400).json({success:false, message: 'Category already exists' });
    }
    const newCategory = new ActivityCategory(category);
    try {
        await newCategory.save();
        res.status(201).json({success:true, data: newCategory});
    } catch (error) {
        res.status(409).json({success:false, message: error.message });
    }
}

export const deleteCategory = async (req, res) => {
    const { name } = req.body;
    if(!name) {
        return res.status(400).json({success:false, message: 'Name is required' });
    }
    
    const category = await ActivityCategory.find({name: name});
    if(category.length === 0) {
        return res.status(404).json({success:false, message: 'Category does not exist' });
    }

    try {
        await ActivityCategory.findOneAndDelete({ name: name });
        res.json({success:true, message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
}

export const updateCategory = async (req, res) => {
    const { name, newCategory } = req.body;
    try {
        const updatedCategory = await ActivityCategory.findOneAndUpdate({ name: name }, newCategory, { new: true });
        res.json({success:true, data:  updatedCategory});
    }
    catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
}