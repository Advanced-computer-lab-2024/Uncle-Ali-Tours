import express from 'express';

import { 
  createSeller, 
  deleteSeller, 
  getSeller, 
  updateSeller, 
  uploadProfilePicture ,
  upload
} from "../controllers/seller.controller.js";

const router = express.Router();




// Define routes
router.post('/', createSeller); // Create a new seller
router.get('/', getSeller); // Get seller details
router.put('/', updateSeller); // Update seller details
router.delete('/', deleteSeller); // Delete a seller

// Route for uploading profile picture
router.put('/uploadPicture', upload.single('profilePicture'), uploadProfilePicture);

export default router;
