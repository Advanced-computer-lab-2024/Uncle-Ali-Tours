import express from 'express';
import {
    createAdvertiser,
    getAdvertiser,
    updateAdvertiser,
    deleteAdvertiser,
    uploadProfilePicture,
    upload
} from "../controllers/advertiser.controller.js";

const router = express.Router();

// Define a route to fetch advertiser by userName
router.get('/:userName', getAdvertiser); // New route for fetching by userName

// Other CRUD routes
router.post('/', createAdvertiser);
router.put('/', updateAdvertiser);
router.delete('/', deleteAdvertiser);
router.put('/uploadPicture', upload.single('profilePicture'), uploadProfilePicture);

export default router;
