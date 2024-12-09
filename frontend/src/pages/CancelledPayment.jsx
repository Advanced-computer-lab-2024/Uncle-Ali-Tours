import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';

function CancelledPayment() {
  const { type } = useParams();

  const handleClick = () => {
    toast.success("Redirecting to your profile...");
    setTimeout(() => {
      window.location.href = "/touristProfile";
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white p-8 rounded-lg shadow-md max-w-md w-full"
      >
        <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
        <p className="text-lg text-gray-700 mb-4">Your payment has been cancelled.</p>
        <p className="text-gray-500 mb-6">Order Type: <span className="font-medium text-blue-600">{type}</span></p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          className="bg-red-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 hover:bg-red-600"
        >
          Back to Profile
        </motion.button>
      </motion.div>
    </div>
  );
}

export default CancelledPayment;
