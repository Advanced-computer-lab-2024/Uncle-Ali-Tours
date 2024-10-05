import express from "express";
import { createTourist, deleteTourist, getTourist, updateTourist} from "../controllers/tourist.controller.js";

const router = express.Router();
router.post("/",createTourist);
router.get("/", getTourist);
router.put("/",updateTourist);
router.delete("/",deleteTourist);

export default router;