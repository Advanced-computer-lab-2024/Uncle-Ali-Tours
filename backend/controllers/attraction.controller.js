import Attraction from '../models/attraction.model.js';

export const createAttraction = async (req, res) => {
  try {
    const { name, description, pictures, location, openingHours, ticketPrices } = req.body;

    if (!name || !description || !pictures || !location || !openingHours || !ticketPrices) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!location.type || !location.coordinates || location.type !== 'Point' || location.coordinates.length !== 2) {
      return res.status(400).json({ success: false, message: 'Invalid location format' });
    }

    if (!ticketPrices.foreigner || !ticketPrices.native || !ticketPrices.student) {
      return res.status(400).json({ success: false, message: 'Invalid ticket prices format' });
    }

    const newAttraction = new Attraction({name,description,pictures,location,openingHours,ticketPrices, });

    await newAttraction.save();

    res.status(201).json({ success: true, data: newAttraction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAttraction = async(req,res) => {
    const { filter, sort } = req.query;
    let parsedFilter = filter ? JSON.parse(filter) : {};
    let parsedSort = sort ? JSON.parse(sort) : {};
    try {
        const Attractionss = await Attraction.find(parsedFilter).sort(parsedSort);
        res.status(200).json({success:true, data: Attractionss});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const deleteAttraction = async (req, res) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Attraction name is required' });
    }
    try {
      const deletedAttraction = await Attraction.findOneAndDelete({ name });
      if (deletedAttraction) {
        res.json({ success: true, message: 'Attraction deleted successfully', data: deletedAttraction });
      } else {
        res.status(404).json({ success: false, message: 'Attraction not found' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  export const updateAttraction = async (req, res) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Attraction name is required' });
    }
    try {
      const updatedAttraction = await Attraction.findOneAndUpdate({ name }, req.body, { new: true });
      if (updatedAttraction) {
        res.json({ success: true, message: 'Attraction updated successfully', data: updatedAttraction });
      } else {
        res.status(404).json({ success: false, message: 'Attraction not found' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };