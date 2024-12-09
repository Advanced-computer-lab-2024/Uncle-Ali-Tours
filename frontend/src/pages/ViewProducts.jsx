import React from 'react'
import { useState } from 'react'
import { useProductStore } from '../store/product';
import { useTouristStore } from '../store/tourist'
import ProductContainer
 from '../components/productContainer';
 import Dialog from '../components/Dialog.jsx'
 import FormDialog from '../components/FormDialog.jsx'
function ViewProducts() {
    const {tourist} = useTouristStore()
    console.log(tourist)
    const [filter, setFilter] = useState(
        {}
    );
    const [sort, setSort] = useState(
      {}
  );
    const [visibillity, setVisibillity] = useState(
      false
  );
  const [previewFile, setPreviewFile] = useState(localStorage.getItem("profilePicture") || "");

 
    const {getProducts, products} = useProductStore();

   const handlePress = async () => {
    await getProducts(filter , sort);
   };
   const handleSort = async () => {
    setVisibillity((prev)=> !prev);
   };


   return (
    <div className='text-black'>
      
        <input className='w-[15ch] m-2 pl-1' name={"name"} placeholder='Name' onChange={(e) => setFilter({ ...filter, name: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1' name={"price"} placeholder='Price' onChange={(e) => setFilter({ ...filter, cat: e.target.value})}/>
        <button className='p-2 bg-black text-white' onClick={() => (handlePress())}>search</button>
        <div className={` grid w-fit mx-auto`} >
        <div>
      <div className='mb-4 text-xl'>
            Available Products   
        </div>
        
        <div className='bg-gradient-to-b shadow-xl rounded-xl relative fro-100% from-[#FA7070] w-[95vw] p-8 grid grid-cols-2'>
        {
            products.map((product, index)=> (
                !product.archive && <ProductContainer key={index} tourist={tourist}  product={product}/>   
            ))
        }
        </div>
        <Dialog msg={"Are you sure you want to delete this itinerary?"} accept={() => del()} reject={() => (console.log("rejected"))} acceptButtonText='Delete' rejectButtonText='Cancel'/>
        <FormDialog msg={"Update values"} accept={() => del()} reject={() => (console.log("rejected"))} acceptButtonText='Update' rejectButtonText='Cancel' inputs={["name","value"]}/>
   
    
    </div>
       </div>
        
        <div><button onClick={() => (handleSort())}>{Object.keys(sort)[0]? "sorted by " + Object.keys(sort)[0] : "Sort"}</button>
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