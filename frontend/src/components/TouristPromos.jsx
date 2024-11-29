import React from 'react'
import { useState, useEffect } from 'react'

function TouristPromos({userName = ""}) {
    const [promos, setPromos] = useState([])


    useEffect(() => {
        if(!userName) return;
        const fetchPromos = async () => {
        const res = await fetch('/api/tourist/promos',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userName})
        })
        const {success, data} = await res.json()
        if (success)
        setPromos(data)
    };
    fetchPromos();
    }, [userName])

  return (
    <div className='w-fit p-4 rounded-lg mx-auto'>
        <p className='text-lg'>PROMOS</p>
        {
            promos.map(promo => (
                <div key={promo._id} className='mt-2 text-white p-1 rounded-lg'>
                    <div className="flex-1 flex flex-col justify-center items-center border-b border-white">
                    </div>
                    <h3>{promo.code}</h3>
                    <p>{promo.description}</p>
                    <p>Discount: {promo.discount}%</p>
                </div>
            ))
        }
    </div>
  )
}

export default TouristPromos