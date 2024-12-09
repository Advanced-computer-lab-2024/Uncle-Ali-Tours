import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { FiLoader } from 'react-icons/fi';
import { GoBell, GoBellFill } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { useItineraryStore } from '../store/itinerary.js';
import { useGuideStore } from '../store/tourGuide.js';
import { useTouristStore } from '../store/tourist.js';
import { useUserStore } from '../store/user.js';
import QuantitySelector from './QuantitySelector.jsx';
import Rating from './Rating';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';


function TouristItineraryContainer({itinerary, itineraryChanger , accept , reject,onBookmarkToggle = () => {},isBookmarked}) {
  const {currentItinerary, setCurrentItinerary,interestedIn,removeInterestedIn,bookmarkItinerary,getBookmarkeditineraries, removeBookmarks} = useItineraryStore();
  const [email,setEmail]=useState("");  
  const { createItineraryReview } = useItineraryStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { createTourGuideReview } = useGuideStore();
  const [tourGuideRating, setTourGuideRating] = useState(0);
  const [tourGuideComment, setTourGuideComment] = useState('');
const { tourist , isPast , isUpcoming} = useTouristStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [ setIsBookmarked] = useState(false);
  const [localIsBookmarked, setLocalIsBookmarked] = useState(isBookmarked);

  const { bookItinerary } = useItineraryStore();

  const [quantity, setQuantity] = useState(1);

  const handleRedirectToReviews = () => {
    navigate('/tourguidereviews');
  };
  const handleViewReviewsClick = () => {
    setCurrentItinerary(itinerary);
    navigate('/viewReviews');       
  };
  const keys = Object.keys(itinerary)
  keys.map((key)=> (
    `${key}: ${itinerary[key]}`
  ))
  const displayPrice = (itinerary.price * user.currencyRate).toFixed(2);
  const handleShare = (id) => {
    const link = `${window.location.origin}/itineraryDetail/${id}`;
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
    }).catch(() => {
      alert("Failed to copy link.");
    });
  };

  const handleShareViaMail = async(id) => {
    setIsLoading(true)
    const link = `${window.location.origin}/itineraryDetail/${id}`;
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

    if (!itinerary.isBooked) {
      alert('You can only review this itinerary once it is booked.');
      return;
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

const handleIntersted = async (id) =>{
      const { success, message } = await interestedIn(tourist._id,id);
      if(success) 
        toast.success(message, {className: "text-white bg-gray-800"}) 
      else 
        toast.error(message, {className: "text-white bg-gray-800"})
}

const handleNotIntersted = async (id) =>{
      const { success, message } = await removeInterestedIn(tourist._id,id);
      if(success) 
        toast.success(message, {className: "text-white bg-gray-800"}) 
      else 
        toast.error(message, {className: "text-white bg-gray-800"})
}

const handleSubmitTourGuideReview = async (e) => {
  e.preventDefault();
  const tourGuideName = itinerary.creator;  

if (!tourGuideName) {
    console.error('Error: tour guide name is missing');
    return;
}
if (!itinerary.isBooked) {
  alert('You can only review this tour guide once the itinerary is booked.');
  return;
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
const handleBookClick = async (itineraryID , quantity) => {
  try{
    navigate(`/payment/itinerary/${itineraryID}` , {state : {quantity:quantity} });
  }
  catch(error){
    console.error('Error:', error);
  }
};

const handleQuantityChange = (newQuantity) => {
  setQuantity(newQuantity);
};

useEffect(() => {
  // Check if the activity is already bookmarked
  if (user?.bookmarkerItineraries?.includes(itinerary._id)) {
      setIsBookmarked(true);
  }
}, [user, itinerary]);

const handleToggleBookmark = async () => {
  try {
      const response = await fetch('/api/itinerary/toggleBookmark', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itineraryId: itinerary._id }),
      });

      const data = await response.json();
      if (data.success) {
          toast.success(data.message);
          onBookmarkToggle(itinerary._id, data.itinerary.isBookmarked); // Update parent state
          const newIsBookmarked = data.itinerary.isBookmarked;

          // Update both local and parent states
          setLocalIsBookmarked(newIsBookmarked);
          onBookmarkToggle(itinerary._id, newIsBookmarked);
      } else {
          toast.error(data.message);
      }
  } catch (error) {
      toast.error('Failed to update bookmark');
      console.error('Error toggling bookmark:', error);
  }
};

  return (
    <div className='mb-6 text-black text-left w-fit min-w-[45ch] bg-white mx-auto rou h-fit rounded'>
        <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold"></h3>
                <button
                    onClick={handleToggleBookmark}
                    className="ml-2"
                    aria-label="Bookmark Itinerary"
                >
                    {localIsBookmarked ? (
                        <AiFillStar className="text-yellow-500" size={28} />
                    ) : (
                        <AiOutlineStar className="text-gray-500" size={28} />
                    )}
                </button>
            </div>
        <div className='grid p-2'>
        {!itinerary.bookingOpen && (itinerary.interstedIn.includes(tourist._id)?
         <GoBellFill size={20} onClick={() => (handleNotIntersted(itinerary._id))}/>:     
         <GoBell size={20} onClick={() => (handleIntersted(itinerary._id))}/>     
         )} 
       
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
      <div>
      {itinerary ? (
        <p>Booked: {itinerary.isBooked ? 'Yes' : 'No'}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
</div>
{!isPast && !isUpcoming && (
  <QuantitySelector onChange={handleQuantityChange} maxValue={100} />
)}
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
      {/* {   !tourist?.itineraryBookings?.some(booking => booking._id === itinerary._id) ? */}
      {!isPast && (
  !isUpcoming ? (
    <button onClick={() => handleBookClick(itinerary._id, quantity)} className="p-2 bg-blue-500 text-white">
      Book
    </button>
  ) : (
    <button onClick={() => handleUnBook(itinerary._id)} className="p-2 bg-blue-500 text-white">
      Unbook
    </button>
  )
)}
         </div>
        <div className='flex justify-between'>
        <div className='flex'>
        </div>
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
export default TouristItineraryContainer