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
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FiLoader } from 'react-icons/fi';
import { set } from 'mongoose';


function ItineraryContainer({itinerary, itineraryChanger , accept , reject}) {
  const {currentItinerary, setCurrentItinerary} = useItineraryStore();  
  const [email,setEmail]=useState("");
  const { createProductReview } = useItineraryStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const [isActivated, setIsActivated] = useState(itinerary.isActivated);
  const status = (itinerary.isActivated)? "Activated" : "Deactivated";
  const buttonStatus = (itinerary.isActivated)? "deactivate" : "activate";
  const navigate = useNavigate();

  const handleViewReviewsClick = () => {
    setCurrentItinerary(itinerary); // Set the itinerary in the store
    navigate('/viewReviews');       // Navigate to the view reviews page
  };
  

// components/containers/ItineraryContainer.js


const ItineraryContainer = ({ itinerary }) => {
  const handleBooking = async (itineraryId) => {
    try {
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
      await axios.post('/api/bookings', 
        { itineraryId }, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('Itinerary booked successfully!');
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to book itinerary');
    }
  };

  return (
    <div>
      <h3>{itinerary.name}</h3>
      {/* Other itinerary details */}
      <button onClick={() => handleBooking(itinerary.id)}>Book</button>
    </div>
  );
};





  const [isLoading, setIsLoading] = useState(false);
  //const itineraryID = itinerary._id;

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
  itineraryChanger(itinerary); // Set the current itinerary in the parent state
  showAdjustableDialog();      // Open the dialog
};



  
  // console.log("User data:", user);
  const displayPrice = (itinerary.price * user.currencyRate).toFixed(2); // Convert price based on currencyRate

  const handleShare = (id) => {
    const link = `${window.location.origin}/itineraryDetail/${id}`;
    
    // Copy the link to clipboard
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
    }).catch(() => {
      alert("Failed to copy link.");
    });
  };

  const handleShareViaMail = async(id) => {
    setIsLoading(true)
    // const userName = user.userName;
    const link = `${window.location.origin}/itineraryDetail/${id}`;
    // console.log(id);
    // console.log(user.userName);
    // console.log(link);
    // console.log(email); 
    const res = await fetch('/api/share/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName: user.userName, link : link, email:email})
  });
  const {success, message} = await res.json()
  if(success){
    toast.success(message, {className: "text-white bg-gray-800"}) 
    setIsModalOpen(false);
  }
  else{
    toast.error(message, {className: "text-white bg-gray-800"})
  }
  setIsLoading(false)
}

    
    // // Copy the link to clipboard
    // navigator.clipboard.writeText(link).then(() => {
    //   alert("Link copied to clipboard!");
    // }).catch(() => {
    //   alert("Failed to copy link.");
    // });

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
       <Toaster />
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
          onClick={()=>(setCurrentItinerary())}
          className='mr-4 transform transition-transform duration-300 hover:scale-125'
        >
          <MdOutlineDriveFileRenameOutline size='18' color='black' />
        </Link>
        <button onClick={() => (handleClick())} className='mr-2 transform transition-transform duration-300 hover:scale-125 '><MdDelete size='18' color='black' /></button>
        </div>
        <button onClick={() => (handleActivateClick())} className='px-1 py-0.5 bg-green-700 text-white cursor-pointer border-none m-1 p-0.5 rounded transform transition-transform duration-300 hover:scale-105'  > 
          {buttonStatus} 
        </button>
        
        <button className="p-2 bg-blue-500 text-white" onClick={() => handleShare(itinerary._id)}>copy link</button>
        <button className="p-2 bg-blue-500 text-white" onClick={() => setIsModalOpen(true)}>
        Share via Mail
        </button>
        {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 mt-[30vh] w-fit mx-auto flex h-fit justify-center">
          <div className="bg-white p-4 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-xl mb-4">Share Itinerary via Email</h3>
            
            <label className="block mb-2">
              To:
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full p-2 border rounded mt-1"
                placeholder="Recipient's email"
              />
            </label>

            <div className="flex justify-end mt-4">
              <button className="p-2 bg-red-500 text-white rounded mr-2" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="p-2 bg-green-500 text-white rounded w-[8ch]" onClick={() => handleShareViaMail(itinerary._id)}>
                {isLoading ? <FiLoader className='mx-auto animate-spin'/> : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
        </div>
  )
  
}


export default ItineraryContainer