import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { Link } from 'react-router-dom';
import Dialog, { dialog } from '../components/Dialog.jsx';
import { formdialog } from '../components/FormDialog.jsx';
import ItineraryContainer from '../components/ItineraryContainer.jsx';
import { useItineraryStore } from '../store/itinerary.js';
import { useUserStore } from '../store/user.js';

function ItineraryPage(itinerary ,itineraryChanger) {
  const {user} = useUserStore();
  const {itineraries, addItineraries, getItineraries,deleteItinerary} = useItineraryStore();  
  useEffect(() => {
    console.log(user.userName)
    getItineraries({creator:user.userName}); 
  }, [])
  const [curItinerary, setCurItinerary] = useState({});
  const changeItinerary = (id) => (
    setCurItinerary(id)
  )

  const { showDialog } = dialog()
  const { showFormDialog } = formdialog()



  const handleClick = () => {
    showDialog()
    itineraryChanger(itinerary)
  }

  const handleUpdateClick = () => {
    showFormDialog()
    itineraryChanger(itinerary)
  }

  const del = async () => {
    const {success, message} = await deleteItinerary(curItinerary._id)
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
    </div>
  )
}

export default ItineraryPage