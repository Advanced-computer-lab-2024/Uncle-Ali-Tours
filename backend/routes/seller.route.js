import express from 'express';

import { 
  createSeller, 
  deleteSeller, 
  getSeller, 
  updateSeller, 
  uploadProfilePicture ,
  uploadDocuments,
  uploadMiddleware,
  getUploadedDocuments,
  getAllUploadedDocuments,
  upload,
  acceptDocuments,rejectDocuments
} from "../controllers/seller.controller.js";

const router = express.Router();




// Define routes
router.post('/', createSeller); // Create a new seller
router.get('/', getSeller); // Get seller details
router.put('/', updateSeller); // Update seller details
router.delete('/', deleteSeller); // Delete a seller

// Route for uploading profile picture
router.put('/uploadPicture', upload.single('profilePicture'), uploadProfilePicture);
// router.post('/uploadDocuments', uploadDocuments);
router.post("/uploadDocuments", uploadMiddleware, uploadDocuments);
router.get('/getUploadedDocuments', getUploadedDocuments);
router.get('/getAllUploadedDocuments', getAllUploadedDocuments);  // Ensure this line is in your seller routes file
router.post('/acceptDocument', acceptDocuments); // Route for accepting documents
router.post('/rejectDocument', rejectDocuments); // Route for rejecting documents

export default router;
