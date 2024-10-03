import React from 'react'
import { useState } from 'react'
import { useProductStore } from '../store/product';

function ViewProducts() {
    const [filter, setFilter] = useState(
        {}
    );

 
    const {getProducts, products} = useProductStore();
   const handlePress = async () => {
    await getProducts(filter);
   };


   return (
    <div className='text-black'>
        <input className='w-[15ch] m-2 pl-1' name={"name"} placeholder='Name' onChange={(e) => setFilter({ ...filter, name: e.target.value})}/>
        <input className='w-[15ch] m-2 pl-1' name={"price"} placeholder='Price' onChange={(e) => setFilter({ ...filter, cat: e.target.value})}/>
        <button className='p-2 bg-black text-white' onClick={() => (handlePress())}>search</button>
        <button className="text-white" onClick={() => (console.log(products))}>ss</button>
        {products.map((product, index) => 
        (
          <p key={index}>
            {product.filter.name || "ss"}
          </p>
        )
        )}
        </div>
  )
}

export default ViewProducts