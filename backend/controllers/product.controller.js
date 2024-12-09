import mongoose, { Mongoose } from 'mongoose';
import Product from '../models/product.model.js'; 
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDirectory = path.join(__dirname, "../uploads");

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({ storage: storage });
export const uploadMiddleware = upload.single("profilePicture");


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



export const uploadProductPicture = async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided." });
    }
  
    const { id } = req.params;
    const filePath = `/uploads/${req.file.filename}`;
  
    try {
      const product = await Product.findById(id);
      if (!product) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: " not found." });
      }
  
      // Remove old profile picture file if it exists
      if (product.profilePicture && fs.existsSync(path.join(__dirname, `../${product.profilePicture}`))) {
        fs.unlinkSync(path.join(__dirname, `../${product.profilePicture}`));
      }
  
      // Update seller's profile picture path in the database
      product.profilePicture = filePath;
      await product.save();
  
      return res.status(200).json({
        success: true,
        message: "Product picture uploaded successfully",
        profilePicture: `${process.env.SERVER_URL || 'http://localhost:5000'}${filePath}`, // Return the full URL
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      return res.status(500).json({ message: "Profile picture upload failed", error });
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

        if (deletedProduct.profilePicture && fs.existsSync(path.join(__dirname, `../${deletedProduct.profilePicture}`))) {
            fs.unlinkSync(path.join(__dirname, `../${deletedProduct.profilePicture}`));
          }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const updateProduct = async (req, res) => {
    const { newProduct } = req.body;
    const {id} = req.params;
    const updates = { ...req.body };
    if(!id) {
    return res.status(400).json({success:false, message: 'Name is required' });}
    if (req.file) {
        updates.profilePicture = `/uploads/${req.file.filename}`;
      }
    
    try {
        const updatedProduct = await Product.findByIdAndUpdate( id, newProduct, { new: true });
        res.json({ success: true, data: updatedProduct });

        if (req.file && updatedProduct.profilePicture && fs.existsSync(path.join(__dirname, `../${updatedProduct.profilePicture}`))) {
            fs.unlinkSync(path.join(__dirname, `../${updatedProduct.profilePicture}`));
          }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const archiveProduct = async (req, res) => {
    const { id } = req.params;
    const { archive } = req.body;
    if(!id) {
        return res.status(400).json({success:false, message: 'id is required' });
        
    }
    try {
        const archivedProduct = await Product.findByIdAndUpdate(id, { archive: archive }, { new: true });
        res.json({ success: true, data: archivedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addRatingReview =  async (req, res) => {
    const { productId } = req.params;
    const { rating, reviewText, user } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        // Update based on the presence of rating or reviewText
        if (rating) {
            product.rate.push({ user: user.userName, rating });
        }
        if (reviewText) {
            product.review.push({ user: user.userName, reviewText });
        }

        await product.save();
        res.status(200).json({ success: true, message: 'Rating/Review submitted successfully.' });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ success: false, message: "Server error." });
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
export const getProductById = async (req, res) => {
    const { id } = req.params;

    // Validate the provided ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid product ID.' });
    }

    try {
        // Find the product by ID
        const product = await Product.findById(id);
        
        // Handle the case where the product does not exist
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        // Respond with the product data
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error("Error fetching product:", error.message);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};
