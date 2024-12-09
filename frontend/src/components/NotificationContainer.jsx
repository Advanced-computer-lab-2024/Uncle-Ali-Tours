import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function NotificationContainer({ notification }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto bg-white w-full max-w-md p-6 rounded-xl shadow-lg mb-4 border border-orange-300"
    >
      <h1 className="text-lg font-bold text-orange-700">{notification.title}</h1>
      <p className="mt-2 text-sm text-gray-600">{notification.message}</p>
      {notification.link && (
        <Link to={notification.link}>
          <button className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-orange-600 transition-colors duration-300">
            View
          </button>
        </Link>
      )}
    </motion.div>
  );
}

export default NotificationContainer;
