import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useComplaintStore } from "../store/complaint";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import egypt from "../images/egypt.jpg";

function FileComplaint() {
  const [complaint, setComplaint] = useState({
    title: "",
    body: "",
  });

  const { createComplaint } = useComplaintStore();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.type !== "tourist") {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const newComplaint = { ...complaint, creator: user.userName };
    const { success, message } = await createComplaint(newComplaint);

    success
      ? toast.success(message, { className: "text-white bg-gray-800" })
      : toast.error(message, { className: "text-white bg-gray-800" });
    if (success) {
      setComplaint({ title: "", body: "" });
    }
  };

  const containerStyle = {
    backgroundImage: `url(${egypt})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  };

  return (
    <div style={containerStyle} className="min-h-screen relative">
       />
      <div className="absolute inset-0 bg-black bg-opacity-60" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-2xl mx-auto mb-6">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white bg-opacity-90 p-8 rounded-lg shadow-lg backdrop-blur-md"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-6 text-center text-[#dc5809]"
          >
            File a Complaint
          </motion.h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Complaint Title
              </label>
              <input
                type="text"
                id="title"
                value={complaint.title}
                onChange={(e) =>
                  setComplaint({ ...complaint, title: e.target.value })
                }
                required
                placeholder="Enter the title of your complaint"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#dc5809] focus:border-[#dc5809]"
              />
            </div>
            <div>
              <label
                htmlFor="body"
                className="block text-sm font-medium text-gray-700"
              >
                Complaint Body
              </label>
              <textarea
                id="body"
                value={complaint.body}
                onChange={(e) =>
                  setComplaint({ ...complaint, body: e.target.value })
                }
                required
                placeholder="Describe your issue in detail"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#dc5809] focus:border-[#dc5809] resize-none"
                rows="6"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#dc5809] hover:bg-[#b94a08] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dc5809]"
            >
              Submit Complaint
            </button>
          </form>
        </motion.div>
      </div>

      <footer className="relative z-10 bg-black bg-opacity-80 text-white text-center py-4 mt-8 w-full">
        <p>© {new Date().getFullYear()} All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default FileComplaint;
