import React, { useEffect, useState } from 'react';
import ActivityContainer from '../components/ActivityContainer';
import { useTouristStore } from '../store/tourist';
import { useUserStore } from '../store/user';
function ViewPastActivities() {
    const { user } = useUserStore();
    const { fetchPastActivities } = useTouristStore();
    const [pastActivities, setPastActivities] = useState([]); // Initialize with an empty array

    // Fetch upcoming itineraries when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            if (user && user.userName) {
                const data = await fetchPastActivities(user.userName); // Await the asynchronous call
                console.log('Data:', data); // Log the fetched data
                setPastActivities(data); // Update state with the fetched data
            }
        };

        fetchData(); // Call the function
    }, [user, fetchPastActivities]);

    return (
        <div>
            <div>View Past Activities</div>
            {pastActivities.length > 0 ? (
                pastActivities.map((activity, index) => (
                    <ActivityContainer key={index} activity={activity} />
                ))
            ) : (
                <p>No past activities found.</p>
            )}
        </div>
    );
}

export default ViewPastActivities