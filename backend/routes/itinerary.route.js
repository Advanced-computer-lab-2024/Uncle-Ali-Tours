import express from "express";
import { activateItinerary, bookItinerary, createItinerary, createItineraryReview, deactivateItinerary, deleteItinerary, flagItinerary, getItinerary, getItineraryById, updateItinerary,interestedIn,removeInterestedIn } from "../controllers/itinerary.controller.js";

const router = express.Router();

router.post("/", createItinerary);
router.get("/", getItinerary);
router.get("/:id", getItineraryById);
router.delete("/", deleteItinerary);
router.put("/", updateItinerary);
router.post('/:id/reviews', createItineraryReview);
router.post('/deactivate', deactivateItinerary);
router.post('/activate', activateItinerary);
router.put('/:id/book', bookItinerary);
router.put("/flag",flagItinerary);
router.put('/intrestedIn',interestedIn);
router.put('/notIntrestedIn',removeInterestedIn);
export default router;
