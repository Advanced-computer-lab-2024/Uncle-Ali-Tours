import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { Link } from 'react-router-dom';
import Dialog, { dialog } from '../components/Dialog.jsx';
import { formdialog } from '../components/FormDialog.jsx';
import ItineraryContainer from '../components/ItineraryContainer.jsx';
import { useItineraryStore } from '../store/itinerary.js';
import { useUserStore } from '../store/user.js';
import AdjustableDialog , {adjustableDialog} from '../components/AdjustableDialog.jsx';
import React from 'react';
import ItineraryContainer from '../containers/ItineraryContainer';
function ItineraryPage(itinerary ,itineraryChanger) {
  const {user} = useUserStore();
  const {itineraries, addItineraries, getItineraries,deleteItinerary,activateItinerary,deactivateItinerary} = useItineraryStore();  
  getItineraries({creator:user.userName});
  const [curItinerary, setCurItinerary] = useState({});
  const changeItinerary = (it) => {
    console.log(it);
    setCurItinerary(it)
  }

  const { showDialog } = dialog()
  const { showFormDialog } = formdialog()
  const {showAdjustableDialog} = adjustableDialog()


  const handleClick = () => {
    showDialog()
    itineraryChanger(itinerary)
  }

  const handleUpdateClick = () => {
    showFormDialog()
    itineraryChanger(itinerary)
  }
  const handleActivateClick = (it) => {
    itineraryChanger(it); // Pass the selected itinerary
    showAdjustableDialog(); // Open the dialog
  };
  const ItineraryPage = ({ itineraries }) => {
    return (
      <div>
        <h1>Available Itineraries</h1>
        {itineraries.map(itinerary => (
          <ItineraryContainer key={itinerary.id} itinerary={itinerary} />
        ))}
      </div>
    );
  };


  const del = async () => {
    const {success, message} = await deleteItinerary(curItinerary._id)
    success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
  }
  const activate = async () => {
    const {success, message} = await activateItinerary(curItinerary._id)
    success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
  }
  const deactivate = async () => {
    const {success, message} = await deactivateItinerary(curItinerary._id)
    success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
  }
//   const handleUpdate = async (updatedItinerary) => {
//     const {success, message} = await updatedItinerary(curItinerary._id, updatedItinerary)
//     success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
// }
  return (
    <div>
      <Link to='/createItinerary'>
      <button className='px-5 py-2 bg-green-700 text-white cursor-pointer border-none m-6 p-2 rounded transform transition-transform duration-300 hover:scale-105' >Create New Itinerary</button>
      </Link>
      <div className='mb-4 text-xl'>
            Available Itineraries
        </div>
        {
            itineraries.map((it, index)=> (
                <ItineraryContainer key={index} itineraryChanger={changeItinerary} itinerary={it}/>
            ))
        }
        <Dialog msg={"Are you sure you want to delete this itinerary?"} accept={del} reject={() => (console.log("rejected"))} acceptButtonText='Delete' rejectButtonText='Cancel'/>
   
        <button onClick={() => (handleUpdateClick())} className='mr-4 transform transition-transform duration-300 hover:scale-125' ><MdOutlineDriveFileRenameOutline size='18' color='black' /></button>
        <button onClick={() => (handleClick())} className='mr-2 transform transition-transform duration-300 hover:scale-125 '><MdDelete size='18' color='black' /></button>     
        <AdjustableDialog 
         state={curItinerary.isActivated} // Use `curItinerary.isActivated` directly
         msg1="Are you sure that you want to activate this itinerary?"
         msg2="Are you sure that you want to deactivate this itinerary?"
         accept1={activate}
         accept2={deactivate}
         reject1={() => console.log("Activation canceled")}
         reject2={() => console.log("Deactivation canceled")}
         acceptButtonText="Yes"
         rejectButtonText="Cancel"
        />
        <button onClick={() => (handleActivateClick())} className='px-1 py-0.5 bg-green-700 text-white cursor-pointer border-none m-1 p-0.5 rounded transform transition-transform duration-300 hover:scale-105'  > 
          {(itinerary.isActivated)? "deactivate" : "activate"} 
        </button>

    </div>
  )
  






}

export default ItineraryPage