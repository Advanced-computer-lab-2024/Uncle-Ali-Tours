import React, { useEffect, useState } from "react";
import { useTouristStore } from "../store/tourist";

const WishlistPage = ({ user }) => {
    const { wishlistedProducts, errorMessage, getWishlistedProducts, removeProductWishlist } = useTouristStore();
    const [localWishlistProducts, setLocalWishlistProducts] = useState([]);

    useEffect(() => {
        if (user.userName) {
            getWishlistedProducts(user.userName);
        }
    }, [user, getWishlistedProducts]);

    useEffect(() => {
        setLocalWishlistProducts(wishlistedProducts); // Sync local state with store
    }, [wishlistedProducts]);

    const handleRemove = async (productId) => {
        // Optimistically update the UI
        setLocalWishlistProducts((prev) => prev.filter((product) => product._id !== productId));

        // Perform the API call
        const response = await removeProductWishlist(user.userName, productId);
        if (!response.success) {
            console.error(response.message);

            // Revert the UI change if API call fails
            setLocalWishlistProducts(wishlistedProducts);
        }
    };

    return (
        <div className="Cart-page">
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
