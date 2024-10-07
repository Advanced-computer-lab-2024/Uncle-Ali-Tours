import React, { useEffect, useState } from 'react';
import { useProductStore } from '../store/product';  
import Dialog from '../components/Dialog.jsx';
import FormDialog from '../components/FormDialog.jsx';
import toast, { Toaster } from 'react-hot-toast';
import ProductCard from '../components/productContainer';  // Ensure this component is properly imported

function ProductPage() {
  const { products, getProducts, createProduct } = useProductStore();
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    imgURL: ''
  });

  // Fetch products on component mount
  useEffect(() => {
    getProducts();
  }, []);

  // Delete product handler
  const del = async (id) => {
    const { success, message } = await deleteProduct(id);
    success ? toast.success(message, { className: "text-white bg-gray-800" }) : toast.error(message, { className: "text-white bg-gray-800" });
    getProducts(); // Refetch products after deletion
  };

  // Update product handler
  const handleUpdate = async (updatedProduct) => {
    const { success, message } = await updateProduct(updatedProduct._id, updatedProduct);
    success ? toast.success(message, { className: "text-white bg-gray-800" }) : toast.error(message, { className: "text-white bg-gray-800" });
    getProducts(); // Refetch products after update
  };

  // Create product handler
  const handleCreateProduct = async () => {
    console.log(newProduct);
    const { success, message } = await createProduct(newProduct);
    success ? toast.success(message, { className: "text-white bg-gray-800" }) : toast.error(message, { className: "text-white bg-gray-800" });
    getProducts(); // Refetch products after creating
  };

  return (
    <div className='test'>
      <div className='mt-4 text-xl'>Create New Product</div>
      <div className='text-black'>
        <input 
          className='rounded' 
          name="price" 
          placeholder='Price'  
          type="number" 
          onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))} 
        />
        <br />
        <input 
          className='rounded' 
          name="newProduct" 
          placeholder='New Product' 
          onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))} 
        />
        <br />
        <input 
          className='rounded' 
          name="imgURL" 
          placeholder='Image URL' 
          onChange={(e) => setNewProduct((prev) => ({ ...prev, imgURL: e.target.value }))} 
        />
      </div>
      
      <div className='mb-4 text-xl'>
        <button 
          className='bg-black text-white m-6 p-2 rounded-xl transform transition-transform duration-300 hover:scale-105' 
          onClick={handleCreateProduct}
        >
          CREATE PRODUCT
        </button>
      </div>

      {/* Display products or message if no products are available */}
      <div>
        {products.length === 0 ? (
          <div>No products available</div>
        ) : (
          products.map((product, index) => (
            <ProductCard key={index} name={product.name} />
          ))
        )}
      </div>

      {/* Dialog components for delete and update */}
      <Dialog 
        msg={"Are you sure you want to delete this product?"} 
        accept={() => del()} 
        reject={() => console.log("rejected")} 
        acceptButtonText='Delete' 
        rejectButtonText='Cancel' 
      />
      <FormDialog 
        msg={"Update values"} 
        accept={handleUpdate} 
        reject={() => console.log("rejected")} 
        acceptButtonText='Update' 
        rejectButtonText='Cancel' 
        inputs={["name"]} 
      />
      <Toaster />
    </div>
  );
}

export default ProductPage;
