import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTouristStore } from "../store/tourist";


const CartPage = ({ user }) => {
    const { cartProducts, errorMessage, getCartProducts, checkoutProducts, removeProductCart } = useTouristStore();
    const navigate = useNavigate();

    useEffect(() => {
    getCartProducts(user.userName);
    }, [getCartProducts, user.userName]);

    const handleCheckout = () => {
        if (cartProducts.length === 0) {
            alert("Your cart is empty. Please add some products before checking out.");
            return;
        }

        checkoutProducts(); // Move all cart products to checkout
        navigate(`/payment/product/id`); // Redirect to the Checkout Page
    };

    const handleRemove = (productId) => {
        removeProductCart(user.userName,productId);
        
    };

    return (
        <div className="Cart-page">
            {/* Back Arrow */}
            <button
                onClick={() => navigate(-1)} // Go back to the previous page
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

            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

            {/* Display error message if it exists */}
            {errorMessage && (
                <div className="error-message bg-red-100 text-red-700 p-3 rounded mb-4">
                    {errorMessage}
                </div>
            )}

            {/* Display Cart products */}
            {cartProducts.length > 0 ? (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {cartProducts.map((product) => (
                            <div key={product.productId._id} className="product-card p-4 border rounded shadow">
                                <h2 className="text-xl font-semibold">{product.productId.name}</h2>
                                <p>{product.productId.description}</p>
                                <p className="text-gray-500">Price: ${product.productId.price}</p>
                                <p className="text-gray-500">Quantity: {product.quantity}</p>
                                <button
                                    className="mt-2 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
                                    onClick={() => handleRemove(product.productId._id)} // Pass productId to remove
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Checkout button */}
                    <button
                        className="mt-4 bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
                        onClick={handleCheckout}
                    >
                        Checkout
                    </button>
                </div>
            ) : (
                <p>No products in your cart yet.</p>
            )}
        </div>
    );
};

export default CartPage;
