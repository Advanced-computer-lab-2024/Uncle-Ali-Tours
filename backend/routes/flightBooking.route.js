import express from "express";
import { createFlightBooking, deleteFlightBooking, getFlightBookingByCreator } from "../controllers/flightBooking.controller.js";

const router = express.Router();

router.post("/addFlight", createFlightBooking);
router.get("/getFlights", getFlightBookingByCreator);
router.delete("/deleteFlight", deleteFlightBooking);

export default router;