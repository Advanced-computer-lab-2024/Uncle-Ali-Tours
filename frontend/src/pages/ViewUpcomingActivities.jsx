import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/user';
import { useTouristStore } from '../store/tourist';
import ActivityContainer from '../components/ActivityContainer';
function ViewUpcomingActivities() {
    const { user } = useUserStore();
    const { fetchUpcomingActivities } = useTouristStore();
    const [upcomingActivities, setUpcomingActivities] = useState([]); // Initialize with an empty array

    // Fetch upcoming itineraries when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            if (user && user.userName) {
                const data = await fetchUpcomingActivities(user.userName); // Await the asynchronous call
                setUpcomingActivities(data); // Update state with the fetched data
            }
        };

        fetchData(); // Call the function
    }, [user, fetchUpcomingActivities]);

    return (
        <div>
            <div>View Upcoming Activities</div>
            {upcomingActivities.length > 0 ? (
                upcomingActivities.map((activity, index) => (
                    <ActivityContainer key={index} activity={activity} />
                ))
            ) : (
                <p>No upcoming activities found.</p>
            )}
        </div>
    );
}

export default ViewUpcomingActivities