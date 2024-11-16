import React from 'react'
import { useState, useEffect } from 'react'

function TouristPromos({userName = ""}) {
    const [promos, setPromos] = useState([])

    useEffect(() => {
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
    <div className='bg-black w-fit p-4 rounded-lg mx-auto'>
        <p className='mb-2'>PROMOS</p>
        {
            promos.map(promo => (
                <div key={promo._id} className='bg-white text-black p-1 rounded-lg'>
                    <h3>{promo.code}</h3>
                    <p>{promo.description}</p>
                    <p>Discount: {promo.discount}</p>
                </div>
            ))
        }
    </div>
  )
}

export default TouristPromos