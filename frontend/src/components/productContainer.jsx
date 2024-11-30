import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {useUserStore} from '../store/user.js';
import { useTouristStore } from '../store/tourist.js';
import { Link } from 'react-router-dom';
import { FaRegHeart, FaHeart } from 'react-icons/fa'; 
import { FaShoppingCart } from 'react-icons/fa';
function ProductContainer({ product, productChanger, tourist }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState(null); // "rate" or "review"
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const user = useUserStore((state) => state.user);

    const { addProductWishlist,removeProductWishlist} = useTouristStore();

    const [isWishlisted, setIsWishlisted] = useState(false);
    const { addProductToCart,removeProductCart} = useTouristStore();

    const [isAddedToCart, setIsAddedToCart] = useState(false);

    let avRating = 0
    product.rate.map((r) => avRating += r.rating )
    avRating /= product.rate.length



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
            // Optionally update the state immediately
            setIsWishlisted(true);
            toast.success(message, { className: "text-white bg-gray-800" });
        } else {
            toast.error(message, { className: "text-white bg-gray-800" });
        }
    };
    const handleCart = async (id) => {
        if (user.type !== "tourist") {
            return toast.error("You are not allowed to add products to the Cart", { className: 'text-white bg-gray-800' });
        }
        
        const { success, message } = await addProductToCart(user.userName, id);
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
        <div className='mb-6 text-black text-left w-fit min-w-[45ch] bg-white mx-auto rounded h-fit'>
            <Toaster />
            <div className='grid p-2'>
                {/* Product Details */}
                {Object.keys(product).map((key, index) => {
                    if(key==="review"){
                        return    <div key={index}>
                        <p key={index}>{`${key}: ${product[key].map((review) => review.reviewText)}`}</p></div>
                    }
                    else 
                        if (key==="rate"){
                            return     <div key={index}>
                        <p key={index}>{`${key}: ${avRating}`}</p></div>
                        }
                    
                    else{
                    return <p key={index}>{`${key}: ${product[key]}`}</p>}
})}
                <button onClick={() => handleReviewClick('review')}>
                    Review
                </button>
                <button onClick={() => handleReviewClick('rate')}>
                    Rate
                </button>
                <button
                    onClick={() => isWishlisted ? handleRemoveFromWishlist(product._id) : handleWishlist(product._id)}
                    className="transform transition-colors duration-300 hover:text-red-500 focus:outline-none"
                >
                    {isWishlisted ? (
                        <FaHeart className="text-red-500" /> // Filled red heart if wishlisted
                    ) : (
                        <FaRegHeart className="text-gray-500" /> // Empty heart if not wishlisted
                    )}
                </button>
         {user?.type === "tourist" && (
                <Link to="/wishlist" className="text-blue-500 hover:underline">
                    My Wishlist
                </Link>
            )}
            </div>
            <button
                    onClick={() => isAddedToCart ? handleRemoveFromCart(product._id) : handleCart(product._id)}
                    className="transform transition-colors duration-300 hover:text-red-500 focus:outline-none"
                >
                    {isAddedToCart ? (
                        <FaShoppingCart className="text-green-500" /> //Cart filled in green if added to cart

                    ) : (
                        <FaShoppingCart className="text-gray-500" /> // Empty cart if not added to cart.
                    )}
                </button>
         {user?.type === "tourist" && (
                <Link to="/Cart" className="text-blue-500 hover:underline">
                    My Cart
                </Link>
            )}
            

            {/* Dialog for Rating or Review */}
            {isDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-md w-80">
                        <h2 className="text-lg font-bold mb-4">
                            {dialogType === 'rate' ? 'Rate the Product' : 'Write a Review'}
                        </h2>
                        

         

                        {dialogType === 'rate' && (
                            <div className="mb-4">
                                <label className="block mb-2">Rating (out of 5):</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    className="border border-gray-300 p-2 rounded w-full"
                                />
                            </div>
                        )}

                        {dialogType === 'review' && (
                            <div className="mb-4">
                                <label className="block mb-2">Your Review:</label>
                                <textarea
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    className="border border-gray-300 p-2 rounded w-full"
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
