import express from "express";
import { createComplaint , getTouristComplaints } from "../controllers/complaint.controller.js";

const router = express.Router();

router.post("/", createComplaint);
router.get("/by-creator/:creator",getTouristComplaints);

export default router;