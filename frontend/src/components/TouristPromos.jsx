import React, { useState, useEffect } from 'react'

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
    <div className='w-full p-6 rounded-lg bg-white shadow-md'>
        <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Available Promos</h2>
        {promos.length === 0 ? (
            <p className='text-gray-600'>No promos available at the moment.</p>
        ) : (
            <div className='space-y-4'>
                {promos.map(promo => (
                    <div key={promo._id} className='bg-orange-100 p-4 rounded-lg shadow'>
                        <h3 className='text-lg font-semibold text-orange-800'>{promo.code}</h3>
                        <p className='text-gray-700'>{promo.description}</p>
                        <p className='text-orange-600 font-semibold mt-2'>Discount: {promo.discount}%</p>
                    </div>
                ))}
            </div>
        )}
    </div>
  )
}

export default TouristPromos

