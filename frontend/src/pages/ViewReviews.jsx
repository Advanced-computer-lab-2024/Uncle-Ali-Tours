// ViewReviews.jsx
import React from 'react';
import { useItineraryStore } from '../store/itinerary.js';

function ViewReviews() {
  const { currentItinerary } = useItineraryStore();

  console.log('Current Itinerary:', currentItinerary); // Check if this logs correctly

  if (!currentItinerary || !currentItinerary.reviews) {
    return <p>No reviews available.</p>;
  }

  return (
    <div>
      <h2>Reviews for {currentItinerary.name}</h2>
      <ul>
        {currentItinerary.reviews.map((review, index) => (
          <li key={index}>
            <p>Rating: {review.rating}</p>
            <p>Comment: {review.comment}</p>
            <p>User: {review.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewReviews;
