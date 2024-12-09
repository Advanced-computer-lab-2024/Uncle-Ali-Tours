import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTouristStore } from "../store/tourist";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { FaTrash, FaStar } from "react-icons/fa";
import egypt from "../images/egypt.jpg";
import avatar from "/avatar.png";
import { Modal } from "react-bootstrap";
import { IoClose } from "react-icons/io5";

const CartPage = ({ user }) => {
    const { cartProducts, errorMessage, getCartProducts, checkoutProducts, removeProductCart } = useTouristStore();
    const navigate = useNavigate();
    const [showPreview, setShowPreview] = useState({});
    const [localCartProducts, setLocalCartProducts] = useState([]);

    useEffect(() => {
        getCartProducts(user.userName);
    }, [user.userName, getCartProducts]);

    useEffect(() => {
        setLocalCartProducts(cartProducts);
    }, [cartProducts]);

    const handleCheckout = () => {
        if (localCartProducts.length === 0) {
            toast.error("Your cart is empty. Please add some products before checking out.", { className: "text-white bg-gray-800" });
            return;
        }

        checkoutProducts(); // Move all cart products to checkout
        navigate(`/payment/product/id`); // Redirect to the Checkout Page
    };

    const handleRemove = async (productId) => {
        const { success, message } = await removeProductCart(user.userName, productId);
        if (success) {
            setLocalCartProducts(prevProducts => prevProducts.filter(product => product.productId._id !== productId));
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
                    className="w-full max-w-4xl bg-white bg-opacity-90 p-8 rounded-lg shadow-lg backdrop-blur-md"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold mb-6 text-center text-[#dc5809]"
                    >
                        Your Cart
                    </motion.h1>

                    {errorMessage && (
                        <div className="error-message bg-red-100 text-red-700 p-3 rounded mb-4">
                            {errorMessage}
                        </div>
                    )}

                    {localCartProducts.length > 0 ? (
                        <div>
                            {localCartProducts.map((product) => (
                                <motion.div
                                    key={product.productId._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4"
                                >
                                    <div className="relative justify-around items-center p-1 w-full min-h-[200px] content-center flex backdrop-blur-lg bg-[#ECEBDE]/75 rounded-lg shadow-lg text-black">
                                        <img
                                            src={product.productId.profilePicture ? `http://localhost:3000${product.productId.profilePicture}` : avatar}
                                            alt="Product Preview"
                                            className="w-[20%] rounded-full hover:cursor-pointer"
                                            onClick={() => setShowPreview({...showPreview, [product.productId._id]: true})}
                                        />
                                        <hr className="h-[150px] w-[1px] bg-black text-black" />
                                        <div className="grid p-2 w-[60%]">
                                            <div className="flex my-1 p-2 rounded-sm">
                                                <p className="text-left font-semibold">Name:</p>
                                                <p className="text-left pl-4">{product.productId.name}</p>
                                            </div>
                                            <div className="flex my-1 p-2 rounded-sm">
                                                <p className="text-left font-semibold">Price:</p>
                                                <p className="text-left pl-4">{(product.productId.price * user.currencyRate).toFixed(2)} {user.chosenCurrency}</p>
                                            </div>
                                            <div className="flex my-1 p-2 rounded-sm">
                                                <p className="text-left font-semibold">Quantity:</p>
                                                <p className="text-left pl-4">{product.quantity}</p>
                                            </div>
                                            <div className="flex my-1 p-2 rounded-sm">
                                                <p className="text-left font-semibold">Description:</p>
                                                <p className="text-left pl-4">{product.productId.description}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemove(product.productId._id)}
                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                    <Modal
                                        show={showPreview[product.productId._id]}
                                        onHide={() => setShowPreview({...showPreview, [product.productId._id]: false})}
                                        centered
                                        className="fixed inset-0 flex items-center justify-center z-50"
                                    >
                                        <div className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
                                            <button
                                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                                onClick={() => setShowPreview({...showPreview, [product.productId._id]: false})}
                                            >
                                                <IoClose size={24} />
                                            </button>
                                            <img
                                                src={product.productId.profilePicture ? `http://localhost:3000${product.productId.profilePicture}` : avatar}
                                                alt="Product Preview"
                                                className="max-w-full max-h-[80vh] object-contain mx-auto"
                                            />
                                        </div>
                                    </Modal>
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6"
                            >
                                <button
                                    onClick={handleCheckout}
                                    className="w-full py-3 text-lg bg-[#dc5809] text-white rounded-md hover:bg-[#b94a08] transition-colors duration-300"
                                >
                                    Proceed to Checkout
                                </button>
                            </motion.div>
                        </div>
                    ) : (
                        <p className="text-center text-gray-600">Your cart is empty. Start adding some products!</p>
                    )}
                </motion.div>
            </div>

            <footer className="relative z-10 bg-black bg-opacity-80 text-white text-center py-4 mt-8 w-full">
                <p>© {new Date().getFullYear()} All Rights Reserved</p>
            </footer>
        </div>
    );
};

export default CartPage;

