import React, { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import toast from 'react-hot-toast';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";
import { useTouristStore } from '../store/tourist.js';
import { useUserStore } from '../store/user.js';
import QuantitySelector from './QuantitySelector.jsx';
import avatar from "/avatar.png";
function ProductContainer({ product, productChanger, tourist }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState(null); // "rate" or "review"
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const user = useUserStore((state) => state.user);

    const { addProductWishlist,removeProductWishlist, getWishlistedProducts} = useTouristStore();

    const [isWishlisted, setIsWishlisted] = useState(false);
    const { addProductToCart,removeProductCart, getCartProducts} = useTouristStore();

    const [isAddedToCart, setIsAddedToCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [showPreview, setShowPreview] = useState(false);

    const displayPrice = (product.price * user.currencyRate).toFixed(2); // Convert price based on currencyRate

    let avRating = 0
    product.rate.map((r) => avRating += r.rating )
    if(product.rate.length>0){
        avRating /= product.rate.length
    }
    


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

    const handleWishlist = async (id) => {
        if (user.type !== "tourist") {
            return toast.error("You are not allowed to add products to the wishlist", { className: 'text-white bg-gray-800' });
        }
        
        const { success, message } = await addProductWishlist(user.userName, id);
        if (success) {
            setIsWishlisted(true);
            toast.success(`${product.name} added to wishlist!`, { className: "text-white bg-gray-800" });
        } else {
            toast.error(message, { className: "text-white bg-gray-800" });
        }
    };
    
    const handleQuantityChange = (newQuantity) => {
        setQuantity(newQuantity);
    };

    const handleCart = async (id) => {
        if (user.type !== "tourist") {
            return toast.error("You are not allowed to add products to the Cart", { className: 'text-white bg-gray-800' });
        }
        
        const { success, message } = await addProductToCart(user.userName, id, quantity);
        if (success) {
            // Optionally update the state immediately
            setIsAddedToCart(true);
            toast.success(message, { className: "text-white bg-gray-800" });
        } else {
            toast.error(message, { className: "text-white bg-gray-800" });
        }
    };
    
    
    const handleRemoveFromWishlist = async (id) => {
        if (user.type !== "tourist") {
            return toast.error("You are not allowed to remove products from the wishlist", { className: 'text-white bg-gray-800' });
        }
        
        const { success, message } = await removeProductWishlist(user.userName, id);
        if (success) {
            // Optionally update the state immediately
            setIsWishlisted(false);
            toast.success(message, { className: "text-white bg-gray-800" });
        } else {
            toast.error(message, { className: "text-white bg-gray-800" });
        }
    };
    
    useEffect(() => {
        if (tourist) {
            setIsWishlisted(tourist.productsWishlist?.includes(product._id));  // Update based on current tourist state
        }
    }, [tourist, product._id]); 

    const handleRemoveFromCart = async (id) => {
        if (user.type !== "tourist") {
            return toast.error("You are not allowed to remove products from the Cart", { className: 'text-white bg-gray-800' });
        }
        
        const { success, message } = await removeProductCart(user.userName, id);
        if (success) {
            // Optionally update the state immediately
            setIsAddedToCart(false);
            toast.success(message, { className: "text-white bg-gray-800" });
        } else {
            toast.error(message, { className: "text-white bg-gray-800" });
        }
    };
    
    useEffect(() => {
        if (tourist) {
            setIsAddedToCart(tourist.productsCart?.includes(product._id));  // Update based on current tourist state
        }
    }, [tourist, product._id]); 


  return (
        <div className="relative p-1 w-[650px] h-[350px] flex backdrop-blur-lg bg-[#FEFDED]/75 mx-auto m-4 rounded-lg shadow-lg text-white">
        <div className="flex">
        {/* Left half - Product Image */}
        <div className="w-1/2 pr-2 flex items-center justify-center">
          <div className="aspect-square overflow-hidden ml-12 mt-12">
            <img
              src={product?.profilePicture ? `http://localhost:3000${product.profilePicture}` : avatar}
              alt="Product"
              className="w-[75%] h-[75%] object-cover cursor-pointer"
              onClick={() => setShowPreview(true)}
            />
          </div>
        </div>
        {/* <hr className="h-[300px] w-[2px] bg-black text-black"/> */}
        {/* Right half - Product Info */}
        <div className="w-1/2 pl-2 flex flex-col justify-between mt-2 text-black">
          <div>
            <h2 className="font-bold mb-2">{product.name}</h2>
            <p className="mb-1">Description: {product.description}</p>
            <p className="mb-1">Price: {displayPrice} {user.chosenCurrency}</p>
            <p className="mb-1">Available Quantity: {product.Available_quantity}</p>
            <p className="mb-1">Seller: {product.creator}</p>
            <p className="mb-2">Rating: {avRating.toFixed(1)}/5</p>
          </div>

          <div className="flex flex-col space-y-2">
            <button onClick={() => handleReviewClick('review')} className="bg-blue-500 text-white px-2 py-1 rounded">
              Review
            </button>
            <button onClick={() => handleReviewClick('rate')} className="bg-green-500 text-white px-2 py-1 rounded">
              Rate
            </button>
            <div className="flex justify-between items-center">
            <button
                    onClick={() => isWishlisted ? handleRemoveFromWishlist(product._id) : handleWishlist(product._id)}
                    className="transform transition-colors duration-300 hover:text-red-500 focus:outline-none"
                >
                    {isWishlisted ? (
                        <FaHeart  size="25" className="text-red-500 ml-4" /> // Filled red heart if wishlisted
                    ) : (
                        <FaRegHeart size="25" className="text-gray-500 ml-4" /> // Empty heart if not wishlisted
                    )}
                </button>
              
              <QuantitySelector onChange={handleQuantityChange} />
              <button
                onClick={() => isAddedToCart ? handleRemoveFromCart(product._id) : handleCart(product._id)}
                className="transform transition-colors duration-300 hover:text-green-500 focus:outline-none"
              >
                <FaShoppingCart size="25" className={isAddedToCart ? "text-green-500 mr-4" : "text-gray-300 mr-4"} />
              </button>
            </div>
            {user?.type === "tourist" && (
              <div className="flex justify-between text-xs">
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
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
            src={product?.profilePicture ? `http://localhost:3000${product.profilePicture}` : avatar}
            alt="Product Preview"
            className="img-fluid m-auto h-[60vh]"
          />
        </Modal.Body>
      </Modal>

      {/* Rating/Review Dialog */}
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
    </div>
  );
}

export default ProductContainer;

