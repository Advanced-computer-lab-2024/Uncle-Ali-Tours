import React, { useState } from 'react';
import toast , {Toaster}from 'react-hot-toast';

function ProductContainerForSeller({ product, productChanger, tourist }) {
    
    return (
        <div className='mb-6 text-black text-left w-fit min-w-[45ch] bg-white mx-auto rounded h-fit'>
            <Toaster />
            <div className='grid p-2'>
                {/* Product Details */}
                {Object.keys(product).map((key, index) => (
                    <p key={index}>{`${key}: ${product[key]}`}</p>
                ))}

            </div>
        </div>
    );
}

export default ProductContainerForSeller;
