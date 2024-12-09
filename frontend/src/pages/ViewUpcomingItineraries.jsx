import React, { useEffect, useState } from 'react';
import UpcomingItinerariesContainer from '../components/UpcomingItinerariesContainer';
import { useTouristStore } from '../store/tourist';
import { useUserStore } from '../store/user';

function ViewUpcomingItineraries() {
    const { user } = useUserStore();
    const { fetchUpcomingItems , setIsUpcoming } = useTouristStore();
    const [upcomingItineraries, setUpcomingItineraries] = useState([]); // Initialize with an empty array

    // Fetch upcoming itineraries when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            if (user && user.userName) {
                const data = await fetchUpcomingItems(user.userName, 'itinerary'); // Await the asynchronous call
                setUpcomingItineraries(data); // Update state with the fetched data
            }
        };

        fetchData(); // Call the function
        setIsUpcoming(true);
    }, [user, fetchUpcomingItems, UpcomingItinerariesContainer]);

    return (
        <div>
            <div>View Upcoming Itineraries</div>
            {upcomingItineraries.length > 0 ? (
                <div>
                <UpcomingItinerariesContainer />
              </div>) : (
                <p>No upcoming itineraries found.</p>
            )}
        </div>
    );
}

export default ViewUpcomingItineraries;
