import React, { useState } from 'react';
import { useProductStore } from '../store/product';
import Product from '../../../backend/models/product..model';

const ProductCard = ({ product, onEdit, onDelete }) => {
    const [updatedProduct, setUpdatedProduct] = useState({product });
    
 const {deleteProduct, updateProduct}= useProductStore();
 const toast = usetoast();
 const onDelete = async(name)=>{
    const {success, message}=await deleteProduct(name);
    if (success) {
        toast({
          title: 'Error',
          description: message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Success',
          description: message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
 }}; //const {updateProduct}= useProductStore();

    const onEdit = async(name)=>{
    const {success, message}=await updateProduct(name,updateProduct);
    if (success) {
        toast({
          title: 'Error',
          description: message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setUpdatedProduct((prevState) => ({
            ...prevState,
            name: updatedProduct.name,
            price: updatedProduct.price,
            image: updatedProduct.image,
          }));
      } else {
        toast({
          title: 'Success',
          description: message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })}};


    return (
        
    <div style={cardStyle}>
      <img src={product.image} alt={product.name} style={imageStyle} />

      <div style={contentStyle}>
        <h3 style={headingStyle}>{product.name}</h3>
        <p style={priceStyle}>${product.price}</p>
      </div>
      <div>
        <input
          placeholder="Name"
          name="name"
          type="text"
          value={updateProduct.name}
          onChange={onEdit}
        />
      </div>
      
      <div>
        <input
          placeholder="Price"
          name="price"
          type="number"
          value={updateProduct.price}
          onChange={onEdit}
        />
      </div>
      <div>
        <input
          placeholder="Image URL"
          name="image"
          type="text"
          value={updateProduct.image}
          onChange={onEdit}
        />
      </div>

      

      <div style={buttonContainerStyle}>
        <button onClick={onEdit} style={{ ...buttonStyle, backgroundColor: 'blue' }}>
          Edit
        </button>
        <button onClick={onDelete} style={{ ...buttonStyle, backgroundColor: 'red' }}>
          Delete
        </button>
      </div>
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

export default ProductCard;

