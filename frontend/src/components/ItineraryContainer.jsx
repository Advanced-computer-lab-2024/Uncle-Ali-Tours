import React, { useState ,useRef,useEffect } from 'react';
import { Card } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { FiLoader } from 'react-icons/fi';
import { MdDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { dialog } from '../components/Dialog.jsx';
// import { Button } from '../components/Button.jsx';

import { useItineraryStore } from '../store/itinerary.js';
import { useGuideStore } from '../store/tourGuide.js';
import { useTouristStore } from '../store/tourist.js';
import { useUserStore } from '../store/user.js';
import { adjustableDialog } from './AdjustableDialog.jsx';
import { formdialog } from './FormDialog.jsx';
import Rating from './Rating';
import { FaEye, FaEdit } from 'react-icons/fa';
import AvatarEditor from 'react-avatar-editor';
import { Modal } from 'react-bootstrap';

function ItineraryContainer({itinerary, itineraryChanger , accept , reject}) {
  const {currentItinerary, setCurrentItinerary } = useItineraryStore();
  const [email,setEmail]=useState("");  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [previewFile, setPreviewFile] = useState(localStorage.getItem("profilePicture") || "");
  const [showPreview, setShowPreview] = useState(false);
  const [scale, setScale] = useState(1.2);
  const [rotate, setRotate] = useState(0);
  const editorRef = useRef(null);
  const [tourGuideRating, setTourGuideRating] = useState(0);
  const [tourGuideComment, setTourGuideComment] = useState('');

  const navigate = useNavigate();
  const { user } = useUserStore();
  const { tourist, updateItineraryBookings, unItiniraryBook, updateMyPoints } = useTouristStore();
  const { createItineraryReview, bookItinerary, updateItinerary, deleteItinerary, activateItinerary, deactivateItinerary } = useItineraryStore();
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
  const handleRedirectToReviews = () => {
    navigate('/tourguidereviews');
  };


  const handleViewReviewsClick = () => {
    setCurrentItinerary(itinerary); // Set the itinerary in the store
    navigate('/viewReviews');       // Navigate to the view reviews page
  };

  const { showDialog } = dialog();
  const { showFormDialog } = formdialog();
  const { showAdjustableDialog } = adjustableDialog();

  const handleUpdateClick = () => {
    showFormDialog();
    itineraryChanger(itinerary);
  };

const activate = async () => {
  const {success, message} = await activateItinerary(curItinerary._id)
  success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
}
const deactivate = async () => {
  const {success, message} = await deactivateItinerary(curItinerary._id)
  success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
}
useEffect(() => {
  const savedImages = JSON.parse(localStorage.getItem("aImages")) || [];
  const aImage = savedImages.find(img => img.id === itinerary._id);
  if (aImage) {
    setPreviewFile(aImage.image);
  }
}, [itinerary]);

  const handleActivateClick = () => {
    showAdjustableDialog();
    itineraryChanger(itinerary);
  };

const toggleEdit = () => {
  setIsEditing((prev) => !prev);
  setProfilePic(null);
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    setProfilePic(file);
    //localStorage.removeItem("profilePicture");
  }
};

const handleSave = () => {
  if (editorRef.current && profilePic) {
    const canvas = editorRef.current.getImageScaledToCanvas();
    const dataUrl = canvas.toDataURL();

    try {
      const savedImages = JSON.parse(localStorage.getItem("aImages")) || [];
      const uImages = savedImages.filter(img => img.id !== itinerary._id);
      uImages.push({ id: itinerary._id, image: dataUrl });

      localStorage.setItem("aImages", JSON.stringify(uImages));
      setPreviewFile(dataUrl);
      setIsEditing(false);
      setProfilePic(null);
      toast.success("Profile picture saved locally", { className: "text-white bg-gray-800" });
    } catch (error) {
      toast.error("Error saving profile photo locally", { className: "text-white bg-gray-800" });
    }
  } else {
    toast.error("No file selected for upload", { className: "text-white bg-gray-800" });
  }
};


// useEffect(() => {
//   const savedImages = JSON.parse(localStorage.getItem("Images")) || [];
//   const Image = savedImages.find(img => img.id === itinerary._id);
//   if (Image) {
//     setPreviewFile(Image.image);
//   }
// }, [itinerary]);

// const toggleEdit = () => {
//   setIsEditing((prev) => !prev);
//   setProfilePic(null);
// };

// const handleFileChange = (event) => {
//   const file = event.target.files[0];
//   if (file) {
//     setProfilePic(file);
//    // localStorage.removeItem("profilePicture");
//   }
// };

// const handleSave = async () => {
// if (editorRef.current && profilePic) {
// const canvas = editorRef.current.getImageScaledToCanvas();
// const dataUrl = canvas.toDataURL();

// try {
//   const savedImages = JSON.parse(localStorage.getItem("Images")) || [];
//   const updatedImages = savedImages.filter(img => img.id !== itinerary._id);
//   updatedImages.push({ id: itinerary._id, image: dataUrl });


//   localStorage.setItem("profilePicture", JSON.stringify(updatedImages));
//   setPreviewFile(dataUrl);
//   setIsEditing(false);
//   setProfilePic(null);
//   toast.success("Profile picture saved locally", { className: "text-white bg-gray-800" });
// } catch (error) {
//   toast.error("Error saving profile photo locally", { className: "text-white bg-gray-800" });
// }
// } else {
// toast.error("No file selected for upload", { className: "text-white bg-gray-800" });
// }
// };



  

  return (
    <div className='mb-6 text-black text-left w-fit min-w-[45ch] bg-white mx-auto rou h-fit rounded'>
        <div className='grid p-2'>
        <div className="flex items-center justify-center mb-6">
        {previewFile ? (
          <img
            className="w-40 h-40 rounded-full object-cover"
            src={previewFile}
            alt="Product Image"
          />
        ) : (
          <div className="text-gray-500">Add image</div>
        )}
        <div className="icon-buttons ml-4">
          <button className="p-2" onClick={() => setShowPreview(true)}>
            <FaEye className="h-4 w-4" />
          </button>
          <button className="p-2" onClick={toggleEdit}>
            <FaEdit className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isEditing && (
        <>
          <input
            type="file"
            onChange={handleFileChange}
            className="mb-4 p-2 border rounded"
          />
          {profilePic && (
            <div className="avatar-editor">
              <AvatarEditor
  ref={editorRef}
  image={profilePic}
  width={150}
  height={150}
  border={30}
  borderRadius={75}
  color={[255, 255, 255, 0.6]}
  scale={scale}
  rotate={rotate}
  className="mx-auto mb-4"
/>

              <div className="controls mt-3 space-y-4">
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full"
                />
                <button 
                  onClick={() => setRotate((prev) => prev + 90)}
                  className="bg-blue-500 text-white p-2 rounded w-full"
                >
                  Rotate
                </button>
                <button 
                  onClick={handleSave}
                  className="bg-green-500 text-white p-2 rounded w-full"
                >
                  Save Image
                </button>
              </div>
            </div>
          )}
        </>
      )}

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

        <div className="mt-4">
          <h3 className="font-bold mb-2">Activities:</h3>
          <ul className="list-disc pl-5">
            {itinerary.activities.map((activity, index) => (
              <li key={index}>
                {activity.name} - {activity.duration} hours
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap justify-between items-center mt-4 gap-2">
          <Button
            onClick={isWishlisted ? handleUnBook : handleBook}
            variant={isWishlisted ? "destructive" : "default"}
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
          </Button>
          <Button onClick={handleShare} variant="outline">
            <FaShareAlt className="mr-2" />
            Share
          </Button>
          <Button onClick={() => setIsModalOpen(true)} variant="outline">
            Share via Email
          </Button>
          <Button onClick={handleUpdateClick} variant="outline">
            <MdOutlineDriveFileRenameOutline size='18' className="mr-2" />
            Update
          </Button>
          <Button onClick={handleDeleteClick} variant="destructive">
            <MdDelete size='18' className="mr-2" />
            Delete
          </Button>
          <Button
            onClick={handleActivateClick}
            variant={itinerary.isActivated ? "destructive" : "default"}
          >
            {itinerary.isActivated ? "Deactivate" : "Activate"}
          </Button>
        </div>

      <CardFooter className="flex flex-col gap-4">
        <div className="w-full">
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
          <Button onClick={handleSubmitItineraryReview}>
            Submit Review
          </Button>
        </div>

        <div className="w-full">
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
          <Button onClick={handleSubmitTourGuideReview}>
            Submit Tour Guide Review
          </Button>
        </div>
      </CardFooter>

      <Dialog
        msg={"Are you sure you want to delete this itinerary?"}
        accept={handleDelete}
        reject={() => console.log("Deletion canceled")}
        acceptButtonText='Delete'
        rejectButtonText='Cancel'
      />

      <AdjustableDialog
        state={itinerary.isActivated}
        msg1="Are you sure that you want to activate this itinerary?"
        msg2="Are you sure that you want to deactivate this itinerary?"
        accept1={handleActivate}
        accept2={handleDeactivate}
        reject1={() => console.log("Activation canceled")}
        reject2={() => console.log("Deactivation canceled")}
        acceptButtonText="Yes"
        rejectButtonText="Cancel"
      />

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
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button onClick={handleShareViaMail}>
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
              </div>
              </div>

  );
}

export default ItineraryContainer;