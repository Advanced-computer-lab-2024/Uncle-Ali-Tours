import React, { useState } from 'react';
import { MdDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { dialog } from '../components/Dialog.jsx';
import { formdialog } from './FormDialog.jsx'; 
import { FiLoader } from 'react-icons/fi'; 
import { useUserStore } from '../store/user.js';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useTouristStore } from '../store/tourist.js';

function TransportationActivityContainer({ activity, activityChanger }) {
  const [email, setEmail] = useState("");
  const { showDialog } = dialog();
  const { showFormDialog } = formdialog();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const {tourist, updateBookings,unBook} = useTouristStore();
  


  const handleShare = (id) => {
    const link = `${window.location.origin}/transportationActivityDetail/${id}`;
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
    }).catch(() => {
      alert("Failed to copy link.");
    });
  };

  console.log(tourist.myBookings)

  const handleShareViaMail = async (id) => {
    setIsLoading(true);
    const link = `${window.location.origin}/transportationActivityDetail/${id}`;
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
    setIsLoading(false);
  };

  // const handelDeleteTransActivity = async(id) =>{
  //   if(user.type !== "advertiser" || user.type !== "admin"){
  //     return toast.error("you are not alloewd to create an activity" , { className: 'text-white bg-gray-800' });
  //   }
  //   const { success, message } = await deleteTransportationActivity(id);
  //   success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
  // }  

  const handleClick = () => {
    showDialog()
    activityChanger(activity)
  }

  const handleBook = async (id) =>{
    if(user.type !== "tourist"){
          return toast.error("you are not alloewd to book an activity" , { className: 'text-white bg-gray-800' });
        }
        const { success, message } = await updateBookings(user.userName,id);
        success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
  }

  const handleUnBook = async (id) =>{
    if(user.type !== "tourist"){
          return toast.error("you are not alloewd to book an activity" , { className: 'text-white bg-gray-800' });
        }
        const { success, message } = await unBook(user.userName,id);
        success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
  }

  return (
    <div className='mb-6 text-black text-left w-fit min-w-[45ch] bg-white mx-auto h-fit rounded'>
      <Toaster />
      <div className='grid p-2'>
        <h2>{activity.name}</h2>
        <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
        <p>Time: {activity.time}</p>
        <p>Pickup Location: {activity.pickUpLocation}</p>
        <p>Dropoff Location: {activity.dropOfLocation}</p>
        <p>Price: ${activity.price}</p>
        <p>Booking Open: {activity.bookingOpen ? "Yes" : "No"}</p>
        <p>Creator: {activity.creator}</p>

        {/* Share options */}
        <button className="p-2 bg-blue-500 text-white mt-2" onClick={() => handleShare(activity._id)}>Copy Link</button>
        <button className="p-2 bg-blue-500 text-white mt-2" onClick={() => setIsModalOpen(true)}>Share via Email</button>
        <div>   
         <button onClick={() => (handleClick())} className='mr-2 transform transition-transform duration-300 hover:scale-125 '><MdDelete size='18' color='black' /></button>
         {   !tourist?.myBookings?.includes(activity._id) ?
         <button onClick={() => (handleBook(activity._id))} className='mr-2 transform transition-transform duration-300 hover:scale-125 '>book</button>  :   
         <button onClick={() => (handleUnBook(activity._id))} className='mr-2 transform transition-transform duration-300 hover:scale-125 '>unbook</button>     
         }
         </div>

    
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

export default TransportationActivityContainer;
