import React, { useState, useEffect } from "react";
import { BiSolidArchiveOut, BiSolidArchiveIn } from "react-icons/bi";
import { useProductStore } from '../store/product.js';
import { FaEdit, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import avatar from "/avatar.png";
import { Modal } from "react-bootstrap";
import { IoClose } from "react-icons/io5";
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { useTouristStore } from "../store/tourist.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/DialogAI';

function ProductContainerForSeller({ product }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { tourist, hasPurchasedProduct } = useTouristStore();
  const [hasPurchased, setHasPurchased] = useState(false); // Track purchase status
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const displayPrice = (product.price * user.currencyRate).toFixed(2);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const keys = ["name", "price", "description", "Available_quantity"];

  const { archiveProduct } = useProductStore();

  // Fetch purchase status on mount
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (user.type === 'tourist' && user.userName) {
        try {
          const result = await hasPurchasedProduct(user.userName, product._id);
          setHasPurchased(result.purchased);
        } catch (error) {
          console.error('Error checking purchase status:', error);
        }
      }
      console.log(hasPurchased);
    };

    checkPurchaseStatus();
  }, [user.type, user.userName, product._id, hasPurchasedProduct]);

  const handleEdit = (product) => {
    navigate(`/product/edit/${product._id}`);
  };

  const handleArchiveClick = (e) => {
    e.preventDefault();
    archiveProduct(product._id, !product.archive);
  };

  // Handle opening the dialog
  const openDialog = (type) => {
    setDialogType(type);
    setIsDialogOpen(true);
};

// Close dialog
const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogType(null);
    setRating(0);
    setReview('');
};

// Handle submit based on dialog type
// Handle submit based on dialog type
const handleSubmit = async () => {
  if (dialogType === 'rate' && rating > 5) {
      toast.error("Rating cannot exceed 5", { className: "text-white bg-gray-800" });
      closeDialog();
      return; // Exit without submitting if rating is invalid
  }
  if (dialogType === 'review' && review === "") {
      toast.error("Please put a review before submitting", { className: "text-white bg-gray-800" });
      return; // Exit without submitting if rating is invalid
  }
  
  const requestData = { user: { userName: tourist.userName } };

  // Add rating or reviewText based on dialogType
  if (dialogType === 'rate') {
      requestData.rating = rating;
  } else if (dialogType === 'review') {
      requestData.reviewText = review;
  }

  try {
      const response = await fetch(`/api/product/${product._id}/rate-review`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (data.success) {
          toast.success(dialogType === 'rate' ? `Rating submitted: ${rating}/5` : `Review submitted: "${review}"`, { className: "text-white bg-gray-800" });
      } else {
          toast.error(data.message || 'Failed to submit');
      }
  } catch (error) {
      console.error('Error submitting rating/review:', error);
      toast.error('An error occurred. Please try again.', { className: "text-white bg-gray-800" });
  }
  
  closeDialog();
};

// Handle eligibility check for rate or review
const handleReviewClick = async (type) => {
  try {
      const response = await fetch(`http://localhost:3000/api/tourist/check-purchase/${tourist.userName}/${product._id}`);
      const data = await response.json();

      if (data.canReview) {
          openDialog(type);
      } else {
          toast.error(data.message, { className: "text-white bg-gray-800" });
      }
  } catch (error) {
      console.error('Error checking purchase status', error);
      toast.error('There was an error checking purchase status. Please try again.', { className: "text-white bg-gray-800" });
  }
};

  return (
    <div className="relative justify-around items-center p-1 w-[95%] min-h-[450px] max-h-[450px] content-center flex backdrop-blur-lg bg-[#ECEBDE]/75 mx-auto h-fit m-4 rounded-lg shadow-lg text-white">
      <img
        src={product?.profilePicture ? `http://localhost:3000${product?.profilePicture}` : avatar}
        alt="Profile Preview"
        className="w-[30%] rounded-full hover:cursor-pointer"
        onClick={() => setShowPreview(true)}
      />
      <hr className="h-[200px] w-[1px] bg-black text-black" />
      <div className="grid p-2 w-[50%]">
        {keys.map((key, index) => (
          <div key={index} className="flex my-1 text-black p-2 rounded-sm">
            <p className="text-left">{key === "Available_quantity" ? "quantity" : key}:</p>
            <p className="text-left pl-4">
              {key === "price" ? `${displayPrice} ${user.chosenCurrency}` : "" + product[key]}
            </p>
          </div>
        ))}
        <div className="w-fit">
          {user.type === 'seller' && (
            <div>
              <button onClick={handleArchiveClick} className="mr-2 transform w-fit transition-transform duration-300 hover:scale-125">
                {!product.archive ? <BiSolidArchiveIn size="18" className="text-pink-950" /> : <BiSolidArchiveOut size="18" className="text-pink-950" />}
              </button>
              <button onClick={() => handleEdit(product)} className="mr-2 transform w-fit transition-transform duration-300 hover:scale-125">
                <FaEdit size="18" className="text-pink-950" />
              </button>
            </div>
          )}
          {user.type === 'tourist' && hasPurchased && (
            <div>
              {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-lg font-bold mb-4 text-black">
              {dialogType === 'rate' ? 'Rate the Product' : 'Write a Review'}
            </h2>
            {dialogType === 'rate' && (
              <div className="mb-4">
                <label className="block mb-2 text-black">Rating (out of 5):</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full text-black"
                />
              </div>
            )}
            {dialogType === 'review' && (
              <div className="mb-4">
                <label className="block mb-2 text-black">Your Review:</label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full text-black"
                  rows="4"
                />
              </div>
            )}
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white p-2 rounded mr-2"
            >
              Submit
            </button>
            <button
              onClick={closeDialog}
              className="bg-gray-300 text-black p-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
               <button onClick={() => handleReviewClick('review')} className="bg-blue-500 text-white px-2 py-1 rounded">
                  Review
                </button>
                <button onClick={() => handleReviewClick('rate')} className="bg-green-500 text-white px-2 py-1 rounded">
                  Rate
                </button>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}

export default ProductContainerForSeller;
