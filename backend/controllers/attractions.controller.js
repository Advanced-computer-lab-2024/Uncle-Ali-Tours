import mongoose from "mongoose";
import Attractions from "../models/attraction.model.js";

export const createAttraction = async (req, res) =>{

    try {
        const { name, description, pictures, location, openingHours, ticketPrices, author } = req.body;
    
        if (!name || !description || !pictures || !location || !openingHours || !ticketPrices || !author) {
          return res.status(400).json({ success: false, message: 'All fields are required' });
        }
    
        const existingAttraction = await Attractions.findOne({ name });
        if (existingAttraction) {
          return res.status(400).json({ success: false, message: 'Attraction with this name already exists' });
        }
    
        const attraction = new Attractions({ name, description, pictures, location, openingHours, ticketPrices, author });
        await attraction.save();
    
        res.json({ success: true, message: 'Attraction created successfully' });
      } catch (error) {
        console.error("Error in creating Attraction", error.message);
        console.log(error);
        res.status(500).json({ success: false, message: 'Error in creating Attraction' });
      }

}