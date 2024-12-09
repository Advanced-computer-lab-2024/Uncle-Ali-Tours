import React, { useEffect, useState } from 'react';
import UpcomingActivitiesContainer from '../components/UpcomingActivitiesContainer';
import { useTouristStore } from '../store/tourist';
import { useUserStore } from '../store/user';
function ViewUpcomingActivities() {
    const { user } = useUserStore();
    const { fetchUpcomingItems } = useTouristStore();
    const [upcomingActivities, setUpcomingActivities] = useState([]); // Initialize with an empty array

    // Fetch upcoming itineraries when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            if (user && user.userName) {
                const data = await fetchUpcomingItems(user.userName, 'activity');  // Await the asynchronous call
                setUpcomingActivities(data); // Update state with the fetched data
            }
        };

        fetchData(); // Call the function
    }, [user, fetchUpcomingItems]);

    return (
        <div>
            <div>View Upcoming Activities</div>
            {upcomingActivities.length > 0 ? (
                <div>
                <UpcomingActivitiesContainer />
              </div>) : (
                <p>No upcoming activities found.</p>
            )}
        </div>
    );
}

export default ViewUpcomingActivities