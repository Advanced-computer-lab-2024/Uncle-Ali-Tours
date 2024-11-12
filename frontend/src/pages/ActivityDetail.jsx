import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import ActivityContainer from '../components/ActivityContainer';
import { useActivityStore } from '../store/activity';
import { FiLoader } from "react-icons/fi";

function ActivityDetail(){
    const { id } = useParams(); // Extract itinerary ID from URL    
    const {activities,getActivities} = useActivityStore();
    const navigate = useNavigate();

    if(!id){
        navigate("/")
      }

      console.log(id)
    
    getActivities({_id:id});

    if(!activities[0]) return <FiLoader size={50} className='animate-spin mx-auto mt-[49vh]'/>;  

    return (
        <div>Activity Detail  
                <ActivityContainer activity={activities[0]}/>  
        </div>
      )

}
export default ActivityDetail;