import express from "express";
import { createActivity, deleteActivity, getActivity, updateActivity } from "../controllers/activity.controller.js";

const router = express.Router();

router.post("/", createActivity);
router.get("/", getActivity);
router.delete("/", deleteActivity);
router.put("/", updateActivity);

export default router;