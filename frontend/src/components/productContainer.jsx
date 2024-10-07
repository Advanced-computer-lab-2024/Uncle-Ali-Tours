import React, { useState } from 'react';
import { useProductStore } from '../store/product';
import toast, { Toaster } from 'react-hot-toast';  // Use react-hot-toast consistently

const ProductCard = ({ product, onEdit, onDelete }) => {
  const { deleteProduct, updateProduct } = useProductStore();
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });  // Spread product fields

  // Handle Delete
  const handleDelete = async () => {
    const { success, message } = await deleteProduct(product._id);  // Use '_id'
    if (success) {
      toast.success("Product deleted successfully!");
      onDelete(product._id);  // Notify parent to remove from state
    } else {
      toast.error("Failed to delete product: " + message);
    }
  };

  // Handle Edit
  const handleEdit = async (e) => {
    e.preventDefault();  // Prevent form submission
    const { success, message, data } = await updateProduct(product._id, updatedProduct);  // Use '_id' and updated data
    if (success) {
      toast.success("Product updated successfully!");
      onEdit(data);  // Notify parent to update the product in state
    } else {
      toast.error("Failed to update product: " + message);
    }
  };

  // Handle input changes for updating the product
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Add a check to ensure product exists
  if (!product || !product.imgURL) {
    return <div>Product information is loading...</div>;
  }

  return (
    <div style={cardStyle}>
      <img src={product.imgURL} alt={product.name} style={imageStyle} />  {/* Changed 'image' to 'imgURL' */}

      <div style={contentStyle}>
        <h3 style={headingStyle}>{product.name}</h3>
        <p style={priceStyle}>${product.price}</p>
      </div>
      
      {/* Edit Form */}
      <form onSubmit={handleEdit} style={editFormStyle}>
        <input
          placeholder="Name"
          name="name"
          type="text"
          value={updatedProduct.name}
          onChange={handleInputChange}
          required
        />
        <input
          placeholder="Price"
          name="price"
          type="number"
          value={updatedProduct.price}
          onChange={handleInputChange}
          required
        />
        <input
          placeholder="Image URL"
          name="imgURL"  // Changed from 'image' to 'imgURL'
          type="text"
          value={updatedProduct.imgURL}
          onChange={handleInputChange}
          required
        />
        <button type="submit" style={{ ...buttonStyle, backgroundColor: 'blue' }}>
          Update
        </button>
      </form>

      <div style={buttonContainerStyle}>
        {/* Remove Edit button since editing is handled via the form */}
        <button onClick={handleDelete} style={{ ...buttonStyle, backgroundColor: 'red' }}>
          Delete
        </button>
      </div>
      
      <Toaster />
    </div>
  );
};

// Styles
const cardStyle = {
  boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
  borderRadius: '10px',
  overflow: 'hidden',
  transition: 'all 0.3s',
  width: '300px',
  margin: '20px',
};

const imageStyle = {
  width: '100%',
  height: '200px',
  objectFit: 'cover',
};

const contentStyle = {
  padding: '10px',
};

const headingStyle = {
  margin: '0 0 10px 0',
};

const priceStyle = {
  fontWeight: 'bold',
  fontSize: '20px',
  margin: '0',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  padding: '10px',
};

const buttonStyle = {
  padding: '8px 12px',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const editFormStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '10px',
};

export default ProductCard;
