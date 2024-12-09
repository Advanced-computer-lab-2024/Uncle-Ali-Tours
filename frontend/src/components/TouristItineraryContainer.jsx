import React, { useState, useEffect } from 'react';
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
import Button from './Button';
import  { dialog } from './Dialog';
import { IoClose } from "react-icons/io5";
import {Card, CardContent, CardFooter } from './Card';
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar } from 'react-icons/fa';
import Textarea from './Textarea';
import { Dialog,DialogContent, DialogHeader, DialogTitle } from '../components/DialogAI';
import { Reviews } from '@mui/icons-material';

import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import TourGuide from '../../../backend/models/tourGuide.model.js';


function TouristItineraryContainer({itinerary, itineraryChanger , accept , reject,onBookmarkToggle = () => {},isBookmarked}) {
  const {currentItinerary, setCurrentItinerary,interestedIn,removeInterestedIn,bookmarkItinerary,getBookmarkeditineraries, removeBookmarks} = useItineraryStore();
  const [email,setEmail]=useState("");  
  const { createItineraryReview } = useItineraryStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [dialogType, setDialogType] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { createTourGuideReview } = useGuideStore();
  const [tourGuideRating, setTourGuideRating] = useState(0);
  const [tourGuideComment, setTourGuideComment] = useState('');
// const { tourist , isPast , isUpcoming} = useTouristStore();
const { tourist , fetchPastItineraries,isPast , isUpcoming} = useTouristStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [showReviews, setShowReviews] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { showDialog, hideDialog } = dialog();
  const [review, setReview] = useState('');
  const [reviews,setReviews] = useState(false);

  const [ setIsBookmarked] = useState(false);
  const [localIsBookmarked, setLocalIsBookmarked] = useState(isBookmarked);

  const { bookItinerary } = useItineraryStore();

  const [quantity, setQuantity] = useState(1);

  


  // const handleReviewClick = (type) => {
  //   showDialog();
  //   setReview('');
  //   setRating(0);
  // };

  // const handleSubmit = async () => {
  //   if (dialogType === 'rate' && rating > 5) {
  //     toast.error("Rating cannot exceed 5", { className: "text-white bg-gray-800" });
  //     return;
  //   }
  //   if (dialogType === 'review' && review === "") {
  //     toast.error("Please put a review before submitting", { className: "text-white bg-gray-800" });
  //     return;
  //   }
    
  //   const requestData = {
  //     user: { userName: tourist.userName },
  //     [dialogType === 'rate' ? 'rating' : 'reviewText']: dialogType === 'rate' ? rating : review
  //   };

  //   try {
  //     const response = await fetch(/api/product/${product._id}/rate-review, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(requestData),
  //     });

  //     const data = await response.json();
  //     if (data.success) {
  //       toast.success(dialogType === 'rate' ? Rating submitted: ${rating}/5 : Review submitted: "${review}", { className: "text-white bg-gray-800" });
  //     } else {
  //       toast.error(data.message || 'Failed to submit');
  //     }
  //   } catch (error) {
  //     console.error('Error submitting rating/review:', error);
  //     toast.error('An error occurred. Please try again.', { className: "text-white bg-gray-800" });
  //   }
    
  //   setIsDialogOpen(false);
  // };

const openDialog = (type) => {
    setDialogType(type);
    setIsDialogOpen(true);
};

// Close dialog
const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogType(null);
    setRating(0);
    setReview('');
};
  const handleRedirectToReviews = () => {
    navigate('/tourguidereviews');
  };
  const handleViewReviewsClick = () => {
    setCurrentItinerary(itinerary);
    navigate('/viewReviews');       
  };
  const keys = Object.keys(itinerary);
