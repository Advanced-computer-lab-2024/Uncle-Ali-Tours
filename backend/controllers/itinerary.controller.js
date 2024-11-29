import Itinerary from "../models/itinerary.model.js";

// Create a new itinerary
export const createItinerary = async (req, res) => {
    const itinerary = req.body;
    const newItinerary = new Itinerary(itinerary);
    let activityInfo = 0;

    if (!itinerary.activities || !itinerary.pickupLocation || !itinerary.dropoffLocation || !itinerary.tourLocations || !itinerary.language || !itinerary.price || !itinerary.availableDates || !itinerary.availableTimes || !itinerary.accessibility || !itinerary.creator) {
        res.status(400).json({ success: false, message: "Please fill all fields" });
        return;
    }

    const itineraryExists = await Itinerary.exists({
        "activities": itinerary.activities,
        "pickupLocation": itinerary.pickupLocation,
        "dropoffLocation": itinerary.dropoffLocation,
        tourLocations: { $all: itinerary.tourLocations },
        language: itinerary.language,
        price: itinerary.price,
        availableDates: { $all: itinerary.availableDates },
        availableTimes: { $all: itinerary.availableTimes },
        accessibility: itinerary.accessibility,
        creator: itinerary.creator
    });

    if (itineraryExists) {
        res.status(409).json({ success: false, message: "Itinerary already exists" });
        return;
    }

    try {
        itinerary.activities.forEach(activity => {
            if (!activity.name || !activity.duration) {
                activityInfo++;
            }
        });
        let tempDates = [];
        itinerary.availableDates.forEach(date => {
            const parsedDate = Date.parse(date);
            if (isNaN(parsedDate)) {
                res.status(400).json({ success: false, message: `Invalid date format: ${date}` });
                return;
            }
            tempDates.push(parsedDate);
        });
        newItinerary.availableDates = tempDates;

        if (activityInfo != 0) {
            activityInfo = 0;
            res.status(400).json({ success: false, message: "Please fill the activity info" });
            return;
        }

        await newItinerary.save();
        res.status(201).json({ success: true, data: newItinerary });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get itineraries with filters and sorting
export const getItinerary = async (req, res) => {
    const { filter, sort, minPrice, maxPrice } = req.query;
    let parsedFilter = filter ? JSON.parse(filter) : {};
    let parsedSort = sort ? JSON.parse(sort) : {};

    if (minPrice || maxPrice) {
        parsedFilter.price = {};

        if (minPrice) {
            parsedFilter.price.$gte = parseFloat(minPrice);
        }

        if (maxPrice) {
            parsedFilter.price.$lte = parseFloat(maxPrice);
        }
    }

    try {
        const itineraries = await Itinerary.find(parsedFilter).sort(parsedSort);
        res.status(200).json({ success: true, data: itineraries });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getItineraryById = async (req, res) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);
        
        if (!itinerary) {
            return res.status(404).json({ success: false, message: "Itinerary not found" });
        }

        res.status(200).json({ success: true, data: itinerary });
        return itinerary;
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Delete an itinerary
export const deleteItinerary = async (req, res) => {
    const { _id } = req.body;
    try {
        const itineraryExists = await Itinerary.exists({ _id: _id });

        if (!itineraryExists) {
            return res.status(404).json({ success: false, message: "Itinerary not found" });
        }

        await Itinerary.findOneAndDelete({ _id: _id });
        res.json({ success: true, message: 'Itinerary deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update an itinerary
export const updateItinerary = async (req, res) => {
    const { id, newItinerary } = req.body;
    try {
        const itineraryExists = await Itinerary.exists({ _id: id });

        if (!itineraryExists) {
            return res.status(404).json({ success: false, message: "Itinerary not found" });
        }

        const updatedItinerary = await Itinerary.findByIdAndUpdate(id, newItinerary, { new: true, runValidators: true });

        res.status(200).json({ success: true, data: updatedItinerary });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create a review for an itinerary
export const createItineraryReview = async (req, res) => {
    const { rating, comment, name } = req.body;
    const itinerary = await Itinerary.findById(req.params.id);

    if (itinerary) {
        const review = {
            rating: Number(rating),
            comment,
            name,
        };

        itinerary.reviews.push(review);
        itinerary.numReviews = itinerary.reviews.length;
        itinerary.rating = itinerary.reviews.reduce((acc, item) => item.rating + acc, 0) / itinerary.reviews.length;
        await itinerary.save();
        res.status(201).json({
            success: true,
            message: 'Review added',
            review,
            numReviews: itinerary.numReviews,
            rating: itinerary.rating,
        });
    } else {
        res.status(404).json({ success: false, message: 'Itinerary not found' });
    }
};

// Activate an itinerary
export const activateItinerary = async (req, res) => {
    const { id } = req.body;

    try {
        const itinerary = await Itinerary.findById(id);

        if (!itinerary) {
            return res.status(404).json({ success: false, message: "Itinerary not found" });
        }

        if (itinerary.isActivated) {
            return res.status(400).json({ success: false, message: "Itinerary is already activated" });
        }

        itinerary.isActivated = true;
        await itinerary.save();

        res.status(200).json({ success: true, message: "Itinerary activated", data: itinerary });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Deactivate an itinerary
export const deactivateItinerary = async (req, res) => {
    const { id } = req.body;

    try {
        const itinerary = await Itinerary.findById(id);

        if (!itinerary) {
            return res.status(404).json({ success: false, message: "Itinerary not found" });
        }

        if (!itinerary.isActivated) {
            return res.status(400).json({ success: false, message: "Itinerary is already deactivated" });
        }

        if (itinerary.numberOfBookings === 0) {
            return res.status(400).json({ success: false, message: "Cannot deactivate itinerary; itinerary has no bookings" });
        }

        itinerary.isActivated = false;
        await itinerary.save();

        res.status(200).json({ success: true, message: "Itinerary deactivated", data: itinerary });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Book an itinerary
export const bookItinerary = async (req, res) => {
    try {
        const { id } = req.params;
        const itinerary = await Itinerary.findByIdAndUpdate(id, { isBooked: true }, { new: true });

        if (!itinerary) {
            return res.status(404).json({ success: false, message: 'Itinerary not found' });
        }

        res.json({ success: true, message: 'Itinerary booked successfully', itinerary });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Flag an itinerary as appropriate or inappropriate
export const flagItinerary = async (req, res) => {
    const { id, isAppropriate } = req.body;  // Expecting an ID and a boolean flag for appropriateness

    try {
        const itinerary = await Itinerary.findById(id);

        if (!itinerary) {
            return res.status(404).json({ success: false, message: "Itinerary not found" });
        }

        // Update the isAppropriate flag in the itinerary
        itinerary.isAppropriate = isAppropriate;

        // Save the updated itinerary
        await itinerary.save();

        res.status(200).json({
            success: true,
            message: isAppropriate ? "Itinerary marked as appropriate" : "Itinerary marked as inappropriate",
            data: itinerary
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

