import express from "express";
import { createItinerary, deleteItinerary, getItinerary, updateItinerary } from "../controllers/itinerary.controller.js";

const router = express.Router();

router.post("/", createItinerary);
router.get("/", getItinerary);
router.delete("/", deleteItinerary);
router.put("/", updateItinerary);

export default router;
