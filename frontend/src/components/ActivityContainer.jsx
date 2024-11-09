import React from 'react'
import { useState } from 'react';
import { MdDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import {dialog} from '../components/Dialog.jsx'
import { formdialog } from './FormDialog.jsx'; 
import { FiLoader } from 'react-icons/fi'; 
import {useUserStore} from '../store/user.js';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
function ActivityContainer({activity, activityChanger}) {
  const keys = Object.keys(activity)
  keys.map((key)=> (
   `${key}: ${activity[key]}`
  ))
  const [email,setEmail]=useState("");
  const { showDialog } = dialog()
  const { showFormDialog } = formdialog()
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useUserStore((state) => state.user);


  const handleClick = () => {
    showDialog()
    tagChanger(tagName)
  }

  const handleShare = (id) => {
    const link = `${window.location.origin}/activityDetail/${id}`;
    
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
    const link = `${window.location.origin}/activityDetail/${id}`;
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
  

 
  return (
    <div className='mb-6 text-black text-left w-fit min-w-[45ch] bg-white mx-auto rou h-fit rounded'>
      <Toaster />
        <div className='grid p-2'>
       { keys.map((key,index)=> (
    
    key==="location" ? <p key={index}>location: {activity.location.coordinates}</p> : <p>{key}: {activity[key]}</p>
  ))}
  <button className="p-2 bg-blue-500 text-white" onClick={() => handleShare(activity._id)}>copy link</button>
  <br/>
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
              <button className="p-2 bg-green-500 text-white rounded w-[8ch]" onClick={() => handleShareViaMail(activity._id)}>
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

export default ActivityContainer