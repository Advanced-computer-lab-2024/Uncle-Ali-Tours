import Amadeus from 'amadeus';
import HotelBooking from '../models/hotelBooking.model.js';

const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_API_KEY,
    clientSecret: process.env.AMADEUS_API_SECRET
});

async function getAccessToken() {
    // If token has expired or doesn’t exist, fetch a new one
    if (!amadeus.client.accessToken || Date.now() >= amadeus.client.accessToken.expiresAt) {
        const tokenResponse = await amadeus.client.getAccessToken();
        amadeus.client.setAccessToken(tokenResponse.data.access_token);
    }
    return amadeus.client.accessToken;
}

// console.log("Amadeus Initialized:", amadeus);

export const createHotelBooking = async (req, res) => {
    const hotelBooking = req.body;
    const newHotelBooking = new HotelBooking(hotelBooking);
    try {
        await newHotelBooking.save();
        res.status(201).json(newHotelBooking);
    } catch (error) {
        console.error("Error in creating Hotel Booking", error.message);
        res.status(409).json({ message: error.message });
    }
};

export const getHotelBookingByCreator = async (req, res) => {
    try {
        const { creator } = req.query;
        const hotelBookings = await HotelBooking.find({ creator: creator });
        res.status(200).json(hotelBookings);
    } catch (error) {
        console.error("Error in getting Hotel Bookings by creator", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const citySearch = async (req, res) => {
    const { city } = req.query;
    try {
        const response = await amadeus.referenceData.locations.get({
            keyword: city,
            subType: "CITY"
        });
        res.json(response.data);
    } catch (error) {
        console.error("Full error:", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Status code:", error.response.status);
        }
        res.status(500).json({ message: error.message });
    }
}

export const hotelListByCity = async (req, res) => {
    const { cityCode } = req.query;
    try {
        const response = await amadeus.referenceData.locations.hotels.byCity.get({
            cityCode: cityCode
        });

        if (response.data && response.data.length > 0) {
            res.json(response.data);
        } else {
            res.status(404).json({ message: "No hotels found for the given city code." });
        }
    } catch (error) {
        console.error("Full error:", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Status code:", error.response.status);
        }
        res.status(500).json({ message: error.message });
    }
};

export const hotelOffers = async (req, res) => {
    const { hotelIds ,checkInDate ,checkOutDate } = req.query;
    try {
       
        const response = await amadeus.shopping.hotelOffersSearch.get({
                hotelIds,
                checkInDate : checkInDate,
                checkOutDate : checkOutDate
        });
        res.json(response.data);
        console.log('response:',response.data);
    }  catch (error) {
        console.error("Full error:", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Status code:", error.response.status);
        }
        res.status(500).json({ message: error.message });
    }
    
};
// confirming an offer from the hotel using the offer id
export const confirmOffer = async (req, res) => {
    const { offerId } = req.query;
    try {
        const response = await amadeus.shopping.hotelOfferSearch(offerId).get();
        res.json(response.data);
    } catch (error) {
        console.error("Full error:", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Status code:", error.response.status);
        }
        res.status(500).json({ message: error.message });
    }
};
