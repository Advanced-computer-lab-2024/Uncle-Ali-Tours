import express from "express";
import { citySearch, confirmOffer, createHotelBooking, getHotelBookingByCreator, hotelListByCity, hotelOffers } from "../controllers/hotelBooking.controller.js";
const router = express.Router();

router.get("/search", citySearch);
router.get("/hotels", hotelListByCity);
router.get("/offers", hotelOffers);
router.get("/offer", confirmOffer);
router.post("/addHotel", createHotelBooking);
router.get("/getHotels", getHotelBookingByCreator);

export default router;