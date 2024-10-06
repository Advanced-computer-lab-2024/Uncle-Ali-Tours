import express from "express";
import { createAttraction, getAttraction, deleteAttraction, updateAttraction } from "../controllers/attraction.controller.js";

const router = express.Router();

router.post("/", createAttraction);
router.get("/", getAttraction);
router.delete("/", deleteAttraction);
router.put("/", updateAttraction);

export default router;