import express from "express";
import { addBookmark,   uploadProductPicture ,
    upload,createActivity, createActivityReview, deleteActivity, getActivity, getActivityById, getAllActivities, getBookmarkedActivitiesForUser, interestedIn, removeBookmark, removeInterestedIn, toggleActivityAppropriateness, toggleBookmark, updateActivity } from "../controllers/activity.controller.js";

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
router.get('/bookmarkedActivities/:userName', getBookmarkedActivitiesForUser);
router.put('/toggleBookmark', toggleBookmark);
router.delete('/bookmark', removeBookmark);
// Delete product by ID
router.put('/uploadPicture/:id', upload.single('profilePicture'), uploadProductPicture);

router.put('/intrestedIn',interestedIn);
router.put('/notIntrestedIn',removeInterestedIn);
export default router;