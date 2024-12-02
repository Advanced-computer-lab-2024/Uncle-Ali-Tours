  import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { FiLoader } from 'react-icons/fi';
import { MdDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { dialog } from '../components/Dialog.jsx';
import { useItineraryStore } from '../store/itinerary.js';
import { useGuideStore } from '../store/tourGuide.js';
import { useTouristStore } from '../store/tourist.js';
import { useUserStore } from '../store/user.js';
import { adjustableDialog } from './AdjustableDialog.jsx';
import { formdialog } from './FormDialog.jsx';
import Rating from './Rating';


function ItineraryContainer({itinerary, itineraryChanger , accept , reject}) {
  const {currentItinerary, setCurrentItinerary , updateItinerary} = useItineraryStore();
  const [email,setEmail]=useState("");  
  const { createItineraryReview } = useItineraryStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { createTourGuideReview } = useGuideStore();
  const [tourGuideRating, setTourGuideRating] = useState(0);
  const [tourGuideComment, setTourGuideComment] = useState('');


  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const [isActivated, setIsActivated] = useState(itinerary.isActivated);
  const status = (itinerary.isActivated)? "Activated" : "Deactivated";
  const buttonStatus = (itinerary.isActivated)? "deactivate" : "activate";
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {tourist, updateItineraryBookings,unItiniraryBook,updateMyPoints} = useTouristStore();


  const { bookItinerary } = useItineraryStore();

  const handleRedirectToReviews = () => {
    navigate('/tourguidereviews');
  };


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


  const handleSubmitItineraryReview = async (e) => {
    e.preventDefault(); 
    const itineraryID = itinerary._id;
    console.log('Itinerary ID:', itineraryID);
    console.log('Rating:', rating);
    console.log('Comment:', comment);
    if (!itineraryID) {
      console.error('Error: itineraryId is missing');
      return;
    }

    if( !tourist?.itineraryBookings?.includes(itinerary._id))
    {
      return toast.error('Failed to add review: ');
    }
    console.log('User retrieved from states:', user);
    const { success, message } = await createItineraryReview(itineraryID, rating, comment,user);
    if (success) {
      alert('Review added successfully!');
      setRating(0);
      setComment('');
    } else {
      alert('Failed to add review: ' + message);
    }
};

const handleSubmitTourGuideReview = async (e) => {
  e.preventDefault();
  const tourGuideName = itinerary.creator;

if (!tourGuideName) {
    console.error('Error: tour guide name is missing');
    return;
}


if( !tourist?.itineraryBookings?.includes(itinerary._id))
  {
    return toast.error('Failed to add review: ');
  }
  const { success, message } = await createTourGuideReview(tourGuideName, tourGuideRating, tourGuideComment,user);
  if (success) {
    alert('Review added successfully!');
    setTourGuideRating(0);
    setTourGuideComment('');

  } else {
    alert('Failed to add review: ' + message);
  }
};

const handleBook = async (id) =>{
  if(user.type !== "tourist"){
        return toast.error("you are not alloewd to book an itinerary" , { className: 'text-white bg-gray-800' });
      }
      const { success, message } = await updateItineraryBookings(user.userName,id);
      if(success) {await updateMyPoints(user.userName,itinerary.price)}
      success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
}

const handleUnBook = async (id) =>{
  if(user.type !== "tourist"){
        return toast.error("you are not alloewd to book an activity" , { className: 'text-white bg-gray-800' });
      }
      const { success, message } = await unItiniraryBook(user.userName,id);
      success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
}


const handleBookClick = async () => {
  const { success, message } = await bookItinerary(itinerary._id);
  if (success) {
    toast.success(message, { className: "text-white bg-gray-800" });
    alert("Booked Sucess");
    console.log("Booked Successfully");
  } else {
    toast.error(message, { className: "text-white bg-gray-800" });
  }
};

const handleBookingOpen = async (id,newItinerary)=>{
    const {success,message} = await updateItinerary(id,newItinerary);
    if (success) {
      toast.success(message, { className: "text-white bg-gray-800" });
    } else{
      toast.error(message, { className: "text-white bg-gray-800" });  
    }   
}



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
      <Toaster/>
        <div className='grid p-2'>
       
      <p>Name: {itinerary.name}</p>
      <p>Tags: {itinerary.tags?.join(', ') || "No tags"}</p>
      <p>Language: {itinerary.language}</p>
      <p>Price: {displayPrice} {user.chosenCurrency}</p>&nbsp; 
      <p>Activities: </p>

      <ul>
        {itinerary.activities.map((activity, index) => (
          <li key={index+1}>
            <p>{index+1}: {activity.name} </p>   
             <p> Duration: {activity.duration} hours</p> 
            
          </li>
        ))}
      </ul>&nbsp; 
      <p>Pickup location: {itinerary.pickupLocation}</p>
      <p>Dropoff location: {itinerary.dropoffLocation}</p>
      <h3>Locations:</h3>
  <p>{itinerary.tourLocations.join(", ")}</p>

      <h3>Available Dates:</h3>
      <p>{itinerary.availableDates.map((date) => new Date(date).toLocaleDateString()).join(", ")}</p>

      <h3>Available Times:</h3>
      <p>{itinerary.availableTimes.join(", ")}</p>

      <p>Accessibility: {itinerary.accessibility}</p>
      <p>Number Of Bookings: {itinerary.numberOfBookings}</p>
      <p>Status: {status}</p>
      <p>creator: {itinerary.creator}</p>
      <div>
      {itinerary ? (
        <p>Booked: {itinerary.isBooked ? 'Yes' : 'No'}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
</div>

<button 
  onClick={handleRedirectToReviews} 
  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
>
  View Tour Guide Reviews
</button>


<div>
        <h3>Rate and Review the Creator</h3>
        <input type="number" value={tourGuideRating} onChange={(e) => setTourGuideRating(Number(e.target.value))} placeholder="Rating" min="1" max="5" />
        <input type="text" value={tourGuideComment} onChange={(e) => setTourGuideComment(e.target.value)} placeholder="Comment" />
        <button onClick={handleSubmitTourGuideReview}>Submit</button>
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
      <button onClick={handleSubmitItineraryReview}>Submit</button>

      
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
        
        <button className="p-2 bg-blue-500 text-white" onClick={() => handleShare(itinerary._id)}>copy link</button>
        <button className="p-2 bg-blue-500 text-white" onClick={() => setIsModalOpen(true)}>
        Share via Mail
        </button>
        {   !tourist?.itineraryBookings?.includes(itinerary._id) ?
         <button onClick={() => (handleBook(itinerary._id))} className="p-2 bg-blue-500 text-white">book</button>  :   
         <button onClick={() => (handleUnBook(itinerary._id))} className="p-2 bg-blue-500 text-white">unbook</button>     
         }
         <button onClick={()=>handleBookingOpen(itinerary._id,{bookingOpen:!itinerary.bookingOpen})}>{itinerary.bookingOpen?"close":"open"}</button>
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