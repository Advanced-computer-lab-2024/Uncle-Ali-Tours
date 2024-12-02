import express from "express";
import { addBookmark, createActivity, createActivityReview, deleteActivity, getActivity, getActivityById, getAllActivities, getBookmarkedActivities, removeBookmark, toggleActivityAppropriateness, toggleBookmark, updateActivity ,removeInterestedIn,interestedIn} from "../controllers/activity.controller.js";

const router = express.Router();

router.post("/", createActivity);
router.get("/", getActivity);
router.get("/:id", getActivityById);
router.delete("/", deleteActivity);
router.put("/", updateActivity);
router.post('/:id/reviews', createActivityReview);
router.get('/all', getAllActivities);
router.put('/flag/:id', toggleActivityAppropriateness);
router.post('/bookmark', addBookmark);
router.get('/bookmarkedActivities', getBookmarkedActivities);
router.put('/toggleBookmark', toggleBookmark);
router.delete('/bookmark', removeBookmark);
router.put('/intrestedIn',interestedIn);
router.put('/notIntrestedIn',removeInterestedIn);
export default router;