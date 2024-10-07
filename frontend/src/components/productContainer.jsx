import React, { useState } from 'react';
import { useProductStore } from '../store/product';
import toast, { Toaster } from 'react-hot-toast';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const { deleteProduct, updateProduct } = useProductStore();
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });

  // Handle Delete
  const del = async () => {
    const { success, message } = await deleteProduct(product._id);
    if (success) {
      toast.success('Product deleted successfully!');
      onDelete(product._id);
    } else {
      toast.error('Failed to delete product: ' + message);
    }
  };

  // Handle Edit
  const handleUpdate = async (e) => {
    e.preventDefault();
    const { success, message } = await updateProduct(product._id, updatedProduct);
    if (success) {
      toast.success('Product updated successfully!');
      onEdit(updatedProduct);
    } else {
      toast.error('Failed to update product: ' + message);
    }
  };

  // Handle input changes for updating the product
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log('Updated Product:', updatedProduct);
  };

  // Check if product exists
  if (!product) {
    return <div>Product does not exist</div>;
  }

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-5 bg-white">
      <img
        className="w-full h-48 object-cover"
        src={product.imgURL}
        alt={product.name}
      />
      <div className="px-6 py-4">
        <h3 className="font-bold text-xl mb-2">{product.name}</h3>
        <p className="text-gray-700 text-base">${product.price}</p>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleUpdate} className="px-6 py-4">
        <input
          className="w-full p-2 mb-2 border border-gray-300 rounded"
          placeholder="Name"
          name="name"
          type="text"
          value={updatedProduct.name}
          onChange={handleInputChange}
          required
        />
        <input
          className="w-full p-2 mb-2 border border-gray-300 rounded"
          placeholder="Price"
          name="price"
          type="number"
          value={updatedProduct.price}
          onChange={handleInputChange}
          required
        />
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          placeholder="Image URL"
          name="imgURL"
          type="text"
          value={updatedProduct.imgURL}
          onChange={handleInputChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-2"
        >
          Update
        </button>
      </form>

      <div className="px-6 pb-4">
        <button
          onClick={del}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default ProductCard;
