import React, { useState ,useRef,useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FiLoader } from 'react-icons/fi';
import { Card } from 'react-bootstrap';
import { MdDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { dialog } from '../components/Dialog.jsx';
import {  Button } from 'react-bootstrap';
import { FaShareAlt, FaStar } from 'react-icons/fa';
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
import egypt from '../images/egypt.jpg';
import Dialog from '../components/Dialog.jsx';
import AdjustableDialog  from '../components/AdjustableDialog.jsx';
import { IoClose } from 'react-icons/io5';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { tourist, updateItineraryBookings, unItiniraryBook, updateMyPoints } = useTouristStore();
  const { createItineraryReview, bookItinerary, updateItinerary, deleteItinerary, activateItinerary, deactivateItinerary } = useItineraryStore();
  const { createTourGuideReview } = useGuideStore();

  const displayPrice = (itinerary.price * user.currencyRate).toFixed(2);

  

  const handleActivate = async () => {
    const { success, message } = await activateItinerary(itinerary._id);
    success ? toast.success(message) : toast.error(message);
  };

  const handleDeactivate = async () => {
    const { success, message } = await deactivateItinerary(itinerary._id);
    success ? toast.success(message) : toast.error(message);
  };


  const handleShare = () => {
    const link = `${window.location.origin}/itineraryDetail/${itinerary._id}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Link copied to clipboard!", { className: "text-white bg-gray-800" });
    }).catch(() => {
      toast.error("Failed to copy link.", { className: "text-white bg-gray-800" });
    });
  };

  const handleDelete = async () => {
    const { success, message } = await deleteItinerary(itinerary._id);
    success ? toast.success(message) : toast.error(message);
  };

  const handleDeleteClick = () => {
    showDialog();
    itineraryChanger(itinerary);
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
  <div className="mb-8 text-black text-left w-full max-w-3xl bg-white mx-auto rounded-lg shadow-lg p-6">
    <div className="grid gap-6">
      {/* Image Section */}
      <div className="flex justify-center mb-6">
        {previewFile ? (
          <img
            className="w-40 h-40 rounded-full object-cover"
            src={previewFile}
            alt="Product Image"
          />
        ) : (
          <div className="text-gray-500 text-lg">Add image</div>
        )}
      </div>

      {/* Itinerary Information */}
      <div className="space-y-4">
        <p className="font-semibold text-lg">Name: {itinerary.name}</p>
        <p className="text-sm text-gray-700">Tags: {itinerary.tags?.join(', ') || "No tags"}</p>
        <p className="text-sm text-gray-700">Language: {itinerary.language}</p>
        <p className="text-sm text-gray-700">Price: {displayPrice} {user.chosenCurrency}</p>

        {/* Activities Section */}
        <div>
          <p className="font-semibold text-lg">Activities:</p>
          <ul className="list-disc pl-5 space-y-2">
            {itinerary.activities.map((activity, index) => (
              <li key={index}>
                <p className="text-sm">Activity {index + 1}: {activity.name}</p>
                <p className="text-xs text-gray-500">Duration: {activity.duration} hours</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Locations & Dates */}
        <div>
          <p className="font-semibold text-lg">Pickup Location: {itinerary.pickupLocation}</p>
          <p className="font-semibold text-lg">Dropoff Location: {itinerary.dropoffLocation}</p>
          <h3 className="font-semibold">Locations:</h3>
          <p>{itinerary.tourLocations.join(", ")}</p>

          <h3 className="font-semibold">Available Dates:</h3>
          <p>{itinerary.availableDates.map((date) => new Date(date).toLocaleDateString()).join(", ")}</p>

          <h3 className="font-semibold">Available Times:</h3>
          <p>{itinerary.availableTimes.join(", ")}</p>

          <p className="font-semibold">Accessibility: {itinerary.accessibility}</p>
          <p className="font-semibold">Number Of Bookings: {itinerary.numberOfBookings}</p>
          <p className="font-semibold">Creator: {itinerary.creator}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-between gap-4 mt-6">
        <Button onClick={handleShare} variant="outline" className="flex items-center">
          <FaShareAlt className="mr-2" />
          Share
        </Button>
        <Button onClick={() => setIsModalOpen(true)} variant="outline">
          Share via Email
        </Button>
        <Button onClick={handleUpdateClick} variant="outline" className="flex items-center">
          <MdOutlineDriveFileRenameOutline size="18" className="mr-2" />
          Update
        </Button>
        <Button onClick={handleDeleteClick} variant="destructive" className="flex items-center">
          <MdDelete size="18" className="mr-2" />
          Delete
        </Button>
        <Button onClick={handleActivateClick} variant={itinerary.isActivated ? "destructive" : "default"}>
          {itinerary.isActivated ? "Deactivate" : "Activate"}
        </Button>
      </div>

      {/* Confirmation Dialogs */}
      <Dialog
        msg={"Are you sure you want to delete this itinerary?"}
        accept={handleDelete}
        reject={() => console.log("Deletion canceled")}
        acceptButtonText="Delete"
        rejectButtonText="Cancel"
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

      {/* Image Preview Modal */}
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
            className="w-full h-auto rounded-lg"
          />
        </div>
      </Modal>

      {/* Email Share Modal */}
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