import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useTouristStore } from '../store/tourist';
import { useUserStore } from '../store/user';

const UpcomingActivitiesContainer = () => {
  const { fetchUpcomingItems, handleUnBook } = useTouristStore();
  const { user } = useUserStore();
  const [upcomingActivities, setUpcomingActivities] = useState([]);

  useEffect(() => {
    const fetchUpcomingActivities = async () => {
      try {
        const response = await fetchUpcomingItems(user.userName, 'activity');
        console.log('API Response:', response); // Log the API response
        
          console.log('Setting upcoming activities:', response.data); // Log the data being set
            setUpcomingActivities(response);

      } catch (error) {
        console.error('Error fetching upcoming activities:', error.message);
        toast.error('Error fetching upcoming activities', { className: "text-white bg-gray-800" });
      }
    };

    fetchUpcomingActivities();
  }, [user.userName, fetchUpcomingItems]);

  const handleUnBookClick = async (activityID, quantity) => {
    try {
      const response = await handleUnBook(user.userName, activityID, quantity);
      if (response.success) {
        toast.success(response.message, { className: "text-white bg-gray-800" });
        setUpcomingActivities(prevActivities => prevActivities.filter(activity => activity.itemDetails._id !== activityID));
      } else {
        console.error(response.message, { className: "text-white bg-gray-800" });
      }
    } catch (error) {
      console.error('Error unbooking activity:', error);
      toast.error('Error unbooking activity', { className: "text-white bg-gray-800" });
    }
  };

  return (
    <div className="p-4">
      <h1>Upcoming Activities</h1>
      <Toaster />
      {upcomingActivities.length === 0 ? (
        <p>No upcoming activities found.</p>
      ) : (
        upcomingActivities.map((activity, index) => (
          <div key={index} className="mb-6 text-black text-left w-fit min-w-[45ch] bg-white mx-auto h-fit rounded shadow-md p-4 border-2 border-gray-300">
            <h2>{activity.itemDetails.name}</h2>
            <p>Date: {new Date(activity.itemDetails.date).toLocaleDateString()}</p>
            <p>Location: {activity.itemDetails.location?.coordinates ? activity.itemDetails.location.coordinates.join(', ') : "Not available"}</p>
            <p>Price: ${(activity.itemDetails.price * user.currencyRate).toFixed(2)} {user.chosenCurrency}</p>
            <p>Category: {activity.itemDetails.category}</p>
            <p>Tags: {activity.itemDetails.tags?.join(', ') || "No tags"}</p>
            <p>Special Discounts: {activity.itemDetails.specialDiscounts || "None"}</p>
            <p>Booking Open: {activity.itemDetails.bookingOpen ? "Yes" : "No"}</p>
            <p>Creator: {activity.itemDetails.creator}</p>
            <p>Average Rating: {activity.itemDetails.rating} (from {activity.itemDetails.numReviews} reviews)</p>
            <p>Quantity: {activity.quantity}</p>
            <button onClick={() => handleUnBookClick(activity.itemDetails._id, activity.quantity)} className="p-2 bg-blue-500 text-white">
              Unbook
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default UpcomingActivitiesContainer;