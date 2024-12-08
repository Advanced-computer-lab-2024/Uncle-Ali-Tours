import React, { useState } from "react";
import { BiSolidArchiveOut, BiSolidArchiveIn } from "react-icons/bi";
import { useProductStore } from '../store/product.js';
import { FaEdit ,FaStar} from "react-icons/fa";
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
  const {tourist} = useTouristStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
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
  const handleReviewClick = async (type) => {
    try {
      const response = await fetch(`http://localhost:3000/api/tourist/check-purchase/${tourist.userName}/${product._id}`);
      const data = await response.json();

      if (data.canReview) {
        setDialogType(type);
        setIsDialogOpen(true);
      } else {
        toast.error(data.message, { className: "text-white bg-gray-800" });
      }
    } catch (error) {
      console.error('Error checking purchase status', error);
      toast.error('There was an error checking purchase status. Please try again.', { className: "text-white bg-gray-800" });
    }
  };

  const handleSubmit = async () => {
    if (dialogType === 'rate' && rating > 5) {
      toast.error("Rating cannot exceed 5", { className: "text-white bg-gray-800" });
      return;
    }
    if (dialogType === 'review' && review === "") {
      toast.error("Please put a review before submitting", { className: "text-white bg-gray-800" });
      return;
    }
    
    const requestData = {
      user: { userName: tourist.userName },
      [dialogType === 'rate' ? 'rating' : 'reviewText']: dialogType === 'rate' ? rating : review
    };

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
    
    setIsDialogOpen(false);
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
           {user.type === 'tourist' && (
            <div>
          <button onClick={()=> handleReviewClick('review')} className="text-black p-2">Review</button>
          <button onClick={()=> handleReviewClick('rate')} className="text-black p-2">Rate</button>
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
      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogHeader>
          <DialogTitle>{dialogType === 'rate' ? 'Rate the Product' : 'Write a Review'}</DialogTitle>
        </DialogHeader>
        <DialogContent>
          {dialogType === 'rate' && (
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          )}
          {dialogType === 'review' && (
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full p-2 border rounded"
              rows="4"
              placeholder="Write your review here..."
            />
          )}
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    
  );
}

export default ProductContainerForSeller;
