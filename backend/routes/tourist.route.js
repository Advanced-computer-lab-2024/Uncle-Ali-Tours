import express from "express";
import { createTourist, deleteTourist, getTourist, updateTourist , badgeLevel , updateMyPoints ,bookActivity} from "../controllers/tourist.controller.js";
import { redeemPoints } from '../controllers/tourist.controller.js';  // Import the redeemPoints controller function
import { checkPurchaseStatusByUsername } from "../controllers/tourist.controller.js";
const router = express.Router();

router.post("/",createTourist);
router.get("/", getTourist);
router.put("/",updateTourist);
router.delete("/",deleteTourist);
router.put('/redeemPoints', redeemPoints);
router.get('/check-purchase/:username/:productId', checkPurchaseStatusByUsername);
router.get('/badge', badgeLevel);
router.put("/updateMyBookings",bookActivity);

router.put("/updatePoints",updateMyPoints);
export default router;