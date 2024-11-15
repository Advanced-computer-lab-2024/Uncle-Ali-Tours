import React from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast';

function Promo() {
    const [code, setCode] = useState();
    const [discount, setDiscount] = useState();


    const addPromo = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:3000/api/promo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: code,
                discount: discount
            })
        })
        const {success, message} = await res.json();

        console.log(seccess, message)

        if(success)
            toast.success(message)
        else
            toast.error(message)

    }
  return (
    <div className='grid mx-auto'>
      <form className='grid mx-auto w-[30ch] text-black'>
      <input type="text" className='rounded-md px-1 my-2' placeholder="Enter Promo Code" onChange={(e) => setCode(e.target.value)} />
      <input type="number" className='rounded-md px-1 my-2' placeholder="Enter Discount" onChange={(e) => setDiscount(e.target.value)} />
      </form>
      <button onClick={addPromo} type="submit" className='text-white bg-black my-2 mx-auto rounded-md w-[10ch]'>Add</button>
        
    </div>
  )
}

export default Promo