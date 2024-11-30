import React, { useEffect, useState } from 'react';
import { useItineraryStore } from '../store/itinerary';
import toast from 'react-hot-toast';
import ItineraryContainer from '../components/ItineraryContainer';
import Dialog from '../components/Dialog';

function AdminItineraryPage() {
  const { itineraries, getItineraries, flagItinerary } = useItineraryStore(); 
  const [curItinerary, setCurItinerary] = useState(null);
  const [showFlagDialog, setShowFlagDialog] = useState(false);

  useEffect(() => {
    getItineraries();  // Fetch all itineraries regardless of appropriateness
  }, []);

  const handleFlagClick = (itinerary) => {
    setCurItinerary(itinerary);
    setShowFlagDialog(true);
  };

  // Toggle flag status
  const toggleAppropriateness = async (itinerary) => {
    if (itinerary) {
      // Toggle the 'isAppropriate' field
      const link = `${window.location.origin}/itineraryDetail/${itinerary._id}`; 
      const updatedItinerary = { ...itinerary, isAppropriate: !itinerary.isAppropriate };
      const { success, message } = await flagItinerary(updatedItinerary._id, updatedItinerary.isAppropriate,updatedItinerary.creator,link);
      if (success) {
        toast.success(
          updatedItinerary.isAppropriate ? "Itinerary marked as appropriate." : "Itinerary flagged as inappropriate.", 
          { className: "text-white bg-gray-800" }
        );
        getItineraries(); // Refresh itineraries to reflect changes
      } else {
        toast.error("Failed to update itinerary status.", { className: "text-white bg-gray-800" });
      }
    }
  };

  return (
    <div>
      <h1>Admin - Itineraries</h1>
      <div className='grid w-fit mx-auto'>
        {itineraries.map((itinerary, index) => (
          <div key={index}>
            <ItineraryContainer itinerary={itinerary} />
            {/* Show status text based on the appropriateness */}
            <span className={itinerary.isAppropriate ? 'text-green-600' : 'text-red-600'}>
              {itinerary.isAppropriate ? 'Appropriate' : 'Flagged as inappropriate'}
            </span>
            {/* Toggle button */}
            <button 
              onClick={() => toggleAppropriateness(itinerary)} 
              className={`px-2 py-1 ${itinerary.isAppropriate ? 'bg-green-700' : 'bg-red-700'} text-white cursor-pointer border-none rounded transform transition-transform duration-300 hover:scale-105`}
            >
              {itinerary.isAppropriate ? 'Mark as Inappropriate' : 'Mark as Appropriate'}
            </button>
          </div>
        ))}
      </div>
      
      {/* Flag confirmation dialog */}
      {showFlagDialog && (
        <Dialog 
          msg="Are you sure you want to flag this itinerary as inappropriate?" 
          accept={() => toggleAppropriateness(curItinerary)} 
          reject={() => setShowFlagDialog(false)} 
          acceptButtonText="Flag"
          rejectButtonText="Cancel" 
        />
      )}
    </div>
  );
}

export default AdminItineraryPage;
