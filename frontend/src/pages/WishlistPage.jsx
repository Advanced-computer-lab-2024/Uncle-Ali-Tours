import React, { useEffect } from "react";
import { useTouristStore } from '../store/tourist';

const WishlistPage = ({ user }) => {
    const { wishlistedProducts, errorMessage, getWishlistedProducts } = useTouristStore(); // Access state from the store

    useEffect(() => {
        if (user.userName) {
            console.log("User", user);
            getWishlistedProducts(user.userName);
        }
    }, [user, getWishlistedProducts]);

    return (
        <div className="wishlist-page">
            <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>

            {/* Display error message if it exists */}
            {errorMessage && (
                <div className="error-message bg-red-100 text-red-700 p-3 rounded mb-4">
                    {errorMessage}
                </div>
            )}

            {/* Display wishlisted products */}
            {wishlistedProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {wishlistedProducts.map((product) => (
                        <div key={product._id} className="product-card p-4 border rounded shadow">
                            <h2 className="text-xl font-semibold">{product.name}</h2>
                            <p>{product.description}</p>
                            <p className="text-gray-500">Price: ${product.price}</p>
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