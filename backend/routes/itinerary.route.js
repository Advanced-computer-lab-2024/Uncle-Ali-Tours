import express from "express";
import {   uploadProductPicture ,
    upload,activateItinerary, bookItinerary, createItinerary, createItineraryReview, deactivateItinerary, deleteItinerary, flagItinerary, getItinerary, getItineraryById, updateItinerary,interestedIn,removeInterestedIn } from "../controllers/itinerary.controller.js";

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
router.put('/uploadPicture/:id', upload.single('profilePicture'), uploadProductPicture);
router.put('/notIntrestedIn',removeInterestedIn);
// router.post('/bookmark', addBookmark);
// router.get('/bookmarkedItineraries/:userName', getBookmarkedItinerariesForUser);
// router.put('/toggleBookmark', toggleBookmark);
// router.delete('/bookmark', removeBookmark);
export default router;
