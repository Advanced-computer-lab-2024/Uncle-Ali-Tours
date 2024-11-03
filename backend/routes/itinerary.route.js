import express from "express";
import { createItinerary, deleteItinerary, getItinerary, updateItinerary, createProductReview } from "../controllers/itinerary.controller.js";

const router = express.Router();

router.post("/", createItinerary);
router.get("/", getItinerary);
router.delete("/", deleteItinerary);
router.put("/", updateItinerary);
router.post('/:id/reviews', createProductReview);

export default router;
