import express from "express";
import { creatTourGuide, getTourGuide, updateTourGuide, deleteTourGuide ,checkTourGuideBookings} from "../controllers/tourGuide.controller.js";

const router = express.Router();
router.post("/",creatTourGuide);
router.get("/",getTourGuide);
router.put("/",updateTourGuide);
router.delete("/",deleteTourGuide);
router.get('/checkBookings/:userName', checkTourGuideBookings); 
export default router;