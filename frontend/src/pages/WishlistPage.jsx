import React, { useEffect, useState } from "react";
import { useTouristStore } from "../store/tourist";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import QuantitySelector from "../components/QuantitySelector";
import toast, { Toaster } from 'react-hot-toast';
import { motion } from "framer-motion";
import egypt from "../images/egypt.jpg";
import avatar from "/avatar.png";
import { Modal } from "react-bootstrap";
import { IoClose } from "react-icons/io5";

const WishlistPage = ({ user }) => {
    const {
        wishlistedProducts,
        errorMessage,
        getWishlistedProducts,
        removeProductWishlist,
        cartProducts,
        getCartProducts,
        addProductToCart,
        removeProductCart
    } = useTouristStore();

    const [localWishlistProducts, setLocalWishlistProducts] = useState([]);
    const [cartStatus, setCartStatus] = useState({});
    const [quantity, setQuantity] = useState({});
    const [showPreview, setShowPreview] = useState({});

    useEffect(() => {
        if (user.userName) {
            getWishlistedProducts(user.userName);
            getCartProducts(user.userName);
        }
    }, [user, getWishlistedProducts, getCartProducts]);

    useEffect(() => {
        setLocalWishlistProducts(wishlistedProducts);
        const initialQuantities = wishlistedProducts.reduce((acc, product) => {
            acc[product._id] = 1;
            return acc;
        }, {});
        setQuantity(initialQuantities);
    }, [wishlistedProducts]);

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
        } else {
            toast.success("Product removed from wishlist", { className: "text-white bg-gray-800" });
        }
    };

    const handleQuantityChange = (productId, newQuantity) => {
        setQuantity(prev => ({ ...prev, [productId]: newQuantity }));
    };

    const handleCart = async (id) => {
        if (user.type !== "tourist") {
            return toast.error("You are not allowed to add products to the Cart", { className: 'text-white bg-gray-800' });
        }
        
        const { success, message } = await addProductToCart(user.userName, id, quantity[id]);
        if (success) {
            setCartStatus(prev => ({ ...prev, [id]: true }));
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

    const containerStyle = {
        backgroundImage: `url(${egypt})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
    };

    return (
        <div style={containerStyle} className="min-h-screen relative">
            <Toaster />
            <div className="absolute inset-0 bg-black bg-opacity-60" />
            
            <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-3xl bg-white bg-opacity-90 p-8 rounded-lg shadow-lg backdrop-blur-md"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold mb-8 text-center text-[#dc5809]"
                    >
                        Your Wishlist
                    </motion.h1>

                    {errorMessage && (
                        <div className="error-message bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-center">
                            {errorMessage}
                        </div>
                    )}

                    {localWishlistProducts.length > 0 ? (
                        <div className="space-y-6">
                            {localWishlistProducts.map((product) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col sm:flex-row items-center bg-[#ECEBDE]/90 p-4 rounded-lg shadow-md"
                                >
                                    <img
                                        src={product.profilePicture ? `http://localhost:3000${product.profilePicture}` : avatar}
                                        alt={product.name}
                                        className="w-32 h-32 object-cover rounded-full hover:cursor-pointer mb-4 sm:mb-0 sm:mr-6"
                                        onClick={() => setShowPreview({...showPreview, [product._id]: true})}
                                    />
                                    <div className="flex-grow">
                                        <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                                        <p className="text-gray-600 mb-2">{product.description}</p>
                                        <p className="text-lg font-bold mb-4">Price: ${product.price}</p>
                                        <div className="flex flex-wrap items-center justify-between">
                                            <QuantitySelector 
                                                onChange={(newQuantity) => handleQuantityChange(product._id, newQuantity)} 
                                                maxValue={product.Available_quantity}
                                            />
                                            <div className="flex items-center mt-4 sm:mt-0">
                                                <button
                                                    onClick={() => handleRemove(product._id)}
                                                    className="text-red-500 hover:text-red-700 transition-colors duration-300 mr-4"
                                                    aria-label="Remove from wishlist"
                                                >
                                                    <FaTrash size={20} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        cartStatus[product._id]
                                                            ? handleRemoveFromCart(product._id)
                                                            : handleCart(product._id)
                                                    }
                                                    className={`flex items-center justify-center px-4 py-2 rounded-full transition-colors duration-300 ${
                                                        cartStatus[product._id]
                                                            ? "bg-green-500 text-white hover:bg-green-600"
                                                            : "bg-blue-500 text-white hover:bg-blue-600"
                                                    }`}
                                                    aria-label={cartStatus[product._id] ? "Remove from cart" : "Add to cart"}
                                                >
                                                    <FaShoppingCart className="mr-2" />
                                                    {cartStatus[product._id] ? "In Cart" : "Add to Cart"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <Modal
                                        show={showPreview[product._id]}
                                        onHide={() => setShowPreview({...showPreview, [product._id]: false})}
                                        centered
                                        className="fixed inset-0 flex items-center justify-center z-50"
                                    >
                                        <div className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
                                            <button
                                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                                onClick={() => setShowPreview({...showPreview, [product._id]: false})}
                                            >
                                                <IoClose size={24} />
                                            </button>
                                            <img
                                                src={product.profilePicture ? `http://localhost:3000${product.profilePicture}` : avatar}
                                                alt={product.name}
                                                className="max-w-full max-h-[80vh] object-contain mx-auto"
                                            />
                                        </div>
                                    </Modal>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-600 text-lg">Your wishlist is empty. Start adding some products!</p>
                    )}
                </motion.div>
                
                {user?.type === "tourist" && (
                    <Link to="/Cart" className="mt-8 inline-block bg-[#dc5809] text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#b94a08] transition-colors duration-300">
                        View My Cart
                    </Link>
                )}
            </div>

            <footer className="relative z-10 bg-black bg-opacity-80 text-white text-center py-4 mt-8 w-full">
                <p>© {new Date().getFullYear()} All Rights Reserved</p>
            </footer>
        </div>
    );
};

export default WishlistPage;

