import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { Link } from 'react-router-dom';
import Dialog, { dialog } from '../components/Dialog.jsx';
import { formdialog } from '../components/FormDialog.jsx';
import ItineraryContainer from '../components/ItineraryContainer.jsx';
import { useItineraryStore } from '../store/itinerary.js';
import { useUserStore } from '../store/user.js';
import AdjustableDialog, { adjustableDialog } from '../components/AdjustableDialog.jsx';
import { IoClose } from 'react-icons/io5';

function ItineraryPage(itinerary, itineraryChanger) {
  const { user } = useUserStore();
  const { itineraries, getItineraries, deleteItinerary, activateItinerary, deactivateItinerary } = useItineraryStore();
  
  const [curItinerary, setCurItinerary] = useState({});
  useEffect(() => {
    getItineraries({ creator: user.userName });
  }, [getItineraries, user.userName]);

  const changeItinerary = (it) => {
    setCurItinerary(it);
  };

  const { showDialog } = dialog();
  const { showFormDialog } = formdialog();
  const { showAdjustableDialog } = adjustableDialog();

  const handleUpdateClick = () => {
    showFormDialog();
    itineraryChanger(curItinerary);
  };

  const handleDeleteClick = () => {
    showDialog();
    itineraryChanger(curItinerary);
  };

  const handleActivateClick = (it) => {
    changeItinerary(it); // Pass the selected itinerary
    showAdjustableDialog(); // Open the dialog
  };

  const del = async () => {
    const { success, message } = await deleteItinerary(curItinerary._id);
    success ? toast.success(message) : toast.error(message);
  };

  const activate = async () => {
    const { success, message } = await activateItinerary(curItinerary._id);
    success ? toast.success(message) : toast.error(message);
  };

  const deactivate = async () => {
    const { success, message } = await deactivateItinerary(curItinerary._id);
    success ? toast.success(message) : toast.error(message);
  };

  return (
    <div>
      <Link to='/createItinerary'>
        <button className='px-5 py-2 bg-green-700 text-white cursor-pointer border-none m-6 p-2 rounded transform transition-transform duration-300 hover:scale-105'>
          Create New Itinerary
        </button>
      </Link>
      <div className='mb-4 text-xl'>
        Available Itineraries
      </div>
      {itineraries.map((it, index) => (
        <div key={index} className="mb-4 p-4 border-b border-gray-300">
          <ItineraryContainer itinerary={it} itineraryChanger={changeItinerary} />
          
          {/* Display message if itinerary is flagged as inappropriate */}
          {!it.isAppropriate && (
            <div className="text-red-500 font-medium mt-2">
              Itinerary flagged as inappropriate, please update it.
            </div>
          )}
          
        </div>
      ))}

      {/* Confirmation Dialog for Delete */}
      <Dialog
        msg={"Are you sure you want to delete this itinerary?"}
        accept={del}
        reject={() => console.log("Deletion canceled")}
        acceptButtonText='Delete'
        rejectButtonText='Cancel'
      />

      {/* Adjustable Dialog for Activation/Deactivation */}
      <AdjustableDialog
        state={curItinerary.isActivated}
        msg1="Are you sure that you want to activate this itinerary?"
        msg2="Are you sure that you want to deactivate this itinerary?"
        accept1={activate}
        accept2={deactivate}
        reject1={() => console.log("Activation canceled")}
        reject2={() => console.log("Deactivation canceled")}
        acceptButtonText="Yes"
        rejectButtonText="Cancel"
      />
    </div>
  );
}

export default ItineraryPage;
