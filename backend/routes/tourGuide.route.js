import express from "express";
import { creatTourGuide, getTourGuide, updateTourGuide, deleteTourGuide } from "../controllers/tourGuide.controller.js";

const router = express.Router();
router.post("/",creatTourGuide);
router.get("/",getTourGuide);
router.put("/",updateTourGuide);
router.delete("/",deleteTourGuide);
export default router;