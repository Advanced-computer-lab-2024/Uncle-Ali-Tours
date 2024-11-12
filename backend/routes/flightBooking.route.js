import express from "express";
import { createFlightBooking, getFlightBookingByCreator } from "../controllers/flightBooking.controller.js";

const router = express.Router();

router.post("/addFlight", createFlightBooking);
router.get("/getFlights", getFlightBookingByCreator);

export default router;