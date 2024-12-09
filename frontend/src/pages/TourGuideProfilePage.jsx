import React, { useEffect, useState } from "react";
import { useUserStore } from '../store/user';
import { useGuideStore } from '../store/tourGuide';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FaEdit } from 'react-icons/fa';
import { Modal } from 'react-bootstrap';
import UnVerified  from "../components/UnVerified";

import axios from 'axios';
import { useRequestStore } from '../store/requests';
import { IoSaveOutline } from 'react-icons/io5';
import egypt from '../images/egypt.jpg';
import {
  Bar, Pie
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const TourGuideProfilePage = () => {
  const { user } = useUserStore();
  const { guide, getGuide, updateGuide } = useGuideStore();
  const [isEditing, setIsEditing] = useState(false);
  const [previewFile, setPreviewFile] = useState(localStorage.getItem("ProfilePicture") || "");
  const [updatedGuide, setUpdatedGuide] = useState({});
  const [report, setReport] = useState({
    totalTourists: 0,
    activities: [],
    itineraries: [],
  });
  const [selectedMonth, setSelectedMonth] = useState(""); // State to store selected month
  const [filteredItineraries, setFilteredItineraries] = useState([]); // State for filtered itineraries
  const [totalTouristsForMonth, setTotalTouristsForMonth] = useState(0); // State to track tourists count for the selected month
  const [showBarChart, setShowBarChart] = useState(true); // Show Bar Chart by default
  const [showPieChart, setShowPieChart] = useState(false);
  const { createRequest } = useRequestStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.type !== 'tour guide') {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    const fetchGuideData = async () => {
      if (user.userName) {
        const result = await getGuide({ userName: user.userName });
        if (result.success && guide.profilePicture) {
          setPreviewFile(guide.profilePicture);
          localStorage.setItem("ProfilePicture", guide.profilePicture);
        }
      }
    };
    fetchGuideData();
  }, [user.userName, guide.profilePicture]);

  const fetchReport = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/tourGuide/report/${user.userName}`);
      if (!response.ok) {
        throw new Error("Failed to fetch report");
      }
      const data = await response.json(); // Parse the JSON data
      console.log("Fetched Report:", data); // Debug log
      setReport(data); // Update report state
    } catch (error) {
      console.error("Error fetching report:", error);
      toast.error("Failed to fetch report.", { className: "text-white bg-gray-800" });
    }
  };

  useEffect(() => {
    if (user.userName) {
      fetchReport(); // Fetch data when username is available
    }
  }, [user.userName]);

  const handleMonthChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedMonth(selectedDate);

    const filtered = report.itineraries.filter((itinerary) => {
      const itineraryMonth = formatMonth(itinerary.availableDates[0]); // Format the itinerary date to YYYY-MM
      return itineraryMonth === selectedDate;
    });
    setFilteredItineraries(filtered);

    const totalTourists = filtered.reduce((acc, itinerary) => acc + itinerary.numberOfTourists, 0);
    setTotalTouristsForMonth(totalTourists);
  };

  const formatMonth = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${(d.getMonth() + 1).toString().padStart(2, "0")}`;
  };

  const chartData = {
    labels: (filteredItineraries.length > 0 ? filteredItineraries : report.itineraries).map(
      (itinerary) => itinerary.title
    ),
    datasets: [
      {
        label: "Tourists",
        data: (filteredItineraries.length > 0 ? filteredItineraries : report.itineraries).map(
          (itinerary) => itinerary.numberOfTourists
        ),
        backgroundColor: ["#4caf50", "#2196f3", "#ff9800", "#f44336", "#9c27b0"],
        borderColor: ["#4caf50", "#2196f3", "#ff9800", "#f44336", "#9c27b0"],
        borderWidth: 1,
      },
    ],
  };

  const handleSaveClick = async () => {
    const { success, message } = await updateGuide(user.userName, updatedGuide);
    success ? toast.success(message, { className: "text-white bg-gray-800" }) : toast.error(message, { className: "text-white bg-gray-800" });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      localStorage.removeItem("ProfilePicture");
      setPreviewFile(URL.createObjectURL(file));
    }
  };
  const isVerified = guide?.verified;
  const handleDeleteAccountRequest = async () => {
    const deleteRequest = {
      userName: user.userName,
      userType: user.type,
      userID: user._id,
      type: 'delete',
    };
    const { success, message } = await createRequest(deleteRequest);
    if (success) {
      toast.success('Account deletion request submitted successfully.');
      setIsDeleteVisible(false);
    } else {
      toast.error(message);
    }
  };

  if (!isVerified) {
    return <UnVerified />;
  }
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <img src={egypt} className="fixed top-0 left-0 w-full h-full object-cover opacity-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 sm:p-10">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">Profile Page</h1>
              <div className="relative">
                <img
                  src={`http://localhost:3000${previewFile}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white"
                />
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer"
                >
                  <FaEdit className="text-orange-500" />
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
                {['userName', 'email', 'mobileNumber', 'yearsOfExperience', 'previousWork', 'nationality', 'dateOfBirth'].map((field) => (
                  <div key={field} className="flex items-center justify-between">
                    <span className="text-gray-600 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <input
                      type="text"
                      name={field}
                      defaultValue={guide[field] || ''}
                      className={`bg-transparent transition-colors focus:outline-none border-b border-gray-300 px-2 py-1 w-2/3 text-right`}
                      readOnly={!isEditing}
                      onChange={(e) => setUpdatedGuide({ ...updatedGuide, [field]: e.target.value })}
                    />
                  </div>
                ))}
                {!isEditing ? (
                  <button className="text-orange-500 hover:text-orange-600 transition-colors" onClick={() => setIsEditing(true)}>
                    <FaEdit size={20} />
                  </button>
                ) : (
                  <button className="text-green-500 hover:text-green-600 transition-colors" onClick={handleSaveClick}>
                    <IoSaveOutline size={20} />
                  </button>
                )}
              </div>

              {/* Tourist Report Section - White Background */}
              <div className="bg-white md:col-span-1 bg-white p-4 border border-gray-600 shadow-md rounded">
                {/* Render the charts */}
                <div className="bg-white shadow-md rounded-lg p-4">
                  <div className="flex justify-between mb-4">
                    <button
                      onClick={() => {
                        setShowBarChart(true);
                        setShowPieChart(false);
                      }}
                      className={`px-4 py-2 rounded-md ${
                        showBarChart ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      Bar Chart
                    </button>
                    <button
                      onClick={() => {
                        setShowPieChart(true);
                        setShowBarChart(false);
                      }}
                      className={`px-4 py-2 rounded-md ${
                        showPieChart ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      Pie Chart
                    </button>
                  </div>
                  {showBarChart && <Bar data={chartData} />}
                  {showPieChart && <Pie data={chartData} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={isEditing} onHide={() => setIsEditing(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="file"
            onChange={handleFileChange}
            className="mb-4 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-violet-50 file:text-violet-700
                      hover:file:bg-violet-100"
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
          >
            Save Changes
          </button>
        </Modal.Footer>
      </Modal>
      <div className="mt-10 border-t pt-6">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
              onClick={handleDeleteAccountRequest}
            >
              Delete Account
            </button>
          </div>
    </div>
  );
};

export default TourGuideProfilePage;
