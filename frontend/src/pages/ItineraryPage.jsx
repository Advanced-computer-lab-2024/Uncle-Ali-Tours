import React from 'react'
import { useState } from 'react';
import ItineraryContainer from '../components/ItineraryContainer.jsx'
import Dialog from '../components/Dialog.jsx'
import FormDialog from '../components/FormDialog.jsx'
function ItineraryPage() {
  const its = [
  { id:1,
    activities:["Tennis","Football","Basketball","Volleyball"],
    durations:["1 week","1 month","3 days","2 weeks"],
    locations:["GUC","BUE","FUE","AUC"],
    timeline:"AAAAAAAAAAA",
    language:"English",
    accessibility:"1",
    pickup:"GUC Gate 1",
    dropoff:"GUC Gate 3",

  }, 
  {
    id:2,
    activities:["Football","Basketball","Volleyball"],
    durations:["2 week","3 days","2 weeks"],
    locations:["BUE","FUE","AUC"],
    timeline:"AAAAAAAAAAA",
    language:"Arabic",
    accessibility:"1",
    pickup:"GUC Gate 1",
    dropoff:"GUC Gate 3",
  }]
  const [curItinerary, setCurItinerary] = useState(-1);
  const changeItinerary = (id) => (
    setCurItinerary(id)
  )

  return (
    <div>
      <div className='mb-4 text-xl'>
            Available Itineraries   
        </div>
        {
            its.map((it, index)=> (
                <ItineraryContainer key={index} itineraryChanger={changeItinerary} itinerary={it}/>   
            ))
        }
        <Dialog msg={"Are you sure you want to delete this itinerary?"} accept={() => del()} reject={() => (console.log("rejected"))} acceptButtonText='Delete' rejectButtonText='Cancel'/>
        <FormDialog msg={"Update values"} accept={() => del()} reject={() => (console.log("rejected"))} acceptButtonText='Update' rejectButtonText='Cancel' inputs={["name","value"]}/>
   
    
    </div>
  )
}

export default ItineraryPage