import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { FiLoader } from 'react-icons/fi';
import { GoBell, GoBellFill } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { useActivityStore } from '../store/activity.js';
import { useTouristStore } from '../store/tourist.js';
import { useUserStore } from '../store/user.js';
import QuantitySelector from './QuantitySelector.jsx';
import Rating from './Rating';






function TouristActivityContainer({ activity, activityChanger,onBookmarkToggle,isBookmarked }) {
  const [email, setEmail] = useState("");
  const { createActivityReview, bookmarkActivity, removeBookmark,interestedIn,removeInterestedIn } = useActivityStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [ setIsBookmarked] = useState(false);
  const [localIsBookmarked, setLocalIsBookmarked] = useState(isBookmarked);
  const [quantity, setQuantity] = useState(1);
  const { tourist } = useTouristStore();
  const navigate = useNavigate();



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



  const handleShare = (id) => {
    const link = `${window.location.origin}/activityDetail/${id}`;
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
    }).catch(() => {
      alert("Failed to copy link.");
    });
  };
  const handleShareViaMail = async (id) => {
    setIsLoading(true);
    const link = `${window.location.origin}/activityDetail/${id}`;
    const res = await fetch('/api/share/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName: user.userName, link : link, email:email})
    });
    const { success, message } = await res.json();
    if (success) {
      toast.success(message, { className: "text-white bg-gray-800" });
      setIsModalOpen(false);
    } else {
      toast.error(message, { className: "text-white bg-gray-800" });
    }
    setIsLoading(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const activityId = activity._id;

    if (!activityId) {
      console.error('Error: Activity ID is missing');
      return;
    }
    const { success, message } = await createActivityReview(activityId, rating, comment,user);
    if (success) {
      toast.success('Review added successfully!');
      setRating(0);
      setComment('');
    } else {
      toast.error('Failed to add review: ' + message);
    }
  };

  useEffect(() => {
    // Check if the activity is already bookmarked
    if (user?.bookmarkedActivities?.includes(activity._id)) {
        setIsBookmarked(true);
    }
}, [user, activity]);


const handleBookmarkToggle = (activityId, isBookmarked) => {
  setActivities((prev) =>
      prev.map((activity) =>
          activity._id === activityId ? { ...activity, isBookmarked } : activity
      )
  );
};

const handleToggleBookmark = async () => {
  try {
      const response = await fetch('/api/activity/toggleBookmark', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ activityId: activity._id }),
      });

      const data = await response.json();
      if (data.success) {
          toast.success(data.message);
          onBookmarkToggle(activity._id, data.activity.isBookmarked); // Update parent state
          const newIsBookmarked = data.activity.isBookmarked;

          // Update both local and parent states
          setLocalIsBookmarked(newIsBookmarked);
          onBookmarkToggle(activity._id, newIsBookmarked);
      } else {
          toast.error(data.message);
      }
  } catch (error) {
      toast.error('Failed to update bookmark');
      console.error('Error toggling bookmark:', error);
  }
};

const handleQuantityChange = (newQuantity) => {
  setQuantity(newQuantity);
};

const handleBookClick = async (activityID , quantity) => {
  try{
    navigate(`/payment/activity/${activityID}` , { state: { quantity: quantity } });
  }
  catch(error){
    console.error('Error:', error);
  }
};


   
  return (
    <div className='mb-6 text-black text-left w-fit min-w-[45ch] bg-white mx-auto h-fit rounded'>
      {!activity.bookingOpen && (activity.interstedIn.includes(tourist._id)?
         <GoBellFill size={20} onClick={() => (handleNotIntersted(activity._id))}/>:     
         <GoBell size={20} onClick={() => (handleIntersted(activity._id))}/>     
         )} 
       
         <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold"></h3>
                <button
                    onClick={handleToggleBookmark}
                    className="ml-2"
                    aria-label="Bookmark Activity"
                >
                    {localIsBookmarked ? (
                        <AiFillStar className="text-yellow-500" size={28} />
                    ) : (
                        <AiOutlineStar className="text-gray-500" size={28} />
                    )}
                </button>
            </div>
      <Toaster />
      <div className='grid p-2'>
        <p>Name: {activity.name}</p>
        <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
     
        <p>Location: {activity.location?.coordinates ? activity.location.coordinates.join(', ') : "Not available"}</p>
        <p>Price: ${activity.price}</p>
        <p>Category: {activity.category}</p>
        <p>Tags: {activity.tags?.join(', ') || "No tags"}</p>
        <p>Special Discounts: {activity.specialDiscounts || "None"}</p>
        <p>Booking Open: {activity.bookingOpen ? "Yes" : "No"}</p>
        <p>Creator: {activity.creator}</p>
        <p>Average Rating: {activity.rating} (from {activity.numReviews} reviews)</p>

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
        <button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
      <div>
        <h3>Reviews</h3>
        {activity.reviews.map((review, index) => (
          <div key={index}>
            <Rating value={review.rating} text={review.comment} />
          </div>
        ))}
      </div>
        <button className="p-2 bg-blue-500 text-white" onClick={() => handleShare(activity._id)}>Copy Link</button>
        <br />
        <button className="p-2 bg-blue-500 text-white" onClick={() => setIsModalOpen(true)}>
        Share via Mail
        </button>
        <QuantitySelector onChange={handleQuantityChange} maxValue={100} />
        <button onClick={() => (handleBookClick(activity._id , quantity))} className='mr-2 transform transition-transform duration-300 hover:scale-125 '>book</button>
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-lg max-w-sm w-full">
              <h3 className="text-xl mb-4">Share Activity via Email</h3>
              
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
                <button className="p-2 bg-green-500 text-white rounded w-[8ch]" onClick={() => handleShareViaMail(activity._id)}>
                  {isLoading ? <FiLoader className='mx-auto animate-spin' /> : "Send"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TouristActivityContainer;
