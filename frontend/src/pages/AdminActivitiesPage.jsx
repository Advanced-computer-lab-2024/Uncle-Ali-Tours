import React, { useEffect, useState } from 'react';
import { useActivityStore } from '../store/activity';
import toast, { Toaster } from 'react-hot-toast';
import ActivityContainer from '../components/ActivityContainer';
import Dialog from '../components/Dialog';
import { motion } from 'framer-motion';
import { MdFlag, MdCheckCircle, MdError } from 'react-icons/md';
import { FaTasks } from 'react-icons/fa';

function AdminActivityPage() {
  const { activities, getActivities, flagActivity } = useActivityStore();
  const [curActivity, setCurActivity] = useState(null);
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      await getActivities();
      setLoading(false);
    };

    fetchActivities();
  }, [getActivities]);

  const handleFlagClick = (activity) => {
    setCurActivity(activity);
    setShowFlagDialog(true);
  };

  // Toggle flag status
  const toggleAppropriateness = async (activity) => {
    if (activity) {
      const link = `${window.location.origin}/activityDetail/${activity._id}`;
      const updatedActivity = { ...activity, isAppropriate: !activity.isAppropriate };
      const { success, message } = await flagActivity(updatedActivity._id, updatedActivity.isAppropriate, updatedActivity.creator, link);

      if (success) {
        toast.success(
          updatedActivity.isAppropriate ? 'Activity marked as appropriate.' : 'Activity flagged as inappropriate.',
          { className: 'text-white bg-gray-800' }
        );
        getActivities();
      } else {
        toast.error('Failed to update activity status.', { className: 'text-white bg-gray-800' });
      }
    }
    setShowFlagDialog(false);
  };

  return (
<div className="relative min-h-screen flex flex-col items-center justify-center bg-transparent from-gray-900 to-gray-800">
<div className="absolute inset-0 bg-black opacity-50"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-2xl w-full max-w-5xl z-10 my-10"
      >
        <div className="flex items-center justify-center mb-10">
          <FaTasks className="text-orange-500 text-5xl mr-3" />
          <h2 className="text-4xl font-bold text-gray-800">Admin - Manage Activities</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 border-t-4 border-orange-500 border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="w-full space-y-6">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-xl shadow-md transition-transform duration-300 flex flex-col md:flex-row md:justify-between items-center border-l-4 border-orange-500"
                >
                  <div className="flex items-center mb-4 md:mb-0">
                    {activity.isAppropriate ? (
                      <MdCheckCircle className="text-green-500 text-3xl mr-4" />
                    ) : (
                      <MdError className="text-red-500 text-3xl mr-4" />
                    )}
                    <div>
                      <ActivityContainer activity={activity} />
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-end">
                    <span className={`mb-4 font-medium ${activity.isAppropriate ? 'text-green-600' : 'text-red-600'}`}>
                      {activity.isAppropriate ? 'Appropriate' : 'Flagged as Inappropriate'}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleFlagClick(activity)}
                      className={`px-4 py-2 text-white rounded-lg shadow-md ${
                        activity.isAppropriate ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-500 hover:bg-red-600'
                      }`}
                    >
                      {activity.isAppropriate ? 'Mark as Inappropriate' : 'Mark as Appropriate'}
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-600 text-center text-lg">No activities available. Create one to get started!</p>
            )}
          </div>
        )}

        {showFlagDialog && (
          <Dialog
            msg="Are you sure you want to flag this activity as inappropriate?"
            accept={() => toggleAppropriateness(curActivity)}
            reject={() => setShowFlagDialog(false)}
            acceptButtonText="Flag"
            rejectButtonText="Cancel"
          />
        )}
      </motion.div>

      <footer className="absolute bottom-0 left-0 w-full bg-black text-white text-center py-3 text-sm">
        <p>© {new Date().getFullYear()} U A T. All rights reserved.</p>
      </footer>

       
    </div>
  );
}

export default AdminActivityPage;
