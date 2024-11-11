import express from "express";
import { createItinerary, deleteItinerary, getItinerary, updateItinerary, createItineraryReview ,activateItinerary,deactivateItinerary, bookItinerary } from "../controllers/itinerary.controller.js";

const router = express.Router();

router.post("/", createItinerary);
router.get("/", getItinerary);
router.delete("/", deleteItinerary);
router.put("/", updateItinerary);
router.post('/:id/reviews', createItineraryReview);
router.post('/deactivate', deactivateItinerary);
router.post('/activate', activateItinerary);
router.put('/:id/book', bookItinerary);

export default router;
