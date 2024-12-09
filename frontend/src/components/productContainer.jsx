import React, { useState, useEffect } from 'react';
import { Modal } from "react-bootstrap";
import toast from 'react-hot-toast';
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";
import { useTouristStore } from '../store/tourist.js';
import { useUserStore } from '../store/user.js';
import QuantitySelector from './QuantitySelector.jsx';
import avatar from "/avatar.png";
import Button from '../components/Button';
import { Card, CardContent, CardFooter } from '../components/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/DialogAI';

function ProductContainer({ product, tourist }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [showReviews, setShowReviews] = useState(false);
  const user = useUserStore((state) => state.user);
  const { addProductWishlist, removeProductWishlist, addProductToCart, removeProductCart } = useTouristStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showPreview, setShowPreview] = useState(false);

  const displayPrice = (product.price * user.currencyRate).toFixed(2);

  let avRating = product.rate.reduce((sum, r) => sum + r.rating, 0) / (product.rate.length || 1);

  useEffect(() => {
    if (tourist) {
      setIsWishlisted(tourist.productsWishlist?.includes(product._id));
      setIsAddedToCart(tourist.productsCart?.includes(product._id));
    }
  }, [tourist, product._id]);

  const handleWishlist = async () => {
    if (user.type !== "tourist") {
      return toast.error("You are not allowed to add products to the wishlist", { className: 'text-white bg-gray-800' });
    }
    
    const { success, message } = isWishlisted
      ? await removeProductWishlist(user.userName, product._id)
      : await addProductWishlist(user.userName, product._id);

    if (success) {
      setIsWishlisted(!isWishlisted);
      toast.success(message, { className: "text-white bg-gray-800" });
    } else {
      toast.error(message, { className: "text-white bg-gray-800" });
    }
  };

  const handleCart = async () => {
    if (user.type !== "tourist") {
      return toast.error("You are not allowed to add products to the Cart", { className: 'text-white bg-gray-800' });
    }
    
    const { success, message } = isAddedToCart
      ? await removeProductCart(user.userName, product._id)
      : await addProductToCart(user.userName, product._id, quantity);

    if (success) {
      setIsAddedToCart(!isAddedToCart);
      toast.success(message, { className: "text-white bg-gray-800" });
    } else {
      toast.error(message, { className: "text-white bg-gray-800" });
    }
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
    <Card className="w-full max-w-[700px] mx-auto">
    <CardContent className="p-6">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-center w-auto max-w-[650px] mx-auto">
        <div className="w-full flex items-center justify-center">
          <div className="aspect-square overflow-hidden transform scale-110 ml-12 mt-12">
            <img
              src={product?.profilePicture ? `http://localhost:3000${product.profilePicture}` : avatar}
              alt="Product"
              className="w-[75%] h-[75%] object-cover cursor-pointer"
              onClick={() => setShowPreview(true)}
            />
          </div>
        </div>

        <div className="w-full md:w-2/3 flex flex-col items-center justify-center text-center">
            <div>
              <h2 className="font-bold mb-2">{product.name}</h2>
              <p className="mb-1">Description: {product.description}</p>
              <p className="mb-1">Price: {displayPrice} {user.chosenCurrency}</p>
              <p className="mb-1">Available Quantity: {product.Available_quantity}</p>
              <p className="mb-1">Seller: {product.creator}</p>
            </div>

            <div className="flex justify-center mb-4">
              <span className="mr-2">Rating:</span>
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.round(avRating) ? "text-yellow-400" : "text-gray-300"} />
              ))}
              <span className="ml-2">({avRating.toFixed(1)})</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" onClick={handleWishlist}>
                {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              </Button>
              <QuantitySelector onChange={setQuantity} maxValue={product.Available_quantity} />
              {product.Available_quantity > 0 && (
                <Button variant="outline" onClick={handleCart}>
                  <FaShoppingCart className={isAddedToCart ? "text-green-500" : ""} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="link" onClick={() => setShowReviews(!showReviews)}>
          {showReviews ? "Hide Reviews" : "Show Reviews"}
        </Button>
      </CardFooter>
      {showReviews && (
        <div className="px-6 pb-6">
          {product.review.length > 0 ? (
            product.review.map((r, index) => (
              <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
                <p className="font-semibold">{r.user?.userName || "Anonymous"}</p> 
                <p>{r.reviewText}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}

        </div>
      )}

      <Modal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        centered
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        <div className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPreview(false)}
          >
            <IoClose size={24} />
          </button>
          <img
            src={product?.profilePicture ? `http://localhost:3000${product.profilePicture}` : avatar}
            alt="Product Preview"
            className="max-w-full max-h-[80vh] object-contain mx-auto"
          />
        </div>
      </Modal>

	
    </Card>
  );
}

export default ProductContainer;

