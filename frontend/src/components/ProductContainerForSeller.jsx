import React, { useState } from "react";
import { BiSolidArchiveOut, BiSolidArchiveIn } from "react-icons/bi";
import { useProductStore } from '../store/product.js';
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import avatar from "/avatar.png";
import { Modal } from "react-bootstrap";
import { IoClose } from "react-icons/io5";

function ProductContainerForSeller({ product }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const displayPrice = (product.price * user.currencyRate).toFixed(2); // Convert price based on currencyRate
  const [showPreview, setShowPreview] = useState(false);
  const keys = [
    "name",
    "price",
    "description",
    "Available_quantity",
  ];
  const navigate = useNavigate();

  const handleEdit = (product) => {
    navigate(`/product/edit/${product._id}`);
  }

  const { archiveProduct } = useProductStore();

  const handleArchiveClick = (e) => {
    e.preventDefault();
    archiveProduct(product._id, !product.archive);
  };

  return (
    <div className="relative justify-around items-center p-1 w-[95%] min-h-[450px] max-h-[450px] content-center flex backdrop-blur-lg bg-[#ECEBDE]/75 mx-auto h-fit m-4 rounded-lg shadow-lg text-white">
      <img
        src={
          product?.profilePicture
            ? `http://localhost:3000${product?.profilePicture}`
            : avatar
        }
        alt="Profile Preview"
        className="w-[30%] rounded-full hover:cursor-pointer"
        onClick={() => setShowPreview(true)}
      />
      <hr className="h-[200px] w-[1px] bg-black text-black" />
      <div className="grid p-2 w-[50%]">
        {keys.map((key, index) => (
          <div key={index} className="flex my-1 text-black p-2 rounded-sm">
            <p className="text-left">
              {key === "Available_quantity" ? "quantity" : key}:
            </p>
            <p className="text-left pl-4">
              {key === "price"
                ? `${displayPrice} ${user.chosenCurrency}`
                : "" + product[key]}
            </p>
          </div>
        ))}
        <div className="w-fit">
          {user.type === 'seller' && (
            <div>
              <button onClick={handleArchiveClick} className="mr-2 transform w-fit transition-transform duration-300 hover:scale-125">
                {!product.archive ? (
                  <BiSolidArchiveIn size="18" className="text-pink-950" />
                ) : (
                  <BiSolidArchiveOut size="18" className="text-pink-950" />
                )}
              </button>
              <button onClick={() => handleEdit(product)} className="mr-2 transform w-fit transition-transform duration-300 hover:scale-125">
                <FaEdit size="18" className="text-pink-950" />
              </button>
            </div>
          )}
        </div>
      </div>
      <Modal
        show={showPreview}
        className="absolute focus:outline-none rounded-xl top-1/2 left-1/2 h-[90vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 backdrop-blur-lg"
        onHide={() => setShowPreview(false)}
        centered
      >
        <button
          className="mt-4 ml-4"
          onClick={() => setShowPreview(false)}
        >
          <IoClose size={40} className="text-red-500" />
        </button>
        <Modal.Body className="text-center">
          <img
            src={
              product?.profilePicture
                ? `http://localhost:3000${product?.profilePicture}`
                : avatar
            }
            alt="Profile Preview"
            className="img-fluid m-auto h-[60vh]"
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ProductContainerForSeller;
