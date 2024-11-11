import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { Link } from 'react-router-dom';
import Dialog, { dialog } from '../components/Dialog.jsx';
import { formdialog } from '../components/FormDialog.jsx';
import ActivityContainer from '../components/ActivityContainer.jsx';
import { useActivityStore } from '../store/activity.js';
import { useUserStore } from '../store/user.js';

function ActivityPage(activity, activityChanger) {
  const { user } = useUserStore(); // Fetching user details
  const { activities, getActivities, deleteActivity } = useActivityStore(); // Importing activity store methods

  getActivities({ creator: user.userName });

  

  const [curActivity, setCurActivity] = useState({}); // Holds the current activity for delete/update

  const changeActivity = (id) => setCurActivity(id); // Function to change current activity

  // Dialog functions
  const { showDialog } = dialog();
  const { showFormDialog } = formdialog();

  

  // Handle update action
  const handleUpdateClick = () => {
    showFormDialog();
    activityChanger(activity);
  };

  // Delete activity
  const del = async () => {
    const { success, message } = await deleteActivity(curActivity._id);
    success
      ? toast.success(message, { className: "text-white bg-gray-800" })
      : toast.error(message, { className: "text-white bg-gray-800" });
  };

  return (
    <div>
      <Link to='/createActivity'>
        <button className='px-5 py-2 bg-green-700 text-white cursor-pointer border-none m-6 p-2 rounded transform transition-transform duration-300 hover:scale-105'>
          Create New Activity
        </button>
      </Link>

      <div className='mb-4 text-xl'>Available Activities</div>

      {/* Render activities */}
      {activities.map((act, index) => (
        <ActivityContainer key={index} activityChanger={changeActivity} activity={act} />
      ))}


      <Dialog
        msg={"Are you sure you want to delete this activity?"}
        accept={del}
        reject={() => console.log("Deletion canceled")}
        acceptButtonText='Delete'
        rejectButtonText='Cancel'
      />
      <button onClick={() => (handleUpdateClick())} className='mr-4 transform transition-transform duration-300 hover:scale-125' ><MdOutlineDriveFileRenameOutline size='18' color='black' /></button>


      
     
    </div>
  );
}

export default ActivityPage;
