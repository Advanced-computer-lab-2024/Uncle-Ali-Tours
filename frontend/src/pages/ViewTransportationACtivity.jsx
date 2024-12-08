import { useState, useEffect } from 'react';
import { useTransportationActivityStore } from '../store/transportationActivity.js';
import { useTouristStore } from '../store/tourist';
import Dialog, { dialog } from '../components/Dialog.jsx';
import TransportationActivityContainer from '../components/transportationActivityContainer.jsx';
import { FiLoader } from "react-icons/fi";
import { useUserStore } from '../store/user.js';
import toast, { Toaster } from 'react-hot-toast';
function ViewTransportationActivity() {
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


// getTransportationActivities();
const handlePress = async () => {
    
    await getTransportationActivities({ ...filter}, sort);
     console.log(filter);
     setFilter({});
     
    };

if (!transportationActivities) {
    return <FiLoader size={50} className="animate-spin mx-auto mt-[49vh]" />;
}
const handelDeleteTransActivity = async(id) =>{
    if(user.type !== "advertiser" &&  user.type !== "admin"){
      return toast.error("you are not alloewd to delete an activity" , { className: 'text-white bg-gray-800' });
    }
    const { success, message } = await deleteTransportationActivity(id);
    success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
  } 
  return (
    <div className='text-black'>
      
      

      <div className={` grid w-fit mx-auto`} >
        <div>
      <div className='mb-4 text-xl'>
            Available Transportation Activities  <br/> 
            <input className='w-[15ch] m-2 pl-1'value={filter.pickUpLocation || ""} name={"pickUpLocation"} placeholder='pick up location' onChange={(e) => setFilter({ ...filter, pickUpLocation: e.target.value})}/>
            <input className='w-[15ch] m-2 pl-1 'value={filter.dropOfLocation || ""} name={'dropOfLocation'} placeholder='drop of location' onChange={(e) => setFilter({ ...filter, dropOfLocation: e.target.value})}/>
            <button className='p-2 bg-black text-white' onClick={() => (handlePress())}>search</button>
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
export default ViewTransportationActivity;