keys.map((key) => (
  `${key}: ${itinerary[key]}`
));
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
const handleSubmit = async () => {
  if (dialogType === 'rate' && rating > 5) {
      toast.error("Rating cannot exceed 5", { className: "text-white bg-gray-800" });
      closeDialog();
      return; // Exit without submitting if rating is invalid
  }
  if (dialogType === 'review' && review === "") {
      toast.error("Please put a review before submitting", { className: "text-white bg-gray-800" });
      return; // Exit without submitting if rating is invalid
  }
  
  const requestData = { user: { userName: tourist.userName } };

  // Add rating or reviewText based on dialogType
  if (dialogType === 'rate') {
      requestData.rating = rating;
  } else if (dialogType === 'review') {
      requestData.reviewText = review;
  }

  try {
      const response = await fetch(`/api/itinerary/${itinerary._id}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
      });
      console.log(response);
      // const data = await response.json();
      // if (data.success) {
      //     toast.success(dialogType === 'rate' ? Rating submitted: ${rating}/5 : Review submitted: "${review}", { className: "text-white bg-gray-800" });
      // } else {
      //     toast.error(data.message || 'Failed to submit');
      // }
  } catch (error) {
      console.error('Error submitting rating/review:', error);
      toast.error('An error occurred. Please try again.', { className: "text-white bg-gray-800" });
  }
  
  closeDialog();
};

// Handle eligibility check for rate or review
const handleReviewClick = async (e) => {
  e.preventDefault();
  const itineraryId = itinerary._id;

  if (!itineraryId) {
    console.error('Error: Itinerary ID is missing');
    return;
  }
  const { success, message } = await createItineraryReview(itineraryId, rating, comment,user);
  if (success) {
    toast.success('Review added successfully!');
    setRating(0);
    setComment('');
  } else {
    toast.error('Failed to add review: ' + message);
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

const handleBookClick = async (itineraryID , quantity) => {
  try{
    navigate(`/payment/itinerary/${itineraryID}` , {state : {quantity:quantity} });
  }
  catch(error){
    console.error('Error:', error);
  }
};


  return (
    <Card className="w-full max-w-[700px] mx-auto">
        <p>Average Rating: {itinerary.rating} (from {itinerary.numReviews} reviews)</p>

        <div>
        <div>
        <h3>Add a Review</h3>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          placeholder="Rating"
          min="1"
          max="5"
        />
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comment"
        />
        <button onClick={handleReviewClick} disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
        <div>
        <h3>Reviews</h3>
        {itinerary.reviews?.map((review, index) => (
          <div key={index}>
            <Rating value={review.rating} text={review.comment} />
          </div>
        ))}
      </div>
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
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center w-auto max-w-[650px] mx-auto mb-4">
          
          <div className="w-full flex items-center justify-center">
            <div className="aspect-square overflow-hidden transform scale-110 ml-12 mt-12">
              <img
                src={itinerary.image || "/placeholder.svg"}
                alt="Itinerary"
                className="w-[75%] h-[75%] object-cover cursor-pointer"
                onClick={() => setShowPreview(true)}
              />
            </div>
          </div>

          <div className="w-full md:w-2/3 flex flex-col items-center justify-center text-center">
            <div>
              <h2 className="font-bold mb-2">{itinerary.name}</h2>
              <p className="mb-1">Preference Tag: {itinerary.preferenceTag}</p>
              <p className="mb-1">Language: {itinerary.language}</p>
              <p className="mb-1">Price: {displayPrice} {user.chosenCurrency}</p>
              <p className="mb-1">Creator: {itinerary.creator}</p>
            </div>

            <div className="flex justify-center mb-4">
              
              <div>
        <h3>Rate and Review the Creator</h3>
        <input type="number" value={tourGuideRating} onChange={(e) => setTourGuideRating(Number(e.target.value))} placeholder="Rating" min="1" max="5" />
        <input type="text" value={tourGuideComment} onChange={(e) => setTourGuideComment(e.target.value)} placeholder="Comment" />
        <button onClick={handleSubmitTourGuideReview}>Submit</button>
      </div>
      <button 
  onClick={handleRedirectToReviews} 
  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
>
  View Tour Guide Reviews
</button>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {/* <Button variant="outline" onClick={handleWishlist}>
                {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              </Button> */}
              <QuantitySelector onChange={setQuantity} maxValue={100} />
              <Button variant="outline" onClick={() => handleBookClick(itinerary._id, quantity)}>
                <FaShoppingCart className={itinerary.isBooked ? "text-green-500" : ""} />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
      <Button variant="link" onClick={() => setReviews(!reviews)}>
          {reviews ? "Hide Reviews" : "Show Reviews"}
          </Button>
          {reviews && (
        <div className="px-6 pb-6">
          {itinerary.review.length > 0 ? (
            itinerary.review.map((r, index) => (
              <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
                <p className="font-semibold">{r.user?.userName || "Anonymous"}</p> 
                <p>{r.reviewText}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}

        </div>
      )}
      </CardFooter>
      <CardFooter className="flex justify-between">
        <Button variant="secondary" onClick={() => setShowReviews(!showReviews)}>
          {showReviews ? "Hide Details" : "Show Details"}
        </Button>
        <div>
          <Button variant="outline" className="mr-2" onClick={() => handleShare(itinerary._id)}>
            Copy Link
          </Button>
          <Button variant="outline" onClick={() => setIsModalOpen(true)}>
            Share via Email
          </Button>
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
      </CardFooter>
      {showReviews && (
        <CardContent>
          <h3 className="font-semibold mb-2">Activities:</h3>
          <ul className="list-disc list-inside mb-4">
            {itinerary.activities.map((activity, index) => (
              <li key={index}>
                {activity.name} - Duration: {activity.duration} hours
              </li>
            ))}
          </ul>
          <p className="mb-2">Pickup location: {itinerary.pickupLocation}</p>
          <p className="mb-2">Dropoff location: {itinerary.dropoffLocation}</p>
          <h3 className="font-semibold mb-2">Locations:</h3>
          <ul className="list-disc list-inside mb-4">
            {itinerary.tourLocations.map((loc, index) => (
              <li key={index}>{loc}</li>
            ))}
          </ul>
          <h3 className="font-semibold mb-2">Available Dates:</h3>
          <ul className="list-disc list-inside mb-4">
            {itinerary.availableDates.map((date, index) => (
              <li key={index}>{date}</li>
            ))}
          </ul>
          <h3 className="font-semibold mb-2">Available Times:</h3>
          <ul className="list-disc list-inside mb-4">
            {itinerary.availableTimes.map((time, index) => (
              <li key={index}>{time}</li>
            ))}
          </ul>
          <p className="mb-2">Accessibility: {itinerary.accessibility}</p>
          <button onClick={() => handleReviewClick('review',itinerary._id)} className="bg-blue-500 text-white px-2 py-1 rounded">
                  Review
                </button>
                <button onClick={() => handleReviewClick('rate',itinerary._id)} className="bg-green-500 text-white px-2 py-1 rounded">
                  Rate
                </button>
        </CardContent>
      )}

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg">
            <Button
              variant="outline"
              className="absolute top-2 right-2"
              onClick={() => setShowPreview(false)}
            >
              <IoClose size={24} />
            </Button>
            <img
              src={itinerary.image || "/placeholder.svg"}
              alt="Itinerary Preview"
              className="max-h-[80vh] max-w-full object-contain"
            />
          </div>
        </div>
      )}

<div>
              {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-lg font-bold mb-4 text-black">
              {dialogType === 'rate' ? 'Rate the Product' : 'Write a Review'}
            </h2>
            {dialogType === 'rate' && (
               <div>
               <h3>Rate and Review the Creator</h3>
               <input type="number" value={tourGuideRating} onChange={(e) => setTourGuideRating(Number(e.target.value))} placeholder="Rating" min="1" max="5" />
               <input type="text" value={tourGuideComment} onChange={(e) => setTourGuideComment(e.target.value)} placeholder="Comment" />
               <button onClick={handleSubmitTourGuideReview}>Submit</button>
             </div>
            )}
            <button
              onClick={handleSubmitTourGuideReview}
              className="bg-blue-500 text-white p-2 rounded mr-2"
            >
              Submit
            </button>
            <button
              onClick={closeDialog}
              className="bg-gray-300 text-black p-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
            </div>
    </Card>
  );
//     <div className='mb-6 text-black text-left w-fit min-w-[45ch] bg-white mx-auto rou h-fit rounded'>
//         <div className='grid p-2'>
//         {!itinerary.bookingOpen && (itinerary.interstedIn.includes(tourist._id)?
//          <GoBellFill size={20} onClick={() => (handleNotIntersted(itinerary._id))}/>:     
//          <GoBell size={20} onClick={() => (handleIntersted(itinerary._id))}/>     
//          )} 
       
//       <h2>{itinerary.name}</h2>
//       <p>Preference Tag: {itinerary.preferenceTag}</p>
//       <p>Language: {itinerary.language}</p>
//       <p>Price: {displayPrice} {user.chosenCurrency}</p>
//       <h3>Activities:</h3>
//       <ul>
//         {itinerary.activities.map((activity, index) => (
//           <li key={index+1}>
//             <p>Activity{index+1}: {activity.name}  &nbsp;  Duration: {activity.duration} hours</p> 
            
//           </li>
//         ))}
//       </ul>
//       <p>pickup location: {itinerary.pickupLocation}</p>
//       <p>dropoff location: {itinerary.dropoffLocation}</p>
//       <h3>Locations:</h3>
//       <ul>
//         {itinerary.tourLocations.map((loc, index) => (
//           <li key={index}>
//             <p>{loc}</p>
//           </li>
//         ))}
//       </ul>
//       <h3>Available Dates:</h3>
//       <ul>
//         {itinerary.availableDates.map((date, index) => (
//           <li key={index}>
//             <p>{date}</p>
//           </li>
//         ))}
//       </ul>
//       <h3>Available Times:</h3>
//       <ul>
//         {itinerary.availableTimes.map((time, index) => (
//           <li key={index}>
//             <p>{time}</p>
//           </li>
//         ))}
//       </ul>
//       <p>Accessibility: {itinerary.accessibility}</p>
//       <p>creator: {itinerary.creator}</p>
//       <div>
//       {itinerary ? (
//         <p>Booked: {itinerary.isBooked ? 'Yes' : 'No'}</p>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
// </div>
// <QuantitySelector onChange={handleQuantityChange} maxValue={100} />
// <button 
//   onClick={handleRedirectToReviews} 
//   className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
// >
//   View Tour Guide Reviews
// </button>
// <div>
//         <h3>Rate and Review the Creator</h3>
//         <input type="number" value={tourGuideRating} onChange={(e) => setTourGuideRating(Number(e.target.value))} placeholder="Rating" min="1" max="5" />
//         <input type="text" value={tourGuideComment} onChange={(e) => setTourGuideComment(e.target.value)} placeholder="Comment" />
//         <button onClick={handleSubmitTourGuideReview}>Submit</button>
//       </div>
// <Card.Text as='div'>
//           <Rating
//             value={itinerary.rating}
//             text={${itinerary.numReviews} reviews}
//           />
//         </Card.Text>
// <div>
// <h3>Add a Review</h3>
//       <input type="number" value={rating} onChange={(e) => setRating(Number(e.target.value))}  placeholder="Rating" />
//       <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comment" />
//       <button onClick={handleSubmitItineraryReview}>Submit</button>
//     </div> 
//     <div>
//         <button 
//           onClick={handleViewReviewsClick}
//           className='px-1 py-0.5 bg-blue-700 text-white cursor-pointer border-none m-1 p-0.5 rounded transform transition-transform duration-300 hover:scale-105'>
//           View Reviews
//         </button>
//       </div>
//       <div className='flex justify-between'>
//       {   !tourist?.itineraryBookings?.includes(itinerary._id) ?
//          <button onClick={() => (handleBookClick(itinerary._id , quantity))} className="p-2 bg-blue-500 text-white">book</button>  :   
//          <button onClick={() => (handleUnBook(itinerary._id))} className="p-2 bg-blue-500 text-white">unbook</button>     
//          }
//          </div>
//         <div className='flex justify-between'>
//         <div className='flex'>
//         </div>
//         <button className="p-2 bg-blue-500 text-white" onClick={() => handleShare(itinerary._id)}>copy link</button>
//         <button className="p-2 bg-blue-500 text-white" onClick={() => setIsModalOpen(true)}>
//         Share via Mail
//         </button>
//         {isModalOpen && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 mt-[30vh] w-fit mx-auto flex h-fit justify-center">
//           <div className="bg-white p-4 rounded shadow-lg max-w-sm w-full">
//             <h3 className="text-xl mb-4">Share Itinerary via Email</h3>
//             <label className="block mb-2">
//               To:
//               <input 
//                 type="email" 
//                 value={email} 
//                 onChange={(e) => setEmail(e.target.value)} 
//                 className="w-full p-2 border rounded mt-1"
//                 placeholder="Recipient's email"
//               />
//             </label>
//             <div className="flex justify-end mt-4">
//               <button className="p-2 bg-red-500 text-white rounded mr-2" onClick={() => setIsModalOpen(false)}>
//                 Cancel
//               </button>
//               <button className="p-2 bg-green-500 text-white rounded w-[8ch]" onClick={() => handleShareViaMail(itinerary._id)}>
//                 {isLoading ? <FiLoader className='mx-auto animate-spin'/> : "Send"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//         </div>
//         </div>
//   )
  
}
export default TouristItineraryContainer