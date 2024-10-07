import React from 'react'
import { useState } from 'react';
import { MdDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import {dialog} from '../components/Dialog.jsx'
import { formdialog } from './FormDialog.jsx';  
import { Link } from 'react-router-dom';
function ItineraryContainer({itinerary, itineraryChanger}) {
  const keys = Object.keys(itinerary)
  keys.map((key)=> (
    `${key}: ${itinerary[key]}`
  ))
  const { showDialog } = dialog()
  const { showFormDialog } = formdialog()

  const handleClick = () => {
    showDialog()
    tagChanger(tagName)
  }
  

 
  return (
    <div className='mb-6 text-black text-left w-fit min-w-[45ch] bg-white mx-auto rou h-fit rounded'>
        <div className='grid p-2'>
       
      <h2>{itinerary.name}</h2>
      <p>Language: {itinerary.language}</p>
      <p>Price: ${itinerary.price}</p>
      <h3>Activities:</h3>
      <ul>
        {itinerary.activities.map((activity, index) => (
          <li key={index}>
            <p>Name: {activity.name}</p>
            <p>Duration: {activity.duration} hours</p>
          </li>
        ))}
      </ul>
      <p>pickup location: {itinerary.pickupLocation.coordinates[0]+" , "+itinerary.pickupLocation.coordinates[1]}</p>
      <p>dropoff location: {itinerary.dropoffLocation.coordinates[0]+" , "+itinerary.dropoffLocation.coordinates[1]}</p>
      <h3>Locations:</h3>
      <ul>
        {itinerary.tourLocations.map((loc, index) => (
          <li key={index}>
            <p>{itinerary.tourLocations[index]}</p>
          </li>
        ))}
      </ul>
      <h3>Available Dates:</h3>
      <ul>
        {itinerary.availableDates.map((date, index) => (
          <li key={index}>
            <p>{itinerary.availableDates[index]}</p>
          </li>
        ))}
      </ul>
      <h3>Available Times:</h3>
      <ul>
        {itinerary.availableTimes.map((time, index) => (
          <li key={index}>
            <p>{itinerary.availableTimes[index]}</p>
          </li>
        ))}
      </ul>
      <p>Accessibility: {itinerary.accessibility}</p>
       </div>
        <div className='flex'>
        <Link to='/updateItinerary' className='mr-4 transform transition-transform duration-300 hover:scale-125' ><MdOutlineDriveFileRenameOutline size='18' color='black' /></Link>
        <button onClick={() => (handleClick())} className='mr-2 transform transition-transform duration-300 hover:scale-125 '><MdDelete size='18' color='black' /></button>
        
        </div>
        </div>
  )
}

export default ItineraryContainer