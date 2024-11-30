import React, { useEffect, useState } from "react";
import { useTouristStore } from "../store/tourist";

const CartPage = ({ user }) => {
    const { cartProducts, errorMessage, getCartProducts, removeProductCart } = useTouristStore();
    const [localCartProducts, setLocalCartProducts] = useState([]);

    useEffect(() => {
        if (user.userName) {
            getCartProducts(user.userName);
        }
    }, [user, getCartProducts]);

    useEffect(() => {
        setLocalCartProducts(cartProducts); // Sync local state with store
    }, [cartProducts]);

    const handleRemove = async (productId) => {
        // Optimistically update the UI
        setLocalCartProducts((prev) => prev.filter((product) => product._id !== productId));

        // Perform the API call
        const response = await removeProductCart(user.userName, productId);
        if (!response.success) {
            console.error(response.message);

            // Revert the UI change if API call fails
            setLocalCartProducts(cartProducts);
        }
    };

    return (
        <div className="Cart-page">
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

            {errorMessage && (
                <div className="error-message bg-red-100 text-red-700 p-3 rounded mb-4">
                    {errorMessage}
                </div>
            )}

            {localCartProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {localCartProducts.map((product) => (
                        <div key={product._id} className="product-card p-4 border rounded shadow">
                            <h2 className="text-xl font-semibold">{product.name}</h2>
                            <p>{product.description}</p>
                            <p className="text-gray-500">Price: ${product.price}</p>
                            <button
                                className="mt-2 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
                                onClick={() => handleRemove(product._id)}
                            >
                                Remove from Cart
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No products in your Cart yet.</p>
            )}
        </div>
    );
};

export default CartPage;
