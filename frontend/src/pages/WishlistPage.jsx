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
<<<<<<< Updated upstream
        <div className="wishlist-page">
            <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>
=======
        <div style={containerStyle} className="min-h-screen relative">
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
>>>>>>> Stashed changes

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