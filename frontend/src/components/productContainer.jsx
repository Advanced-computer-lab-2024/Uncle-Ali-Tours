import React, { useState } from 'react';
import toast , {Toaster}from 'react-hot-toast';

function ProductContainer({ product, productChanger, tourist }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState(null); // "rate" or "review"
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');

    // Handle opening the dialog
    const openDialog = (type) => {
        setDialogType(type);
        setIsDialogOpen(true);
    };

    // Close dialog
    const closeDialog = () => {
        setIsDialogOpen(false);
        setDialogType(null);
        setRating(0);
        setReview('');
    };

    // Handle submit based on dialog type
    const handleSubmit = () => {
        if (dialogType === 'rate') {
            toast.success(`Rating submitted: ${rating}/5`, { className: "text-white bg-gray-800" });
        } else if (dialogType === 'review') {
            toast.success(`Review submitted: "${review}"`, { className: "text-white bg-gray-800" });
        }
        closeDialog();
    };

    // Handle eligibility check for rate or review
    const handleReviewClick = async (type) => {
        try {
            const response = await fetch(`http://localhost:3000/api/tourist/check-purchase/${tourist.userName}/${product._id}`);
            const data = await response.json();

            if (data.canReview) {
                openDialog(type);
            } else {
                toast.error(data.message, { className: "text-white bg-gray-800" });
            }
        } catch (error) {
            console.error('Error checking purchase status', error);
            toast.error('There was an error checking purchase status. Please try again.', { className: "text-white bg-gray-800" });
        }
    };

    return (
        <div className='mb-6 text-black text-left w-fit min-w-[45ch] bg-white mx-auto rounded h-fit'>
            <Toaster />
            <div className='grid p-2'>
                {/* Product Details */}
                {Object.keys(product).map((key, index) => (
                    <p key={index}>{`${key}: ${product[key]}`}</p>
                ))}
                <button onClick={() => handleReviewClick('review')}>
                    Review
                </button>
                <button onClick={() => handleReviewClick('rate')}>
                    Rate
                </button>
            </div>

            {/* Dialog for Rating or Review */}
            {isDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-md w-80">
                        <h2 className="text-lg font-bold mb-4">
                            {dialogType === 'rate' ? 'Rate the Product' : 'Write a Review'}
                        </h2>
                        
                        {dialogType === 'rate' && (
                            <div className="mb-4">
                                <label className="block mb-2">Rating (out of 5):</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    className="border border-gray-300 p-2 rounded w-full"
                                />
                            </div>
                        )}

                        {dialogType === 'review' && (
                            <div className="mb-4">
                                <label className="block mb-2">Your Review:</label>
                                <textarea
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    className="border border-gray-300 p-2 rounded w-full"
                                    rows="4"
                                />
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            className="bg-blue-500 text-white p-2 rounded mr-2"
                        >
                            Submit
                        </button>
                        <button
                            onClick={closeDialog}
                            className="bg-gray-300 text-black p-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductContainer;
