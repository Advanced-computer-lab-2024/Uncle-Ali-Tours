import React, { useEffect, useState } from 'react';
import UpcomingTActivitiesContainer from '../components/UpcomingTActivitiesContainer';
import { useTouristStore } from '../store/tourist';
import { useUserStore } from '../store/user';
function ViewUpcomingTActivities() {
    const { user } = useUserStore();
    const { fetchUpcomingItems } = useTouristStore();
    const [upcomingTActivities, setUpcomingTActivities] = useState([]); // Initialize with an empty array

    // Fetch upcoming itineraries when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            if (user && user.userName) {
                const data = await fetchUpcomingItems(user.userName, 'tActivity');  // Await the asynchronous call
                setUpcomingTActivities(data); // Update state with the fetched data
            }
        };

        fetchData(); // Call the function
    }, [user, fetchUpcomingItems]);

    return (
        <div>
            <div>View Upcoming Transportation Activities</div>
            {upcomingTActivities.length > 0 ? (
                <div>
                <UpcomingTActivitiesContainer />
              </div>) : (
                <p>No upcoming activities found.</p>
            )}
        </div>
    );
}

export default ViewUpcomingTActivities