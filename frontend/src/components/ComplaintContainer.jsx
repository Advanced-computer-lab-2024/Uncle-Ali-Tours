import React from "react";
import { motion } from "framer-motion";
import { FaReply, FaTrash, FaClock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

function ComplaintContainer({ complaint }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'resolved':
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaExclamationCircle className="text-red-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full backdrop-blur-lg bg-white bg-opacity-90 mb-6 rounded-lg shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-3 text-[#dc5809]">{complaint.title}</h2>
        <p className="mb-3 text-gray-700">{complaint.body}</p>
        <div className="flex items-center mb-3">
          <span className="font-semibold text-gray-700 mr-2">Status:</span>
          <div className="flex items-center">
            {getStatusIcon(complaint.status)}
            <span className="ml-2 text-gray-600">{complaint.status}</span>
          </div>
        </div>
        {user.type === "tourist" && complaint.reply && (
          <div className="mb-3">
            <span className="font-semibold text-gray-700">Reply:</span>
            <p className="mt-1 text-gray-600 bg-gray-100 p-3 rounded">{complaint.reply}</p>
          </div>
        )}
        {user.type === "tourist" && !complaint.reply && (
          <p className="text-gray-500 italic">No reply yet</p>
        )}
        {user.type === "admin" && (
          <div className="flex justify-end items-center mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-[#dc5809] text-white rounded-md hover:bg-[#b94a08] transition-colors duration-200 mr-3"
            >
              <FaReply className="mr-2" />
              Reply
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
            >
              <FaTrash className="mr-2" />
              Delete
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ComplaintContainer;

