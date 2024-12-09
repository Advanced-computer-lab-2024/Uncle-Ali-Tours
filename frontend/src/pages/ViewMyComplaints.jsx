import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaExclamationCircle, FaArrowLeft } from 'react-icons/fa';
import ComplaintContainer from '../components/ComplaintContainer';
import toast, { Toaster } from 'react-hot-toast';
import egypt from '../images/egypt.jpg';
import { useNavigate } from 'react-router-dom';

function ViewMyComplaints() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/api/complaint/by-creator/${user.userName}`);
        const data = await response.json();
        if (data.success) {
          setComplaints(data.data);
        } else {
          toast.error('No complaints found.', {
            className: "text-white bg-gray-800"
          });
        }
      } catch (error) {
        console.error('Error fetching complaints:', error);
        toast.error('Failed to fetch complaints.', {
          className: "text-white bg-gray-800"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, [user.userName]);

  const containerStyle = {
    backgroundImage: `url(${egypt})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  return (
    <div style={containerStyle} className="min-h-screen relative">
       />
      <div className="absolute inset-0 bg-black bg-opacity-60" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-4xl mx-auto mb-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="text-white hover:text-[#dc5809] flex items-center transition-colors duration-200"
          >
            <FaArrowLeft className="w-5 h-5 mr-2" />
            Back
          </motion.button>
        </div>

        <div className="w-full max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-8 text-white text-center"
          >
            My Complaints
          </motion.h1>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#dc5809]" />
            </div>
          ) : complaints.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 w-full"
            >
              {complaints.map((complaint, index) => (
                <motion.div
                  key={complaint._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ComplaintContainer complaint={complaint} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg backdrop-blur-md text-center w-full"
            >
              <FaExclamationCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">You have no complaints</p>
            </motion.div>
          )}
        </div>
      </div>
      
      <footer className="relative z-10 bg-black bg-opacity-80 text-white text-center py-4 mt-8 w-full">
        <p>© {new Date().getFullYear()} All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default ViewMyComplaints;

