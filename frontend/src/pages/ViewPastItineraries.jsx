import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/user';
import { useTouristStore } from '../store/tourist';
import ItineraryContainer from '../components/ItineraryContainer';

function ViewPastItineraries() {
    const { user } = useUserStore();
    const { fetchPastItineraries } = useTouristStore();
    const [pastItineraries, setPastItineraries] = useState([]); // Initialize with an empty array

    // Fetch upcoming itineraries when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            if (user && user.userName) {
                const data = await fetchPastItineraries(user.userName); // Await the asynchronous call
                setPastItineraries(data); // Update state with the fetched data
            }
        };

        fetchData(); // Call the function
    }, [user, fetchPastItineraries]);

    return (
        <div>
            <div>View Past Itineraries</div>
            {pastItineraries.length > 0 ? (
                pastItineraries.map((itinerary, index) => (
                    <ItineraryContainer key={index} itinerary={itinerary} />
                ))
            ) : (
                <p>No Past itineraries found.</p>
            )}
        </div>
    );
}
export default ViewPastItineraries