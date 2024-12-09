import React, { useEffect, useState } from 'react';
import TouristActivityContainer from '../components/TouristActivityContainer';
import UpcomingActivitiesContainer from '../components/UpcomingActivitiesContainer';
import { useTouristStore } from '../store/tourist';
function ViewMyActivities() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const { fetchUpcomingItems,fetchPastActivities } = useTouristStore();
    const [myActivities, setMyActivities] = useState([]); // Initialize with an empty array
    const [upcomingButton, setUpcomingButton] = useState(false);
    useEffect(() => {
        fetchActivities();
    }, [upcomingButton]);

    const fetchActivities = async () => {
        const result = upcomingButton
          ? await fetchPastActivities(user.userName)
          : await fetchUpcomingItems(user.userName , "activity");  
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
            {myActivities.length > 0 && upcomingButton ? (
                myActivities.map((activity, index) => (
                    <TouristActivityContainer key={index} activity={activity} />
                ))
            ) : (
                <UpcomingActivitiesContainer activities={myActivities} />
            )}
            </div>
          </div>
        </div>
      );
    }


export default ViewMyActivities