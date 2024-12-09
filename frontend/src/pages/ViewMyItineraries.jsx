import React, { useEffect, useState } from 'react';
import TouristItineraryContainer from '../components/TouristItineraryContainer';
import UpcomingItinerariesContainer from '../components/UpcomingItinerariesContainer';
import { useTouristStore } from '../store/tourist';

function ViewMyItineraries() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const { fetchUpcomingItems,fetchPastItineraries } = useTouristStore();
    const [myItineraries, setMyItineraries] = useState([]); // Initialize with an empty array
    const [upcomingButton, setUpcomingButton] = useState(false);
    useEffect(() => {
        fetchItineraries();
    }, [upcomingButton]);

    const fetchItineraries = async () => {
        const result = upcomingButton
          ? await fetchPastItineraries(user.userName)
          : await fetchUpcomingItems(user.userName , "itinerary");  
        setMyItineraries(result);
    };
    
    if (!myItineraries){
      console.log("loading", myItineraries)  
        return null}

        console.log("loaded")
    return (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-gradient-to-b shadow-xl relative from-[#C1BAA1] min-h-[60vh] w-full mx-auto rounded-lg p-6">
          <h1 className='justify-center text-2xl'>My Itineraries</h1>
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
            {myItineraries.length > 0 && upcomingButton ? (
                myItineraries.map((itinerary, index) => (
                    <TouristItineraryContainer key={index} itinerary={itinerary} />
                ))
            ) : (
                <UpcomingItinerariesContainer itineraries={myItineraries} />
            )}
            </div>
          </div>
        </div>
      );
    }

export default ViewMyItineraries