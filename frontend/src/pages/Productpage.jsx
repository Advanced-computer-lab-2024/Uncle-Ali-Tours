import React, { useEffect, useState, useCallback } from 'react';
import { useProductStore } from '../store/product';  
import ProductCard from '../components/productContainer.jsx'; 
import Dialog from '../components/Dialog.jsx'
import FormDialog from '../components/FormDialog.jsx' 
import toast, { Toaster } from 'react-hot-toast';
import { deleteProduct, updateProduct,getProducts,createProduct } from '../../../backend/controllers/product.controller.js';
function ProductPage() {
    
          const {products, getProducts, createProduct } = useProductStore();
         // const [openCreateDialog, setOpenCreateDialog] = useState(false);  
          const [newProduct, setNewProduct] = useState({
            name: '',
            price: '',
            imgURL: ''
          });
        

    useEffect(() => {
        getProducts()
    }, [])

    const del = async () => {
        const {success, message} = await deleteProduct(products)
        success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})

}

   

    const handleUpdate = async (updatedProduct) => {
        const {success, message} = await updateProduct(products, updatedProduct)
        success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
    }


    const handleCreateProduct = async() => {
        console.log(newProduct.name)
        const {success, message} = await createProduct(newProduct);
        success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
    }

  return (
    <div className='test'>
        <div className='mt-4 text-xl'>Create New Product</div>
        <div className='text-black'>
        <input className='rounded' name={"newProduct"} placeholder='New Product' onChange={(e) => setNewProduct({ name: e.target.value})}/>
        <button className='bg-black text-white m-6 p-2 rounded-xl transform transition-transform duration-300 hover:scale-105' onClick={()=>(handleCreateProduct())}>Add Product</button>
        </div>
        <div className='mb-4 text-xl'>
            Available   
        </div>
        {
            products.map((product, index)=> (
                <productContainer key={index}  Name={product.name}/>   
            ))
        }
        <Dialog msg={"Are you sure you want to delete this product?"} accept={() => del()} reject={() => (console.log("rejected"))} acceptButtonText='Delete' rejectButtonText='Cancel'/>
        <FormDialog msg={"Update values"} accept={handleUpdate} reject={() => (console.log("rejected"))} acceptButtonText='Update' rejectButtonText='Cancel' inputs={["name"]}/>
        <Toaster/>
    </div>
    
  )
}

export default ProductPage();