import React from 'react';
import { useNavigate } from 'react-router-dom';
import avatar from "/avatar.png";
import { useProductStore } from '../store/product';

function OrderContainer({ order , orderChanger}) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const { getProductById } = useProductStore();
  const currentProduct = order.products[0].productId;
  const displayPrice = (currentProduct.price * user.currencyRate).toFixed(2); // Convert price based on currencyRate
  const displayTotal = (order.total * user.currencyRate).toFixed(2);

  const handleViewDetails = () => {
    orderChanger(order);
    navigate(`/orderDetails/${order._id}`);
  };

  return (
    <div className="relative justify-around items-center p-4 w-[650px] h-[350px] content-center flex backdrop-blur-lg bg-[#ECEBDE]/75 mx-auto rounded-lg shadow-lg text-black mb-4">
      {/* Date positioned at the top-left */}
      <div className="absolute top-2 left-4 text-xs text-gray-600">
        <p>Date: {new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
      </div>

      <div className="w-1/2 pr-2 flex items-center justify-center">
        <div className="aspect-square overflow-hidden ml-16 mt-2">
          <img
            src={currentProduct.profilePicture ? `http://localhost:3000${currentProduct.profilePicture}` : avatar}
            alt="Product Preview"
            className="w-[60%] rounded-lg"
          />
        </div>
      </div>

      <div className="grid p-2 w-[60%] text-black">
        <h3 className="text-xl font-bold mb-2">{currentProduct.name}</h3>
        <p className="mb-1">Price: {displayPrice} {user.chosenCurrency}</p>
        <p className="mb-1">Quantity: {order.products.find(p => p.productId._id === currentProduct._id).quantity}</p>  
        <br/>
        <p>Number of items: {order.products.length}</p>
        <p>Total: {displayTotal} {user.chosenCurrency}</p>
        <button 
          onClick={handleViewDetails}
          className="mt-4 bg-pink-800 text-white py-2 px-4 rounded hover:bg-pink-700 transition-colors"
        >
          View Order Details
        </button>
      </div>

      {/* ID positioned at the bottom-left */}
      <div className="absolute bottom-2 left-4 text-xs text-gray-600">
        <p>ID: {order._id}</p>
      </div>
    </div>
  );
}

export default OrderContainer;
