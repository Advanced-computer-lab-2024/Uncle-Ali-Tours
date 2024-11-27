import express from "express";
import { addBookmark,toggleBookmark, getBookmarkedActivities, removeBookmark,createActivity, deleteActivity, getActivity, updateActivity, createActivityReview,getAllActivities,toggleActivityAppropriateness } from "../controllers/activity.controller.js";

const router = express.Router();

router.post("/", createActivity);
router.get("/", getActivity);
router.delete("/", deleteActivity);
router.put("/", updateActivity);
router.post('/:id/reviews', createActivityReview);
router.get('/all', getAllActivities);
router.put('/flag/:id', toggleActivityAppropriateness);
router.post('/bookmark', addBookmark);
router.get('/bookmarkedActivities', getBookmarkedActivities);
router.put('/toggleBookmark', toggleBookmark);
router.delete('/bookmark', removeBookmark);
export default router;