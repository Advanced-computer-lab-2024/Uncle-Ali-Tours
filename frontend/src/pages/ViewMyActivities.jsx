import React, { useEffect, useState } from 'react';
import ActivityContainer from '../components/ActivityContainer';
import { useTouristStore } from '../store/tourist';
import { useUserStore } from '../store/user';
function ViewMyActivities() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const { fetchUpcomingActivities,fetchPastActivities } = useTouristStore();
    const [myActivities, setMyActivities] = useState([]); // Initialize with an empty array
    const [upcomingButton, setUpcomingButton] = useState(false);
    useEffect(() => {
        fetchActivities();
    }, [upcomingButton]);

    const fetchActivities = async () => {
        const result = upcomingButton
          ? await fetchPastActivities(user.userName)
          : await fetchUpcomingActivities(user.userName);  
          setMyActivities(result);
    };
    
    if (!myActivities){
      console.log("loading", myActivities)  
        return null}

        console.log("loaded")
    return (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-gradient-to-b shadow-xl relative from-[#C1BAA1] min-h-[60vh] w-full mx-auto rounded-lg p-6">
          <h1 className='justify-center text-2xl'>My Activities</h1>
          <br/>
          <div className="flex justify-center mb-4">
                    <button
                      className={`px-4 py-2 rounded-l-lg ${
                        !upcomingButton
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => setUpcomingButton(false)}
                    >
                      Upcoming
                    </button>
                    <button
                      className={`px-4 py-2 rounded-r-lg ${
                        upcomingButton
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => setUpcomingButton(true)}
                    >
                      Past
                    </button>
                  </div>
            <div className="mt-24">
            {myActivities.length > 0 ? (
                myActivities.map((activity, index) => (
                    <ActivityContainer key={index} activity={activity} />
                ))
            ) : (
                <p>No upcoming itineraries found.</p>
            )}
            </div>
          </div>
        </div>
      );
    }


export default ViewMyActivities