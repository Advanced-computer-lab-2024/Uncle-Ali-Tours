import express from 'express';
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    // searchProduct,
    // filterProduct,
    // sortProduct
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


// Route to search a product by name
// router.post('/products/search', searchProduct);

// // Route to filter products by price
// router.post('/products/filter', filterProduct);

// // Route to sort products by rate
// router.post('/products/sort', sortProduct);

export default router;
