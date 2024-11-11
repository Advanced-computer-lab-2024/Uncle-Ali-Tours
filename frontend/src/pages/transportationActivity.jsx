import React from 'react'
import { useState, useEffect } from 'react';
import { useTransportationActivityStore } from '../store/transportationActivity.js';
import { useTouristStore } from '../store/tourist';
import Dialog from '../components/Dialog.jsx'
import FormDialog from '../components/FormDialog.jsx'
import TransportationActivityContainer from '../components/transportationActivityContainer.jsx';
import { FiLoader } from "react-icons/fi";

function ViewTransportationActivity() {
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

  const [sort, setSort] = useState(
    {}
);
const { tourist } = useTouristStore();

    const {transportationActivities, getTransportationActivities} = useTransportationActivityStore();

    
     getTransportationActivities();

if (!transportationActivities) {
    return <FiLoader size={50} className="animate-spin mx-auto mt-[49vh]" />;
}


   return (
    <div className='text-black'>
      

        <div className={` grid w-fit mx-auto`} >
        <div>
      <div className='mb-4 text-xl'>
            Available Transportation Activities   
        </div>
        {
            transportationActivities.map((activity, index)=> (
                <TransportationActivityContainer key={index} activityChanger={changeTransportationActivity} activity={activity}/>   
            ))
        }
        <Dialog msg={"Are you sure you want to delete this itinerary?"} accept={() => del()} reject={() => (console.log("rejected"))} acceptButtonText='Delete' rejectButtonText='Cancel'/>
        <FormDialog msg={"Update values"} accept={() => del()} reject={() => (console.log("rejected"))} acceptButtonText='Update' rejectButtonText='Cancel' inputs={["name","value"]}/>
   
    
    </div>
       </div>
        </div>
  )
}

export default ViewTransportationActivity