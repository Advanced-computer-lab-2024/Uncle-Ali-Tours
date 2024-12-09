import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTouristStore } from '../store/tourist';
import { useUserStore } from '../store/user';

const UpcomingItinerariesContainer = () => {
  const { fetchUpcomingItems, handleUnBook } = useTouristStore();
  const { user } = useUserStore();
  const [upcomingItineraries, setUpcomingItineraries] = useState([]);
  const navigate = useNavigate();

  const fetchMyUpcomingItineraries = async () => {
    try {
      const response = await fetchUpcomingItems(user.userName , 'itinerary');
      console.log('API Response:', response , response.success); // Log the API response
      console.log('success api:', response.success); // Log the user object
        setUpcomingItineraries(response);
      
    } catch (error) {
      console.error('Error fetching upcoming itineraries:', error);
      toast.error('Error fetching upcoming itineraries', { className: "text-white bg-gray-800" });
    }
  };

  useEffect(() => {

    fetchMyUpcomingItineraries();
  }, [user.userName]);

  const handleUnBookClick = async (itineraryID,quantity) => {
    try {
      const response = await handleUnBook(user.userName,itineraryID,quantity);
      if (response.success) {
        toast.success(response.message, { className: "text-white bg-gray-800" });
        setUpcomingItineraries(prevItineraries => prevItineraries.filter(itinerary => itinerary.itemDetails._id !== itineraryID));
      } else {
        console.error(response.message, { className: "text-white bg-gray-800" });
      }
    } catch (error) {
      console.error('Error unbooking itinerary:', error.message);
      toast.error('Error unbooking itinerary', { className: "text-white bg-gray-800" });
    }
  };

  useEffect(() => {
  console.log(upcomingItineraries);
    }, [upcomingItineraries]);

  return (
    <div className="p-4">
      <h1>Upcoming Itineraries</h1>
      {upcomingItineraries.length === 0 ? (
        <p>No upcoming itineraries found.</p>
      ) : (
        upcomingItineraries.map((itinerary, index) => (
          <div key={index} className="mb-6 text-black text-left w-fit min-w-[45ch] bg-white mx-auto h-fit rounded shadow-md p-4 border-2 border-gray-300">
            <h2>{itinerary.itemDetails.name}</h2>
            <p>Preference Tag: {itinerary.itemDetails.preferenceTag}</p>
            <p>Language: {itinerary.itemDetails.language}</p>
            <p>Price: {(itinerary.itemDetails.price * user.currencyRate).toFixed(2)} {user.chosenCurrency}</p>
            <h3>Activities:</h3>
            <ul>
              {itinerary.itemDetails.activities.map((activity, index) => (
                <li key={index}>
                  <p>Activity {index + 1}: {activity.name} &nbsp; Duration: {activity.duration} hours</p>
                </li>
              ))}
            </ul>
            <p>Pickup Location: {itinerary.itemDetails.pickupLocation}</p>
            <p>Dropoff Location: {itinerary.itemDetails.dropoffLocation}</p>
            <h3>Locations:</h3>
            <ul>
              {itinerary.itemDetails.tourLocations.map((loc, index) => (
                <li key={index}>
                  <p>{loc}</p>
                </li>
              ))}
            </ul>
            <h3>Available Dates:</h3>
            <ul>
              {itinerary.itemDetails.availableDates?.map((date, index) => (
                <li key={index}>
                  <p>{date}</p>
                </li>
              ))}
            </ul>
            <h3>Available Times:</h3>
            <ul>
              {itinerary.itemDetails.availableTimes.map((time, index) => (
                <li key={index}>
                  <p>{time}</p>
                </li>
              ))}
            </ul>
            <p>Accessibility: {itinerary.itemDetails.accessibility}</p>
            <p>Creator: {itinerary.itemDetails.creator}</p>
            <p>Quantity: {itinerary.quantity}</p>
            <button onClick={() => handleUnBookClick(itinerary.itemDetails._id , itinerary.quantity)} className="p-2 bg-blue-500 text-white">
              Unbook
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default UpcomingItinerariesContainer;