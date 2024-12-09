import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useTouristStore } from '../store/tourist';
import { useUserStore } from '../store/user';

const UpcomingTActivitiesContainer = () => {
  const { fetchUpcomingItems, handleUnBook } = useTouristStore();
  const { user } = useUserStore();
  const [upcomingTActivities, setUpcomingTActivities] = useState([]);

  const fetchUpcomingTActivities = async () => {
    try {
      const response = await fetchUpcomingItems(user.userName, 'tActivity');
      console.log('API Response:', response); // Log the API response
      
        console.log('Setting upcoming transportation activities:', response.data); // Log the data being set
          setUpcomingTActivities(response);

    } catch (error) {
      console.error('Error fetching upcoming activities:', error.message);
      toast.error('Error fetching upcoming activities', { className: "text-white bg-gray-800" });
    }
  };

  useEffect(() => {
    fetchUpcomingTActivities();
  }, [user.userName, fetchUpcomingItems]);

  const handleUnBookClick = async (activityID, quantity) => {
    try {
      const response = await handleUnBook(user.userName, activityID, quantity);
      if (response.success) {
        toast.success(response.message, { className: "text-white bg-gray-800" });
        fetchUpcomingTActivities();
      } else {
        console.error(response.message, { className: "text-white bg-gray-800" });
      }
    } catch (error) {
      console.error('Error unbooking T activity:', error.message);
      toast.error('Error unbooking T activity', { className: "text-white bg-gray-800" });
    }
  };

  return (
    <div className="p-4">
      <h1>Upcoming Transportation Activities</h1>
      <Toaster />
      {upcomingTActivities.length === 0 ? (
        <p>No upcoming transportation activities found.</p>
      ) : (
        upcomingTActivities.map((activity, index) => (
          <div key={index} className="mb-6 text-black text-left w-fit min-w-[45ch] bg-white mx-auto h-fit rounded shadow-md p-4 border-2 border-gray-300">
            <h2>{activity.itemDetails.name}</h2>
            <p>Date: {new Date(activity.itemDetails.date).toLocaleDateString()}</p>
            <p>Time: {activity.itemDetails.time}</p>
            <p>pickUpLocation: {activity.itemDetails.pickUpLocation}</p>
            <p>dropOffLocation: {activity.itemDetails.dropOfLocation}</p>
            <p>Price: {(activity.itemDetails.price * user.currencyRate).toFixed(2)} {user.chosenCurrency}</p>
            <p>Creator: {activity.itemDetails.creator}</p>
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

export default UpcomingTActivitiesContainer;