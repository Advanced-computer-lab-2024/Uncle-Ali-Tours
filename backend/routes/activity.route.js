import express from "express";
import { createActivity, deleteActivity, getActivity, updateActivity, createActivityReview,getAllActivities,toggleActivityAppropriateness } from "../controllers/activity.controller.js";

const router = express.Router();

router.post("/", createActivity);
router.get("/", getActivity);
router.delete("/", deleteActivity);
router.put("/", updateActivity);
router.post('/:id/reviews', createActivityReview);
router.get('/all', getAllActivities);
router.put('/flag/:id', toggleActivityAppropriateness);

export default router;