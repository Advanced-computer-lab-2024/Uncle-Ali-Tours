import React, { useEffect, useState } from "react";
import { useTouristStore } from "../store/tourist";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import QuantitySelector from "../components/QuantitySelector";
import toast, { Toaster } from 'react-hot-toast';

const WishlistPage = ({ user }) => {
    const {
        wishlistedProducts,
        errorMessage,
        getWishlistedProducts,
        removeProductWishlist,
        cartProducts,
        getCartProducts,
    } = useTouristStore(); // Include cartProducts and getCartProducts from store
    const { addProductToCart, removeProductCart } = useTouristStore();
    const [localWishlistProducts, setLocalWishlistProducts] = useState([]);
    const [cartStatus, setCartStatus] = useState({});
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [isAddedToCart, setIsAddedToCart] = useState(false);

    // Fetch wishlist products
    useEffect(() => {
        if (user.userName) {
            getWishlistedProducts(user.userName);
        }
    }, [user, getWishlistedProducts]);

    // Fetch cart products to sync status
    useEffect(() => {
        if (user.userName) {
            getCartProducts(user.userName);
        }
    }, [user, getCartProducts]);

    // Sync wishlist products and initialize cart status
    useEffect(() => {
        setLocalWishlistProducts(wishlistedProducts);
    }, [wishlistedProducts]);

    // Update cartStatus based on cart products
    useEffect(() => {
        const updatedCartStatus = localWishlistProducts.reduce((acc, product) => {
            acc[product._id] = cartProducts.some((cartProduct) => cartProduct._id === product._id);
            return acc;
        }, {});
        setCartStatus(updatedCartStatus);
    }, [localWishlistProducts, cartProducts]);

    const handleRemove = async (productId) => {
        setLocalWishlistProducts((prev) => prev.filter((product) => product._id !== productId));
        const response = await removeProductWishlist(user.userName, productId);
        if (!response.success) {
            console.error(response.message);
            setLocalWishlistProducts(wishlistedProducts);
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
    

    const handleRemoveFromCart = async (productId) => {
        const { success, message } = await removeProductCart(user.userName, productId);
        if (success) {
            setCartStatus((prevStatus) => ({ ...prevStatus, [productId]: false }));
            toast.success(message, { className: "text-white bg-gray-800" });
        } else {
            toast.error(message, { className: "text-white bg-gray-800" });
        }
    };

    return (
        <div className="Cart-page">
            {/* Back Arrow */}
            <button
                onClick={() => navigate(-1)}
                className="text-blue-500 hover:underline mb-4 flex items-center"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 mr-2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
                Back
            </button>

            <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>

            {errorMessage && (
                <div className="error-message bg-red-100 text-red-700 p-3 rounded mb-4">
                    {errorMessage}
                </div>
            )}

            {localWishlistProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {localWishlistProducts.map((product) => (
                        <div key={product._id} className="product-card p-4 border rounded shadow">
                            <h2 className="text-xl font-semibold">{product.name}</h2>
                            <p>{product.description}</p>
                            <p className="text-gray-500">Price: ${product.price}</p>
                            <button
                                className="mt-2 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
                                onClick={() => handleRemove(product._id)}
                            >
                                Remove from Wishlist
                            </button>
                            <QuantitySelector onChange={handleQuantityChange} maxValue={product.Available_quantity} />
                            <button
                                onClick={() =>
                                    cartStatus[product._id]
                                        ? handleRemoveFromCart(product._id)
                                        : handleCart(product._id)
                                }
                                className="transform transition-colors duration-300 hover:text-red-500 focus:outline-none"
                            >
                                {cartStatus[product._id] ? (
                                    <FaShoppingCart className="text-green-500" />
                                ) : (
                                    <FaShoppingCart className="text-gray-500" />
                                )}
                            </button>
                            {user?.type === "tourist" && (
                                <Link to="/Cart" className="text-blue-500 hover:underline">
                                    My Cart
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No products in your wishlist yet.</p>
            )}
        </div>
    );
};

export default WishlistPage;
