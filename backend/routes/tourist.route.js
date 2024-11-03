import express from "express";
import { createTourist, deleteTourist, getTourist, updateTourist} from "../controllers/tourist.controller.js";
import { redeemPoints } from '../controllers/tourist.controller.js';  // Import the redeemPoints controller function

const router = express.Router();
router.post("/",createTourist);
router.get("/", getTourist);
router.put("/",updateTourist);
router.delete("/",deleteTourist);
router.put('/redeemPoints', redeemPoints);

export default router;