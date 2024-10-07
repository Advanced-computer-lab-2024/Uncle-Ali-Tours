import React from 'react'
import { useState } from 'react';
import ItineraryContainer from '../components/ItineraryContainer.jsx'
import Dialog from '../components/Dialog.jsx'
import FormDialog from '../components/FormDialog.jsx'
import { useEffect } from 'react';
import { useUserStore } from '../store/user.js';
import { useItineraryStore } from '../store/itinerary.js';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
function ItineraryPage() {
  const {user} = useUserStore();
  const {itineraries, addItineraries, getItineraries,deleteItinerary} = useItineraryStore();  
  useEffect(() => {
    console.log(user.userName)
    getItineraries({creator:user.userName}); 
  }, [])
  const [curItinerary, setCurItinerary] = useState(-1);
  const changeItinerary = (id) => (
    setCurItinerary(id)
  )
  const itineraryChanger = (itinerary) => {
    setCurItinerary(itinerary);
  }
  const del = async () => {
    const {success, message} = await deleteItinerary(curItinerary._id)
    success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
  }
  

  return (
    <div>
      <Link to='/createItinerary'>
      <button className='px-5 py-2 bg-green-700 text-white cursor-pointer border-none m-6 p-2 rounded transform transition-transform duration-300 hover:scale-105' >Create New Itinerary</button>
      </Link>
      <div className='mb-4 text-xl'>
            Available Itineraries   
        </div>
        {
            itineraries.map((it, index)=> (
                <ItineraryContainer key={index} itineraryChanger={changeItinerary} itinerary={it}/>   
            ))
        }
        <Dialog msg={"Are you sure you want to delete this itinerary?"} accept={() => del()} reject={() => (console.log("rejected"))} acceptButtonText='Delete' rejectButtonText='Cancel'/>
        <FormDialog msg={"Update values"} accept={() => del()} reject={() => (console.log("rejected"))} acceptButtonText='Update' rejectButtonText='Cancel' inputs={["name","value"]}/>
   
        <Toaster/>
    </div>
  )
}

export default ItineraryPage