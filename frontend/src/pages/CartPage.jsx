import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTouristStore } from "../store/tourist";

const CartPage = ({ user }) => {
    const { cartProducts, errorMessage, getCartProducts, checkoutProducts } = useTouristStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (user.userName) {
            console.log("User", user);
            getCartProducts(user.userName);
        }
    }, [user, getCartProducts]);

    const handleCheckout = () => {
        if (cartProducts.length === 0) {
            alert("Your cart is empty. Please add some products before checking out.");
            return;
        }

        checkoutProducts(); // Move all cart products to checkout
        navigate("/checkoutPage"); // Redirect to the Checkout Page
    };

    return (
        <div className="Cart-page">
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
                            <div key={product._id} className="product-card p-4 border rounded shadow">
                                <h2 className="text-xl font-semibold">{product.name}</h2>
                                <p>{product.description}</p>
                                <p className="text-gray-500">Price: ${product.price}</p>
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
