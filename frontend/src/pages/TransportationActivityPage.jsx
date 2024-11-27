import React from 'react'
import { useState, useEffect } from 'react';
import { useTransportationActivityStore } from '../store/transportationActivity.js';
import { useTouristStore } from '../store/tourist';
import Dialog, { dialog } from '../components/Dialog.jsx';
import TransportationActivityContainer from '../components/transportationActivityContainer.jsx';
import { FiLoader } from "react-icons/fi";
import { useUserStore } from '../store/user.js';
import toast, { Toaster } from 'react-hot-toast';



function TransportationActivityPage() {
    const user = JSON.parse(localStorage.getItem("user"));;
    const [filter, setFilter] = useState(
        {}
    );
    const [applyPreferences, setApplyPreferences] = useState(false);
    const [curTransportationActivity, setCurTransportationActivity] = useState(-1);
    const changeTransportationActivity = (id) => (
      setCurTransportationActivity(id)
    )
    const [visibillity, setVisibillity] = useState(
      false
  );
  const {deleteTransportationActivity} = useTransportationActivityStore();
  const [sort, setSort] = useState(
    {}
);
const { tourist } = useTouristStore();

    const {transportationActivities, getTransportationActivities} = useTransportationActivityStore();

    
     getTransportationActivities({creator:user.userName},{});


if (!transportationActivities) {
    return <FiLoader size={50} className="animate-spin mx-auto mt-[49vh]" />;
}

const handelDeleteTransActivity = async() =>{
    if(user.type !== "advertiser" &&  user.type !== "admin"){
      return toast.error("you are not alloewd to delete an activity" , { className: 'text-white bg-gray-800' });
    }
    console.log(curTransportationActivity._id)
    const { success, message } = await deleteTransportationActivity(curTransportationActivity._id);
    success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
  } 

   return (
    <div className='text-black'>
      <Toaster />

        <div className={` grid w-fit mx-auto`} >
        <div>
      <div className='mb-4 text-xl'>
            My Transportation Activities   
        </div>
        {
            transportationActivities.map((activity, index)=> (
                <TransportationActivityContainer key={index} activityChanger={changeTransportationActivity} activity={activity}/>   
            ))
        }
        <Dialog msg={"Are you sure you want to delete this itinerary?"} accept={() => handelDeleteTransActivity()} reject={() => (console.log("rejected"))} acceptButtonText='Delete' rejectButtonText='Cancel'/>   
    
    </div>
       </div>
        </div>
  )
}

export default TransportationActivityPage