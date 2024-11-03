import React, { useState } from 'react';
import { MdDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { Link } from 'react-router-dom';
import { dialog } from '../components/Dialog.jsx';
import { useItineraryStore } from '../store/itinerary.js';
import {useUserStore} from '../store/user.js';
import { formdialog } from './FormDialog.jsx';
import { Card } from 'react-bootstrap';
import Rating from './Rating';


function ItineraryContainer({itinerary, itineraryChanger , accept , reject}) {
  //const {user} = useUserStore();
  const {currentItinerary, setCurrentItinerary} = useItineraryStore();  
  const { createProductReview } = useItineraryStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const user = useUserStore((state) => state.user);
  //const itineraryID = itinerary._id;

  const keys = Object.keys(itinerary)
  keys.map((key)=> (
    `${key}: ${itinerary[key]}`
  ))
  const { showDialog } = dialog()
  const { showFormDialog } = formdialog()

  

  const handleClick = () => {
    showDialog()
    itineraryChanger(itinerary)
  }
  const handleUpdateClick = () => {
    showFormDialog()
    itineraryChanger(itinerary)
  }

  console.log("User data:", user);
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
    const { userId, name } = user;
    if (!userId || !name) {
    return { success: false, message: 'User ID and name are required.' };
    }
    
    const { success, message } = await createProductReview(itineraryID, rating, comment,user);
    
    if (success) {
      alert('Review added successfully!');
      setRating(0);
      setComment('');
    } else {
      alert('Failed to add review: ' + message);
    }
};


 

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
      <p>pickup location: {itinerary.pickupLocation}</p>
      <p>dropoff location: {itinerary.dropoffLocation}</p>
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


        <div className='flex'>
        <Link 
          to='/updateItinerary'
          onClick={()=>(setCurrentItinerary(itinerary))}
          className='mr-4 transform transition-transform duration-300 hover:scale-125'
        >
          <MdOutlineDriveFileRenameOutline size='18' color='black' />
        </Link>
        <button onClick={() => (handleClick())} className='mr-2 transform transition-transform duration-300 hover:scale-125 '><MdDelete size='18' color='black' /></button>
        
        </div>
        </div>
  )
}

export default ItineraryContainer