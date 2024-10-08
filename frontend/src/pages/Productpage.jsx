import React from 'react'
import { useState, useEffect } from 'react'
import { useProductStore } from '../store/product';
import ProductCard from '../components/ProductCard.jsx';
 import Dialog from '../components/Dialog.jsx'
 import FormDialog from '../components/FormDialog.jsx'
 import CreateForm, { createForm} from '../components/CreateForm.jsx';
 import toast, { Toaster } from 'react-hot-toast';
 import { formdialog } from '../components/FormDialog.jsx'; 
 import { useUserStore } from '../store/user';
 

function ViewProducts() {
  const [currentProduct, setCurrentProduct] = useState({

  }
)
    const [filter, setFilter] = useState(
        {}
    );
    const {user} = useUserStore();
    const [sort, setSort] = useState(
      {}
  );
    const [visibillity, setVisibillity] = useState(
      false
  );
   const { showFormDialog } = formdialog()
  const {showCreateFormDialog} = createForm()
  const productChanger = (product) => {
    setCurrentProduct(product);
  }

 
    const {getProducts, products, createProduct, deleteProduct, updateProduct} = useProductStore();


    useEffect(() => {
      if (user.type === "seller")
        getProducts({creator: user.userName} , sort); 
    }, [])

   const handlePress = async () => {
    console.log(user.type)
    if (user.type === "seller")
      await getProducts({...filter,creator: user.userName} , sort);
    else
      await getProducts(filter , sort);
   };
   const handleSort = async () => {
    setVisibillity((prev)=> !prev);
   };

    const del = async () => {
      const {success, message} = await deleteProduct(currentProduct._id)
      success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})

    }

    const handleUpdate = async (updatedProduct) => {
      const {success, message} = await updateProduct(currentProduct._id, updatedProduct)
      success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
  }
  const handleCreateProduct = async(newProduct) => {

    console.log(products.name)
    const {success, message} = await createProduct({...newProduct, creator:user.userName});
    success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
}

   return (
    <div className='text-black'>
      <Toaster/>
        <input className='w-[15ch] m-2 pl-1' name={"name"} placeholder='Name' onChange={(e) => setFilter({ ...filter, name: e.target.value})}/>
       
        <button className='p-2 bg-black text-white' onClick={() => (handlePress())}>search</button>

        <div className={` grid w-fit mx-auto`} >
        <button className='p-2 bg-black text-white' onClick={() => (showCreateFormDialog())}>create product</button>
        <div>
      <div className='mb-4 text-xl'>
            Available Products   
        </div>
        {
            products.map((product, index)=> (
                <ProductCard key={index} productChanger={productChanger}  product={product}/>   
            ))
        }
        <Dialog msg={"Are you sure you want to delete this product?"} accept={del} reject={() => (console.log("rejected"))} acceptButtonText='Delete' rejectButtonText='Cancel'/>
        <FormDialog msg={"Update values"} accept={handleUpdate} reject={() => (console.log("DD"))} acceptButtonText='update' rejectButtonText='Cancel' inputs={["name","imgURL","price","description","Available_quantity"]}/>
   
    
    </div>
       </div>
        
        <div><button onClick={() => (handleSort())}>{Object.keys(sort)[0]? "sorted by " + Object.keys(sort)[0] : "Sort"}</button>
        <br></br>

        <CreateForm msg={"created"} accept={handleCreateProduct} reject={() => (console.log("DD"))} acceptButtonText='create' rejectButtonText='Cancel' inputs={["name","imgURL","price","description","Available_quantity"]}/>
        <div className={`${visibillity ? '' : 'hidden' }`} >
         <div> <button onClick={()=>(setSort({'rating' : -1}))}>{"Rating High to Low"}</button></div>
         <div> <button onClick={()=>(setSort({'rating' : 1}))}>{"Rating Low to High"}</button></div>
          
         <div> <button onClick={()=>(setSort({'price' : -1}))}>{"Price High to Low"}</button></div>
                <button onClick={()=>(setSort({'price' : 1}))}>{"Price Low to High"}</button>
          </div>
        </div>
        </div>
  )
}

export default ViewProducts