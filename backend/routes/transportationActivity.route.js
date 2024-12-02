import express from "express";
import { createActivity, deleteActivity, getActivity, getActivityById, updateActivity } from "../controllers/transportationActivity.controller.js";

const router = express.Router();

router.post("/", createActivity);
router.get("/", getActivity);
router.get("/:id", getActivityById);
router.delete("/", deleteActivity);
router.put("/", updateActivity);

export default router;