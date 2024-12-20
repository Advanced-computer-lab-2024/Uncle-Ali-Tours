import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

function QuantitySelector({ onChange ,maxValue}) {
    const [quantity, setQuantity] = useState(1);

    const increment = () => {
        if(quantity<maxValue){
            setQuantity((prev) => {
                const newQuantity = prev + 1;
                if (onChange) {
                    onChange(newQuantity);
                }
                return newQuantity;
            });
        }
        
    };

    const decrement = () => {
        setQuantity((prev) => {
            const newQuantity = Math.max(1, prev - 1);
            if (onChange) {
                onChange(newQuantity);
            }
            return newQuantity;
        });
    };

    return (
        <div className="flex items-center text-black justify-between w-32 h-12 bg-gray-100 rounded-lg overflow-hidden">
            <button
                onClick={decrement}
                className="w-10 h-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors"
            >
                <FaMinus />
            </button>
            <span className="text-xl font-semibold">{quantity}</span>
            <button
                onClick={increment}
                className="w-10 h-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors"
            >
                <FaPlus />
            </button>
        </div>
    );
}

export default QuantitySelector;
