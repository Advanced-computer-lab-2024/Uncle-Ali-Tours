import express from "express";
import { createTourist, getTourist } from "../controllers/tourist.controller.js";

const router = express.Router();
router.post("/",createTourist);
router.get("/", getTourist);
export default router;