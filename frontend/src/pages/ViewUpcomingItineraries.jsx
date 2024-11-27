import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/user';
import { useTouristStore } from '../store/tourist';
import ItineraryContainer from '../components/ItineraryContainer';

function ViewUpcomingItineraries() {
    const { user } = useUserStore();
    const { fetchUpcomingItineraries } = useTouristStore();
    const [upcomingItineraries, setUpcomingItineraries] = useState([]); // Initialize with an empty array

    // Fetch upcoming itineraries when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            if (user && user.userName) {
                const data = await fetchUpcomingItineraries(user.userName); // Await the asynchronous call
                setUpcomingItineraries(data); // Update state with the fetched data
            }
        };

        fetchData(); // Call the function
    }, [user, fetchUpcomingItineraries]);

    return (
        <div>
            <div>View Upcoming Itineraries</div>
            {upcomingItineraries.length > 0 ? (
                upcomingItineraries.map((itinerary, index) => (
                    <ItineraryContainer key={index} itinerary={itinerary} />
                ))
            ) : (
                <p>No upcoming itineraries found.</p>
            )}
        </div>
    );
}

export default ViewUpcomingItineraries;
