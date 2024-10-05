import React from 'react'
import {create} from 'zustand';
import { postProductStore } from '../store/product';

const ProductPage =()=>{
    const toast = useToast;
    const {ADD}=postProductStore;
    const handleAddProduct=async ()=>{
        const {success,message}= await ADD(newProduct);
        if(!success){
            toast({
                title:"Error",
                description: message,
                isClosable: true
        });
        }

    };

  //  const {success, message} = postProductStore();

    return
(
    <div>ProductPage</div>
)
}
export default ProductPage;
// import React, { useEffect, useState } from 'react';
// import { useProductStore } from '../store/product';  // Import Zustand store
// import ProductCard from './ProductCard';  // Import ProductCard component

// const ProductPage = () => {
//   const { getProducts } = useProductStore();  // Fetching products logic from Zustand store
//   const [products, setProducts] = useState([]);  // State for storing fetched products

//   useEffect(() => {
//     // Fetch products when the component loads
//     const fetchProducts = async () => {
//       const { success, data } = await getProducts();  // Call Zustand store function to get products
//       if (success) {
//         setProducts(data);  // Store products in local state
//       } else {
//         console.error("Failed to fetch products");
//       }
//     };

//     fetchProducts();
//   }, [getProducts]);

//   // This function can be passed to ProductCard for handling edits
//   const handleEdit = (updatedProduct) => {
//     setProducts((prevProducts) =>
//       prevProducts.map((product) =>
//         product.name === updatedProduct.name ? updatedProduct : product
//       )
//     );
//   };

//   // This function can be passed to ProductCard for handling deletes
//   const handleDelete = (deletedProductName) => {
//     setProducts((prevProducts) =>
//       prevProducts.filter((product) => product.name !== deletedProductName)
//     );
//   };

//   return (
//     <div>
//       <h1>Product Page</h1>
//       <div>
//         {products.map((product) => (
//           <ProductCard
//             key={product.name}
//             product={product}
//             onEdit={handleEdit}
//             onDelete={handleDelete}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductPage;
