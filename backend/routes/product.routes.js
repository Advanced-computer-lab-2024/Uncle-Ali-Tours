import express from 'express';
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    archiveProduct,
    uploadProfilePicture ,
    upload
} from '../controllers/product.controller.js';

const router = express.Router();

// Route to get all products
router.get('/', getProducts);

// Route to create a new product
router.post('/', createProduct);

// Route to update an existing product by ID
// Update product by ID
router.put('/:id', updateProduct);

// Delete product by ID
router.delete('/:id', deleteProduct);
router.put('/uploadPicture', upload.single('profilePicture'), uploadProfilePicture);


router.put('/archiveProduct/:id', archiveProduct);
export default router;
