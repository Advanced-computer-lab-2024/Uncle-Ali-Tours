import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import ItineraryContainer from '../components/ItineraryContainer';
import { useItineraryStore } from '../store/itinerary';
import { FiLoader } from "react-icons/fi";



function ItineraryDetail() {
    const { id } = useParams(); // Extract itinerary ID from URL  
    const {itineraries, getItineraries} = useItineraryStore();
    const navigate = useNavigate()

      
      if(!id){
        navigate("/")
      }

        // Fetch all itineraries if no ID is specified
        getItineraries({_id:id});

        if(!itineraries[0]) return <FiLoader size={50} className='animate-spin mx-auto mt-[49vh]'/>;

  return (
    <div>ItineraryDetail  
            <ItineraryContainer  itinerary={itineraries[0]}/>   
    </div>
  )
}

export default ItineraryDetail