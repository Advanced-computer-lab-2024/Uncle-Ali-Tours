// AdminActivityPage.js

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdFlag } from "react-icons/md";
import Dialog, { dialog } from '../components/Dialog.jsx';
import ActivityContainer from '../components/ActivityContainer.jsx';
import { useActivityStore } from '../store/activity.js';
import { useUserStore } from '../store/user.js';

function AdminActivityPage() {
  const { user } = useUserStore(); // Fetching user details (Only admin should have access)
  const { activities, getAllActivities, updateActivityAppropriateness } = useActivityStore();

  const [curActivity, setCurActivity] = useState({}); // Holds the current activity for flagging

  // Dialog functions
  const { showDialog } = dialog();

  useEffect(() => {
    // Fetch all activities for the admin
    const fetchActivities = async () => {
      if (user && user.role === 'admin') {
        const response = await getAllActivities(); // Call getAllActivities for admin
        if (!response.success) {
          toast.error('Failed to load activities', { className: "text-white bg-gray-800" });
        }
      } else {
        toast.error('You do not have permission to view this page', { className: "text-white bg-gray-800" });
      }
    };

    fetchActivities();
  }, [user.role, getAllActivities]);

  // Flag activity as appropriate/inappropriate
  const flagActivity = async () => {
    const newStatus = !curActivity.isAppropriate;
    const { success, message } = await updateActivityAppropriateness(curActivity._id, newStatus);
    if (success) {
      toast.success(message, { className: "text-white bg-gray-800" });
      // Update the `isAppropriate` status in the local state
      setCurActivity((prev) => ({ ...prev, isAppropriate: newStatus }));
    } else {
      toast.error(message, { className: "text-white bg-gray-800" });
    }
  };

  // Set the selected activity and open the dialog
  const changeActivity = (activity) => {
    setCurActivity(activity);
    showDialog(); // Show confirmation dialog for toggling status
  };

  return (
    <div>
      <div className='mb-4 text-xl'>Available Activities</div>

      {/* Render activities */}
      {activities.length > 0 ? (
        activities.map((activity, index) => (
          <div key={index} className="mb-4 p-4 border-b border-gray-300">
            <ActivityContainer activity={activity} />

            {/* Display the appropriateness status */}
            <div className="mt-2 text-sm font-medium">
              Status: {activity.isAppropriate ? "Appropriate" : "Inappropriate"}
            </div>

            {/* Toggle button for changing appropriateness */}
            <button
              onClick={() => changeActivity(activity)}
              className='mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700'
            >
              Toggle Status
            </button>
          </div>
        ))
      ) : (
        <div>No activities available.</div> // Fallback message if activities array is empty
      )}

      {/* Confirmation Dialog for Flagging */}
      <Dialog
        msg={`Are you sure you want to mark this activity as ${curActivity.isAppropriate ? "inappropriate" : "appropriate"}?`}
        accept={flagActivity}
        reject={() => console.log("Flagging canceled")}
        acceptButtonText='Confirm'
        rejectButtonText='Cancel'
      />
    </div>
  );
}

export default AdminActivityPage;
