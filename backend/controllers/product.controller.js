import mongoose, { Mongoose } from 'mongoose';
import Product from '../models/product..model.js'; 


export const getProducts = async (req, res) => {
    const { filter, sort } = req.query;
    let parsedFilter = filter ? JSON.parse(filter) : {};
    let parsedSort = sort ? JSON.parse(sort) : {};
    try {
        const products = await Product.find(parsedFilter).sort(parsedSort);
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.log("Error", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};





export const createProduct = async (req, res) => {
    console.log('Received product data:', req.body);
    if (!req.body.name || !req.body.price || !req.body.imgURL) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    const productData = req.body; 
    const newProduct = new Product(productData); 

    try {
        await newProduct.save();
        console.log('Product created:', newProduct);
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        res.status(409).json({success: false, message:error.message});
    }
};





export const deleteProduct = async (req, res) => {
    const { id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({success:false, message: 'invalid id' });
        
    }
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (deletedProduct) {
            res.json({ success: true, message: 'Product deleted successfully', data: deletedProduct });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const updateProduct = async (req, res) => {
    const { newProduct } = req.body;
    const {id} = req.params;
   console.log(id)
   if(!id) {
    return res.status(400).json({success:false, message: 'Name is required' });}

    try {
        const updatedProduct = await Product.findByIdAndUpdate( id, newProduct, { new: true });
        res.json({ success: true, data: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};





// export const filterProduct = async (req, res) => {
//     const { price } = req.body;
//     try {
//         const filteredProducts = await Product.find({ price });
//         res.status(200).json({ success: true, data: filteredProducts });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };


// export const sortProduct = async (req, res) => {
//     const { rate } = req.body;
//     try {
//         const sortedProducts = await Product.find({}).sort({ rate });
//         res.status(200).json({ success: true, data: sortedProducts });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };
