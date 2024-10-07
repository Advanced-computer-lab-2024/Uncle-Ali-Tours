import express from "express";
import { createAttraction } from "../controllers/attractions.controller.js";

const router = express.Router();

router.post("/",createAttraction);

export default router;