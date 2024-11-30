import React from "react";
import { useTouristStore } from "../store/tourist";

const CheckoutPage = () => {
    const { checkoutList, removeFromCheckout } = useTouristStore();

    const handleRemove = (productId) => {
        removeFromCheckout(productId);
        alert("Product removed from checkout.");
    };

    return (
        <div className="Checkout-page">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            {checkoutList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {checkoutList.map((product) => (
                        <div key={product._id} className="product-card p-4 border rounded shadow">
                            <h2 className="text-xl font-semibold">{product.name}</h2>
                            <p>{product.description}</p>
                            <p className="text-gray-500">Price: ${product.price}</p>
                            <button
                                className="mt-2 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
                                onClick={() => handleRemove(product._id)}
                            >
                                Remove from Checkout
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No products in checkout yet.</p>
            )}
        </div>
    );
};

export default CheckoutPage;
