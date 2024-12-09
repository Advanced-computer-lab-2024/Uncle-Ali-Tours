import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { Link } from 'react-router-dom';
import Dialog, { dialog } from '../components/Dialog.jsx';
import { formdialog } from '../components/FormDialog.jsx';
import ActivityContainer from '../components/ActivityContainer.jsx';
import { useActivityStore } from '../store/activity.js';
import { useUserStore } from '../store/user.js';
import { motion } from 'framer-motion';

function ActivityPage() {
  const { user } = useUserStore(); // Fetching user details
  const { activities, getActivities, deleteActivity } = useActivityStore(); // Importing activity store methods

  const [curActivity, setCurActivity] = useState({}); // Holds the current activity for delete/update

  const changeActivity = (id) => setCurActivity(id); // Function to change current activity

  // Dialog functions
  const { showDialog } = dialog();
  const { showFormDialog } = formdialog();

  useEffect(() => {
    // Fetch activities when the component mounts or when user changes
    const fetchActivities = async () => {
      if (user && user.userName) {
        const response = await getActivities({ creator: user.userName });
        console.log(response);  // Add logging here to debug
        if (!response.success) {
          toast.error('Failed to load activities', { className: "text-white bg-gray-800" });
        }
      }
    };

    fetchActivities();
  }, [user.userName, getActivities]); // Dependency on user.userName and getActivities to refetch when needed

  // Handle update action
  const handleUpdateClick = () => {
    showFormDialog();
    changeActivity(curActivity); // Pass the current activity for update
  };

  // Delete activity
  const del = async () => {
    const { success, message } = await deleteActivity(curActivity._id);
    success
      ? toast.success(message, { className: "text-white bg-gray-800" })
      : toast.error(message, { className: "text-white bg-gray-800" });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(../images/egypt.jpg)' }}>
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-3xl z-10"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Manage Activities</h2>

        <Link to='/createActivity'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='w-full py-3 mb-6 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors'
          >
            Create New Activity
          </motion.button>
        </Link>

        <div className='text-xl font-semibold text-gray-700 mb-4'>Available Activities</div>

        {/* Render activities */}
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((act, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md">
                <ActivityContainer activityChanger={changeActivity} activity={act} />
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setCurActivity(act);
                      showDialog();
                    }}
                    className="text-red-600"
                  >
                    <MdDelete size='24' />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUpdateClick}
                    className="text-blue-600"
                  >
                    <MdOutlineDriveFileRenameOutline size='24' />
                  </motion.button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-700">No activities available.</p> // Fallback message if no activities exist
          )}
        </div>

        {/* Dialog for confirming activity deletion */}
        <Dialog
          msg={"Are you sure you want to delete this activity?"}
          accept={del}
          reject={() => console.log("Deletion canceled")}
          acceptButtonText='Delete'
          rejectButtonText='Cancel'
        />
      </motion.div>

      <footer className="absolute bottom-0 left-0 w-full bg-black text-white text-center py-2 text-sm">
        <p>© {new Date().getFullYear()} U A T. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default ActivityPage;
