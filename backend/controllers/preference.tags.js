import mongoose from "mongoose";
import PreferenceTags from "../models/preference.tags.js";

export const createTag = async (req, res) => {

    const tag = req.body;
    const duplicate = await PreferenceTags.find({name: tag.name});
    
    if(duplicate.length > 0) 
        return res.status(400).json({success: false, message: 'Tag already exists' });

    const newTag = new PreferenceTags(tag);

    try {
        await  newTag.save();
        return res.status(201).json({success: true, message: 'Tag created successfully',})
    } catch (error) {
        console.error("Error in creating tag", error.message);
        return res.status(500).json({success: false, message: 'Error in creating tag'})
        
    }
  
}

export const deleteTag = async (req, res) => {
    const tagName = req.params.tag;
  
    const tag = await PreferenceTags.findOne({ name: tagName });
  
    if (!tag) {
      return res.status(404).json({ success: false, message: 'Tag does not exist' });
    }
  
    try {
      await tag.remove();
      return res.json({ success: true, message: 'Tag deleted successfully' });
    } catch (error) {  console.error("Error in deleting tag", error.message);
        return res.status(500).json({ success: false, message: 'Error in deleting tag' });
      }

};

export const updateTag = async (req, res) => {
    const tagName = req.params.tag;
    const updatedTag = req.body;
  
    const tag = await PreferenceTags.findOne({ name: tagName });
  
    if (!tag) {
      return res.status(404).json({ success: false, message: 'Tag does not exist' });
    }
  
    try {
      await PreferenceTags.findByIdAndUpdate(tag._id, updatedTag, { new: true });
      return res.json({ success: true, message: 'Tag updated successfully' });
    } catch (error) {
      console.error("Error in updating tag", error.message);
      return res.status(500).json({ success: false, message: 'Error in updating tag' });
    }
  };

  export const getTags = async (req, res) => {
    const { filter, sort } = req.query;
    let parsedFilter = filter ? JSON.parse(filter) : {};
    let parsedSort = sort ? JSON.parse(sort) : {};
  
    try {
      const tags = await PreferenceTags.find(parsedFilter).sort(parsedSort);
      res.status(200).json({ success: true, data: tags });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

