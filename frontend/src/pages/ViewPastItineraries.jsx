import React, { useEffect, useState } from 'react';
import TouristItineraryContainer from '../components/TouristItineraryContainer';
import { useTouristStore } from '../store/tourist';
import { useUserStore } from '../store/user';

function ViewPastItineraries() {
    const { user } = useUserStore();
    const { fetchPastItineraries , setIsPast} = useTouristStore();
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
        setIsPast(true);
    }, [user, fetchPastItineraries]);

    return (
        <div>
            <div>View Past Itineraries</div>
            {pastItineraries.length > 0 ? (
                pastItineraries.map((itinerary, index) => (
                    <TouristItineraryContainer key={index} itinerary={itinerary} />
                ))
            ) : (
                <p>No Past itineraries found.</p>
            )}
        </div>
    );
}
export default ViewPastItineraries