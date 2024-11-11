import React, { useState } from 'react';
import { MdDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import Dialog, { dialog } from '../components/Dialog.jsx';
import { useItineraryStore } from '../store/itinerary.js';
import {useUserStore} from '../store/user.js';
import { formdialog } from './FormDialog.jsx';
import Rating from './Rating';
import { adjustableDialog } from './AdjustableDialog.jsx';
import { Card } from 'react-bootstrap';


function ItineraryContainer({itinerary, itineraryChanger , accept , reject}) {
  const {currentItinerary, setCurrentItinerary} = useItineraryStore();  
  const { createProductReview } = useItineraryStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const user = useUserStore((state) => state.user);
  const [isActivated, setIsActivated] = useState(itinerary.isActivated);
  const status = (itinerary.isActivated)? "Activated" : "Deactivated";
  const buttonStatus = (itinerary.isActivated)? "deactivate" : "activate";
  const navigate = useNavigate();

  const handleViewReviewsClick = () => {
    setCurrentItinerary(itinerary); // Set the itinerary in the store
    navigate('/viewReviews');       // Navigate to the view reviews page
  };


  const keys = Object.keys(itinerary)
  keys.map((key)=> (
    `${key}: ${itinerary[key]}`
  ))
  const { showDialog } = dialog()
  const { showFormDialog } = formdialog()
  const { showAdjustableDialog } = adjustableDialog()

  

  const handleClick = () => {
    showDialog()
    itineraryChanger(itinerary)
  }
  const handleUpdateClick = () => {
    showFormDialog()
    itineraryChanger(itinerary)
  }
  // Modify the `handleActivateClick` function in `ItineraryContainer.jsx`:
const handleActivateClick = () => {
  showAdjustableDialog();      // Open the dialog
  itineraryChanger(itinerary); // Set the current itinerary in the parent state
  
};



  
  const displayPrice = (itinerary.price * user.currencyRate).toFixed(2); // Convert price based on currencyRate


  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const itineraryID = itinerary._id;
    console.log('Itinerary ID:', itineraryID);
    console.log('Rating:', rating);
    console.log('Comment:', comment);
    if (!itineraryID) {
      console.error('Error: itineraryId is missing');
      return;
    }
    console.log('User retrieved from states:', user);
    const { success, message } = await createProductReview(itineraryID, rating, comment,user);
    if (success) {
      alert('Review added successfully!');
      setRating(0);
      setComment('');
    } else {
      alert('Failed to add review: ' + message);
    }
};



const activate = async () => {
  const {success, message} = await activateItinerary(curItinerary._id)
  success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
}
const deactivate = async () => {
  const {success, message} = await deactivateItinerary(curItinerary._id)
  success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
}



  return (
    <div className='mb-6 text-black text-left w-fit min-w-[45ch] bg-white mx-auto rou h-fit rounded'>
        <div className='grid p-2'>
       
      <h2>{itinerary.name}</h2>
      <p>Preference Tag: {itinerary.preferenceTag}</p>
      <p>Language: {itinerary.language}</p>
      <p>Price: {displayPrice} {user.chosenCurrency}</p>
      <h3>Activities:</h3>
      <ul>
        {itinerary.activities.map((activity, index) => (
          <li key={index+1}>
            <p>Activity{index+1}: {activity.name}  &nbsp;  Duration: {activity.duration} hours</p> 
            
          </li>
        ))}
      </ul>
      <p>
            Pickup Location: 
            {itinerary.pickupLocation ? 
                `${itinerary.pickupLocation.type} - Coordinates: ${itinerary.pickupLocation.coordinates?.join(', ') || 'No coordinates available'}` 
                : 'N/A'}
        </p>
        <p>
            Dropoff Location: 
            {itinerary.dropoffLocation ? 
                `${itinerary.dropoffLocation.type} - Coordinates: ${itinerary.dropoffLocation.coordinates?.join(', ') || 'No coordinates available'}` 
                : 'N/A'}
        </p>
      <h3>Locations:</h3>
      <ul>
        {itinerary.tourLocations.map((loc, index) => (
          <li key={index}>
            <p>{loc}</p>
          </li>
        ))}
      </ul>
      <h3>Available Dates:</h3>
      <ul>
        {itinerary.availableDates.map((date, index) => (
          <li key={index}>
            <p>{date}</p>
          </li>
        ))}
      </ul>
      <h3>Available Times:</h3>
      <ul>
        {itinerary.availableTimes.map((time, index) => (
          <li key={index}>
            <p>{time}</p>
          </li>
        ))}
      </ul>
      <p>Accessibility: {itinerary.accessibility}</p>
      <p>Number Of Bookings: {itinerary.numberOfBookings}</p>
      <p>Status: {status}</p>
      <p>creator: {itinerary.creator}</p>
</div>

<Card.Text as='div'>
          <Rating
            value={itinerary.rating}
            text={`${itinerary.numReviews} reviews`}
          />
        </Card.Text>

<div>
<h3>Add a Review</h3>
      <input type="number" value={rating} onChange={(e) => setRating(Number(e.target.value))}  placeholder="Rating" />
      <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comment" />
      <button onClick={handleSubmit}>Submit</button>

      
    </div> 


    <div>
        <button 
          onClick={handleViewReviewsClick}
          className='px-1 py-0.5 bg-blue-700 text-white cursor-pointer border-none m-1 p-0.5 rounded transform transition-transform duration-300 hover:scale-105'>
          View Reviews
        </button>
      </div>

        <div className='flex justify-between'>
        <div className='flex'>
        <Link 
          to='/updateItinerary'
          onClick={()=>(handleUpdateClick())}
          className='mr-4 transform transition-transform duration-300 hover:scale-125'
        >
          <MdOutlineDriveFileRenameOutline size='18' color='black' />
        </Link>
        <button onClick={() => (handleClick())} className='mr-2 transform transition-transform duration-300 hover:scale-125 '><MdDelete size='18' color='black' /></button>
        </div>
        <button onClick={() => (handleActivateClick())} className='px-1 py-0.5 bg-green-700 text-white cursor-pointer border-none m-1 p-0.5 rounded transform transition-transform duration-300 hover:scale-105'  > 
          {buttonStatus} 
        </button>
        
        </div>
        </div>
  )
}

export default ItineraryContainer