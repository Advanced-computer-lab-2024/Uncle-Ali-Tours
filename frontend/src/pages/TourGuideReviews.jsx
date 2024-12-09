import React, { useEffect } from 'react';
import { useGuideStore } from '../store/tourGuide';

const TourGuidesPage = () => {
    const { allGuides, fetchAllGuides } = useGuideStore();
    
    useEffect(() => {
        fetchAllGuides();
    }, [fetchAllGuides]);

    return (
        <div className="tour-guides-page">
            <h1 className="text-3xl font-bold mb-6">All Tour Guides</h1>
            {allGuides?.length === 0 ? (
                <p>No tour guides available at the moment.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allGuides?.map((guide) => (
                        <div key={guide.userName} className="guide-card p-4 border rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold">{guide.name || guide.userName}</h2>
                            <p><strong>Rating:</strong> {guide.rating ? `${guide.rating}/5` : 'No rating yet'}</p>
                            <p><strong>Number of Reviews:</strong> {guide.numReviews || 0}</p>
                            {guide.reviews && guide.reviews.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-medium mt-2">Reviews:</h3>
                                    <ul className="list-disc ml-6">
                                        {guide.reviews.slice(0, 2).map((review, index) => (
                                            <li key={index}>
                                                <strong>{review.userName}</strong>: {review.comment}
                                            </li>
                                        ))}
                                    </ul>
                                    
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TourGuidesPage;