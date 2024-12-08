import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FiLoader } from 'react-icons/fi';
import { MdDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { dialog } from '../components/Dialog.jsx';
import { useActivityStore } from '../store/activity.js';
import { useTouristStore } from '../store/tourist.js';
import { useUserStore } from '../store/user.js';
import { formdialog } from './FormDialog.jsx';
import Rating from './Rating';

function ActivityContainer({ activity, activityChanger }) {
  const [email, setEmail] = useState("");
  const { showDialog } = dialog();
  const { showFormDialog } = formdialog();
  const { createActivityReview } = useActivityStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const displayPrice = (activity.price * user.currencyRate).toFixed(2);
  const {tourist, updateRealActivityBookings,unRealActivityBook} = useTouristStore();
  const navigate = useNavigate();

  const handleClick = () => {
    showDialog()
    activityChanger(activity)
  }
  

  const handleUpdateClick = () => {
    showFormDialog()
    activityChanger(activity)
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

    if(!tourist?.ActivityBookings?.includes(activity._id))
    {
      return toast.error('Failed to add review: ');
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

  const handleBook = async (id) =>{
    if(user.type !== "tourist"){
          return toast.error("you are not alloewd to book an activity" , { className: 'text-white bg-gray-800' });
        }
        const { success, message } = await updateRealActivityBookings(user.userName,id);
        if(success) {await updateMyPoints(user.userName,activity.price)}
        success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
  }

  const handleUnBook = async (id) =>{
    if(user.type !== "tourist"){
          return toast.error("you are not alloewd to book an activity" , { className: 'text-white bg-gray-800' });
        }
        const { success, message } = await unRealActivityBook(user.userName,id);
        success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
  }

  return (
    <div className='mb-6 text-black text-left w-fit min-w-[45ch] bg-white mx-auto h-fit rounded'>
      <Toaster />
      <div className='grid p-2'>
        <p>Name: {activity.name}</p>
        <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
        <p>Time: {activity.time}</p>
        <p>Location: {activity.location?.coordinates ? activity.location.coordinates.join(', ') : "Not available"}</p>
        <p>Price: {displayPrice} {user.chosenCurrency}</p>
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
      <Link 
          to='/updateActivity'
          className='mr-4 transform transition-transform duration-300 hover:scale-125'
        >
          <MdOutlineDriveFileRenameOutline size='18' color='black' />
        </Link>
      <button onClick={handleClick} className='mr-2 transform transition-transform duration-300 hover:scale-125 '><MdDelete size='18' color='black' /></button>

      

      


        <button className="p-2 bg-blue-500 text-white" onClick={() => handleShare(activity._id)}>Copy Link</button>
        <br />
        <button className="p-2 bg-blue-500 text-white" onClick={() => setIsModalOpen(true)}>
        Share via Mail
        </button>
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

export default ActivityContainer;