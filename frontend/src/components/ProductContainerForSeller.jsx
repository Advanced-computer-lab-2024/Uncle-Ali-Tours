import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BiSolidArchiveOut, BiSolidArchiveIn } from "react-icons/bi";
import { useProductStore } from '../store/product.js';


function ProductContainerForSeller({ product, productChanger, tourist }) {
  const keys = [
    "name",
    "price",
    "description",
    "Available_quantity",
  ];

  const { archiveProduct } = useProductStore();

  const handleArchiveClick = (e) => {
    e.preventDefault();
    archiveProduct(product._id, !product.archive);
  };

  return (
    <div className="relative p-1 w-fit backdrop-blur-lg bg-[#0e0e2281] mx-auto h-fit m-4 rounded-lg shadow-lg text-white">
      {" "}
      <div className="grid p-2">
        {/* Product Details */}
        {keys.map((key, index) => (
            <div key={index} className="flex my-1  bg-[#00000012]  p-2 rounded-sm justify-between">
            <p>{key === "Available_quantity" ? "quantity" : key}: </p>
          <p className="text-left min-w-[10ch]">{"" + product[key]}</p>
            </div>
        ))}
        <button onClick={handleArchiveClick} className="mr-2 transform w-fit transition-transform duration-300 hover:scale-125">
          { !product.archive ?
            <BiSolidArchiveIn size="18" color="white" />
            :
            <BiSolidArchiveOut size="18" color="white" />
            }
        </button>
      </div>
    </div>
  );
}

export default ProductContainerForSeller;
