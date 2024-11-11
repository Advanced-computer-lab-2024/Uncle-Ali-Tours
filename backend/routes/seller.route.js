import express from 'express';
import { createSeller, deleteSeller, getSeller, updateSeller, uploadProfilePicture } from "../controllers/seller.controller.js";
import multer from 'multer';

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const router = express.Router();

// Define routes
router.post('/', createSeller);
router.get('/', getSeller);
router.put('/', updateSeller);
router.delete('/', deleteSeller);

// New route for uploading profile picture
router.put('/uploadPicture', upload.single('profilePicture'), uploadProfilePicture);

export default router;
