import React from 'react'
import { useState } from 'react';
import Dialog from '../components/Dialog.jsx'
import FormDialog from '../components/FormDialog.jsx'
import { useEffect } from 'react';
import { useUserStore } from '../store/user.js';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useActivityStore } from '../store/activity.js';
import ActivityContainer from '../components/ActivityContainer.jsx';
function ActivityPage() {
  const {user} = useUserStore();
  const {activities, createActivity, getActivities,deleteActivities} = useActivityStore();  
  useEffect(() => {
    console.log(user.userName)
    getActivities({creator:user.userName}); 
  }, [])
  const [curActivity, setCurActivity] = useState(-1);
  const changeActivity = (id) => (
    setCurActivity(id)
  )
  const activityChanger = (activity) => {
    setCurItinerary(activity);
  }
  const del = async () => {
    const {success, message} = await deleteActivity(curActivity._id)
    success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
  }
  

  return (
    <div>
      <Link to='/createActivity'>
      <button className='px-5 py-2 bg-green-700 text-white cursor-pointer border-none m-6 p-2 rounded transform transition-transform duration-300 hover:scale-105' >Create New Activity</button>
      </Link>
      <div className='mb-4 text-xl'>
            Available activities   
        </div>
        {
            activities.map((act, index)=> (
                <ActivityContainer key={index} activityChanger={changeActivity} activity={act}/>   
            ))
        }
        <Dialog msg={"Are you sure you want to delete this activity?"} accept={() => del()} reject={() => (console.log("rejected"))} acceptButtonText='Delete' rejectButtonText='Cancel'/>
        <FormDialog msg={"Update values"} accept={() => del()} reject={() => (console.log("rejected"))} acceptButtonText='Update' rejectButtonText='Cancel' inputs={["name","value"]}/>
   
        <Toaster/>
    </div>
  )
}

export default ActivityPage