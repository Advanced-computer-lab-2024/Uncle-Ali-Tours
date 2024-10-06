// import React, { useState } from 'react';
// import { useProductStore } from '../store/product';
// //import Product from '../../../backend/models/product..model';
// import toast, { Toaster } from 'react-hot-toast';  // Use
// const ProductCard = ({ product,  onEdit: Edit, onDelete:Delete }) => {
//     const [updatedProduct, setUpdatedProduct] = useState({product });
    
//  const {deleteProduct, updateProduct}= useProductStore();
//  const toast = useToast();
//  const hDelete = async(name)=>{
//     const {success, message}=await deleteProduct(name);
//     if (success) {
//         toast({
//           title: 'Error',
//           description: message,
//           status: 'error',
//           duration: 3000,
//           isClosable: true,
//         });
//       } else {
//         toast({
//           title: 'Success',
//           description: message,
//           status: 'success',
//           duration: 3000,
//           isClosable: true,
//         });
//  }}; //const {updateProduct}= useProductStore();

//     const hEdit = async(name)=>{
//     const {success, message}=await updateProduct(name,updateProduct);
//     if (success) {
//         toast({
//           title: 'Error',
//           description: message,
//           status: 'error',
//           duration: 3000,
//           isClosable: true,
//         });
//         setUpdatedProduct((prevState) => ({
//             ...prevState,
//             name: updatedProduct.name,
//             price: updatedProduct.price,
//             image: updatedProduct.image,
//           }));
//       } else {
//         toast({
//           title: 'Success',
//           description: message,
//           status: 'success',
//           duration: 3000,
//           isClosable: true,
//         })}};


//     return (
        
//     <div style={cardStyle}>
//       <img src={product.image} alt={product.name} style={imageStyle} />

//       <div style={contentStyle}>
//         <h3 style={headingStyle}>{product.name}</h3>
//         <p style={priceStyle}>${product.price}</p>
//       </div>
//       <div>
//         <input
//           placeholder="Name"
//           name="name"
//           type="text"
//           value={updateProduct.name}
//           onChange={hEdit}
//         />
//       </div>
      
//       <div>
//         <input
//           placeholder="Price"
//           name="price"
//           type="number"
//           value={updateProduct.price}
//           onChange={hEdit}
//         />
//       </div>
//       <div>
//         <input
//           placeholder="Image URL"
//           name="image"
//           type="text"
//           value={updateProduct.image}
//           onChange={hEdit}
//         />
//       </div>

      

//       <div style={buttonContainerStyle}>
//         <button onClick={onEdit} style={{ ...buttonStyle, backgroundColor: 'blue' }}>
//           Edit
//         </button>
//         <button onClick={hDelete} style={{ ...buttonStyle, backgroundColor: 'red' }}>
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// };

// // Styles
// const cardStyle = {
//   boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
//   borderRadius: '10px',
//   overflow: 'hidden',
//   transition: 'all 0.3s',
//   width: '300px',
//   margin: '20px',
// };

// const imageStyle = {
//   width: '100%',
//   height: '200px',
//   objectFit: 'cover',
// };

// const contentStyle = {
//   padding: '10px',
// };

// const headingStyle = {
//   margin: '0 0 10px 0',
// };

// const priceStyle = {
//   fontWeight: 'bold',
//   fontSize: '20px',
//   margin: '0',
// };

// const buttonContainerStyle = {
//   display: 'flex',
//   justifyContent: 'space-around',
//   padding: '10px',
// };

// const buttonStyle = {
//   padding: '8px 12px',
//   color: '#fff',
//   border: 'none',
//   borderRadius: '5px',
//   cursor: 'pointer',
// };

// export default ProductCard;

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
    const { success, message, data } = await updateProduct(product.name, updatedProduct);  // Use '_id' and updated data
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
