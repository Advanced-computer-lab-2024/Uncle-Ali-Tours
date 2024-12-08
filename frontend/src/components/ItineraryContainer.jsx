import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaShareAlt, FaStar } from 'react-icons/fa';
import { MdLocationOn, MdDateRange, MdAccessTime, MdPerson } from 'react-icons/md';
import { IoClose } from "react-icons/io5";
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/user';
import { useTouristStore } from '../store/tourist';
import { useItineraryStore } from '../store/itinerary';
import { useGuideStore } from '../store/tourGuide';
import { Modal } from "react-bootstrap";
import egypt from '../images/egypt.jpg';

function ItineraryContainer({ itinerary, itineraryChanger }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [tourGuideRating, setTourGuideRating] = useState(0);
  const [tourGuideComment, setTourGuideComment] = useState('');

  const navigate = useNavigate();
  const { user } = useUserStore();
  const { tourist, updateItineraryBookings, unItiniraryBook, updateMyPoints } = useTouristStore();
  const { createItineraryReview, bookItinerary, updateItinerary } = useItineraryStore();
  const { createTourGuideReview } = useGuideStore();

  const displayPrice = (itinerary.price * user.currencyRate).toFixed(2);

  useEffect(() => {
    if (tourist) {
      setIsWishlisted(tourist.itineraryBookings?.includes(itinerary._id));
    }
  }, [tourist, itinerary._id]);

  const handleBook = async () => {
    if (user.type !== "tourist") {
      return toast.error("You are not allowed to book an itinerary", { className: 'text-white bg-gray-800' });
    }
    const { success, message } = await updateItineraryBookings(user.userName, itinerary._id);
    if (success) {
      await updateMyPoints(user.userName, itinerary.price);
      setIsWishlisted(true);
    }
    success ? toast.success(message, { className: "text-white bg-gray-800" }) : toast.error(message, { className: "text-white bg-gray-800" });
  };

  const handleUnBook = async () => {
    if (user.type !== "tourist") {
      return toast.error("You are not allowed to unbook an itinerary", { className: 'text-white bg-gray-800' });
    }
    const { success, message } = await unItiniraryBook(user.userName, itinerary._id);
    if (success) {
      setIsWishlisted(false);
    }
    success ? toast.success(message, { className: "text-white bg-gray-800" }) : toast.error(message, { className: "text-white bg-gray-800" });
  };

  const handleShare = () => {
    const link = `${window.location.origin}/itineraryDetail/${itinerary._id}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Link copied to clipboard!", { className: "text-white bg-gray-800" });
    }).catch(() => {
      toast.error("Failed to copy link.", { className: "text-white bg-gray-800" });
    });
  };

  const handleShareViaMail = async () => {
    const link = `${window.location.origin}/itineraryDetail/${itinerary._id}`;
    const res = await fetch('/api/share/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName: user.userName, link: link, email: email })
    });
    const { success, message } = await res.json();
    if (success) {
      toast.success(message, { className: "text-white bg-gray-800" });
      setIsModalOpen(false);
    } else {
      toast.error(message, { className: "text-white bg-gray-800" });
    }
  };

  const handleSubmitItineraryReview = async (e) => {
    e.preventDefault();
    if (!tourist?.itineraryBookings?.includes(itinerary._id)) {
      return toast.error('You must book this itinerary before reviewing', { className: "text-white bg-gray-800" });
    }
    const { success, message } = await createItineraryReview(itinerary._id, rating, comment, user);
    if (success) {
      toast.success('Review added successfully!', { className: "text-white bg-gray-800" });
      setRating(0);
      setComment('');
    } else {
      toast.error('Failed to add review: ' + message, { className: "text-white bg-gray-800" });
    }
  };

  const handleSubmitTourGuideReview = async (e) => {
    e.preventDefault();
    if (!tourist?.itineraryBookings?.includes(itinerary._id)) {
      return toast.error('You must book this itinerary before reviewing the tour guide', { className: "text-white bg-gray-800" });
    }
    const { success, message } = await createTourGuideReview(itinerary.creator, tourGuideRating, tourGuideComment, user);
    if (success) {
      toast.success('Tour guide review added successfully!', { className: "text-white bg-gray-800" });
      setTourGuideRating(0);
      setTourGuideComment('');
    } else {
      toast.error('Failed to add tour guide review: ' + message, { className: "text-white bg-gray-800" });
    }
  };

  return (
    <div className="relative p-6 w-[650px] h-auto flex flex-col backdrop-blur-lg bg-[#FEFDED]/75 mx-auto m-4 rounded-lg shadow-lg text-black">
      <Toaster />
      <div className="flex mb-4">
        <div className="w-1/2 pr-4">
          <img
            src={itinerary.image || egypt}
            alt={itinerary.name}
            className="w-full h-48 object-cover rounded-lg cursor-pointer"
            onClick={() => setShowPreview(true)}
          />
        </div>
        <div className="w-1/2 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{itinerary.name}</h2>
            <p className="mb-2 flex items-center">
              <MdPerson className="mr-2" />
              {itinerary.creator}
            </p>
            <p className="mb-2 flex items-center">
              <MdLocationOn className="mr-2" />
              {itinerary.tourLocations.join(", ")}
            </p>
            <p className="mb-2 flex items-center">
              <MdDateRange className="mr-2" />
              {itinerary.availableDates.map(date => new Date(date).toLocaleDateString()).join(", ")}
            </p>
            <p className="mb-2 flex items-center">
              <MdAccessTime className="mr-2" />
              {itinerary.availableTimes.join(", ")}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold">{displayPrice} {user.chosenCurrency}</p>
            <div className="flex items-center">
              <FaStar className="text-yellow-400 mr-1" />
              <span>{itinerary.rating.toFixed(1)} ({itinerary.numReviews} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">Activities:</h3>
        <ul className="list-disc pl-5">
          {itinerary.activities.map((activity, index) => (
            <li key={index}>
              {activity.name} - {activity.duration} hours
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={isWishlisted ? handleUnBook : handleBook}
          className="flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          {isWishlisted ? (
            <>
              <FaHeart className="mr-2" />
              Unbook
            </>
          ) : (
            <>
              <FaRegHeart className="mr-2" />
              Book
            </>
          )}
        </button>
        <button
          onClick={handleShare}
          className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <FaShareAlt className="mr-2" />
          Share
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Share via Email
        </button>
      </div>

      <Modal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        centered
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPreview(false)}
          >
            <IoClose size={24} />
          </button>
          <img
            src={itinerary.image || egypt}
            alt={itinerary.name}
            className="w-full h-auto"
          />
        </div>
      </Modal>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Share Itinerary via Email</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Recipient's email"
            />
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleShareViaMail}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-bold mb-2">Add a Review</h3>
        <div className="flex items-center mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review here..."
          className="w-full p-2 border rounded mb-2"
          rows="3"
        />
        <button
          onClick={handleSubmitItineraryReview}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Submit Review
        </button>
      </div>

      <div className="mt-6">
        <h3 className="font-bold mb-2">Review the Tour Guide</h3>
        <div className="flex items-center mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`cursor-pointer ${star <= tourGuideRating ? 'text-yellow-400' : 'text-gray-300'}`}
              onClick={() => setTourGuideRating(star)}
            />
          ))}
        </div>
        <textarea
          value={tourGuideComment}
          onChange={(e) => setTourGuideComment(e.target.value)}
          placeholder="Write your review for the tour guide here..."
          className="w-full p-2 border rounded mb-2"
          rows="3"
        />
        <button
          onClick={handleSubmitTourGuideReview}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Submit Tour Guide Review
        </button>
      </div>
    </div>
  );
}

export default ItineraryContainer;

