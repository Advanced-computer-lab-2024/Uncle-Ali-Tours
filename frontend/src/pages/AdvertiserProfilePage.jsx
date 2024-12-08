import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaCheck, FaEye } from 'react-icons/fa';
import { IoSaveOutline } from 'react-icons/io5';
import { toast, Toaster } from 'react-hot-toast';
import { useUserStore } from '../store/user';
import { useAdvertiserstore } from '../store/advertiser';
import { useTagStore } from '../store/tag';
import { useRequestStore } from '../store/requests';
import { useActivityStore } from "../store/activity";
import egypt from '../images/egypt.jpg';
import BronzeBadge from '../images/bronze.png';
import SilverBadge from '../images/silver.png';
import GoldBadge from '../images/gold.png';
import Dialog, { dialog } from '../components/Dialog.jsx';
import { Modal } from 'react-bootstrap';
import AvatarEditor from 'react-avatar-editor';
import axios from 'axios';
import { FiLoader } from 'react-icons/fi';

const AdvertiserProfile = () => {
  const { user } = useUserStore();
  const { advertiser, getAdvertiser, updateAdvertiser, uploadProfilePicture } = useAdvertiserstore();
  const { tags, getTags } = useTagStore();
  const { createRequest } = useRequestStore();
  const { getActivities, activities } = useActivityStore();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedAdvertiser, setUpdatedAdvertiser] = useState({});
  const [preferences, setPreferences] = useState([]);
  const [badge, setBadge] = useState('');
  const [filter, setFilter] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [previewFile, setPreviewFile] = useState(localStorage.getItem("profilePicture") || "");
  const [showPreview, setShowPreview] = useState(false);
  const [scale, setScale] = useState(1.2);
  const [rotate, setRotate] = useState(0);
  const editorRef = useRef(null);
  const [idFile, setIdFile] = useState(null);
  const [taxationCardFile, setTaxationCardFile] = useState(null);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [report, setReport] = useState({
    totalTourists: 0,
    activities: [],
    itineraries: []
  });
  const [salesReport, setSalesReport] = useState([]);
  const [filteredReport, setFilteredReport] = useState([]);
  const [filters, setFilters] = useState({ product: "", dateRange: { start: "", end: "" }, month: "" });
  const { showDialog } = dialog();
  const navigate = useNavigate();


  useEffect(() => {
    if (user && user.userName) {
      getAdvertiser({ userName: user.userName }, {});
      getTags();
      fetchBadge();
      fetchReport();
      fetchSalesReport();
    }
  }, [user.userName]);

  useEffect(() => {
    if (advertiser && advertiser.myPreferences) {
      setPreferences(advertiser.myPreferences);
    }
  }, [advertiser]);

  const fetchBadge = async () => {
    // Implement badge fetching logic for advertisers
    setBadge('level 1'); // Placeholder
  };


  const fetchReport = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/advertiser/report/${user.userName}`);
      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }
      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Failed to fetch report.', { className: 'text-white bg-gray-800' });
    }
  };

  const fetchSalesReport = async () => {
    await getActivities({ ...filter, creator: user.userName });
    const activitiesSales = activities.map((activity) => ({
      name: activity.name,
      revenue: (activity.numberOfBookings || 0) * activity.price,
      dates: activity.date || "2024-11-01",
    }));
    setSalesReport(activitiesSales);
    setFilteredReport(activitiesSales);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);
    if (Object.keys(updatedAdvertiser).length) {
      const { success, message } = await updateAdvertiser(user.userName, updatedAdvertiser);
      success
        ? toast.success(message, { className: "text-white bg-gray-800" })
        : toast.error(message, { className: "text-white bg-gray-800" });
    }
  };

  const handlePreferenceToggle = async (tagName) => {
    const updatedPreferences = preferences.includes(tagName)
      ? preferences.filter((pref) => pref !== tagName)
      : [...preferences, tagName];

    setPreferences(updatedPreferences);
    const { success, message } = await updateAdvertiser(user.userName, { myPreferences: updatedPreferences });
    success
      ? toast.success('Preferences updated successfully!', { className: 'text-white bg-gray-800' })
      : toast.error(message, { className: 'text-white bg-gray-800' });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(file);
      localStorage.removeItem("profilePicture");
    } else {
      console.error("No file selected");
    }
  };

  const handleSave = async () => {
    if (editorRef.current && profilePic) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const dataUrl = canvas.toDataURL();
      const blob = await fetch(dataUrl).then((res) => res.blob());
      const formData = new FormData();
      formData.append("profilePicture", blob, "profile-photo.png");
      formData.append("userName", user.userName);

      try {
        const response = await axios.put(`http://localhost:3000/api/advertiser/uploadPicture`, formData);
        if (response.data.success) {
          const profileImagePath = response.data.profilePicture;
          setPreviewFile(profileImagePath);
          localStorage.setItem("advertiserProfilePicture", profileImagePath);
          setIsEditing(false);
          setProfilePic(null);
          toast.success(response.data.message, { className: "text-white bg-gray-800" });
          await getAdvertiser({ userName: user.userName });
        } else {
          toast.error(response.data.message || "Upload failed", { className: "text-white bg-gray-800" });
        }
      } catch (error) {
        console.error("Error uploading profile photo:", error);
        toast.error("Error uploading profile photo", { className: "text-white bg-gray-800" });
      }
    } else {
      console.error("No file selected for upload");
      toast.error("No file selected for upload", { className: "text-white bg-gray-800" });
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteVisible(!isDeleteVisible);
  };

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

  const handleFileUpload = async () => {
    if (!idFile || !taxationCardFile) {
      toast.error("Please upload both ID and Taxation Registry Card.");
      return;
    }

    const formData = new FormData();
    formData.append("idFile", idFile);
    formData.append("taxationCardFile", taxationCardFile);
    formData.append("username", user.userName);

    try {
      const response = await fetch('/api/upload-documents', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      
      if (result.success) {
        toast.success("Documents uploaded successfully.");
      } else {
        toast.error(result.message || "Failed to upload documents.");
      }
    } catch (error) {
      toast.error("An error occurred during the upload.");
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    let filtered = salesReport;

    if (filters.dateRange.start && filters.dateRange.end) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.dates);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    if (filters.month) {
      filtered = filtered.filter((item) => new Date(item.dates).getMonth() + 1 === parseInt(filters.month));
    }

    setFilteredReport(filtered);
  };

  const handleWithdrawClick = () => {
    showDialog();
  };



  if (!advertiser.userName) return <FiLoader size={50} className="animate-spin mx-auto mt-[49vh]" />;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <img src={egypt} className="fixed top-0 left-0 w-full h-full object-cover opacity-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 sm:p-10">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">Advertiser Profile</h1>
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
                <h2 className="text-2xl font-semibold text-gray-900">Company Information</h2>
                {['userName', 'email', 'companyName', 'website', 'hotline', 'industry', 'address'].map((field) => (
                  <div key={field} className="flex items-center justify-between">
                    <span className="text-gray-600 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <input
                      type="text"
                      name={field}
                      defaultValue={advertiser[field] || ''}
                      className={`${isEditing ? 'bg-gray-100' : 'bg-transparent'} transition-colors focus:outline-none border-b border-gray-300 px-2 py-1 w-2/3 text-right`}
                      readOnly={!isEditing}
                      onChange={(e) => setUpdatedAdvertiser({ ...updatedAdvertiser, [field]: e.target.value })}
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
              <div className="space-y-6">
                
              </div>
            </div>
            
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
              </div>
              
            </div>

            <div className="mt-10 border-t pt-6">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
                onClick={handleDeleteClick}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showPreview} onHide={() => setShowPreview(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Profile Picture Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={previewFile}
            alt="Profile Preview"
            className="img-fluid"
            style={{ maxWidth: "100%", borderRadius: "50%" }}
          />
        </Modal.Body>
      </Modal>

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
            onClick={handleSave}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
          >
            Save Changes
          </button>
        </Modal.Footer>
      </Modal>

      {isDeleteVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Confirm Account Deletion</h2>
            <p className="mb-4">Are you sure you want to request to delete your account? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteVisible(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccountRequest}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}
        {profilePic && (
  <div className="fixed top-0 right-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={() => setProfilePic(null)}
      >
        <IoClose size={24} />
      </button>
      <AvatarEditor
        ref={editorRef}
        image={profilePic}
        width={250}
        height={250}
        border={50}
        borderRadius={125}
        color={[255, 255, 255, 0.6]}
        scale={scale}
        rotate={rotate}
      />
      <div className="mt-4 flex items-center justify-between">
        <input
          type="range"
          min="1"
          max="2"
          step="0.01"
          value={scale}
          onChange={(e) => setScale(parseFloat(e.target.value))}
          className="w-1/2"
        />
        <button
          className="bg-gray-200 text-gray-700 p-2 rounded-full"
          onClick={() => setRotate((prev) => prev + 90)}
        >
          <FaArrowRotateRight />
        </button>
      </div>
      <button
        className="mt-4 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors"
        onClick={handleSaveProfilePicture}
      >
        Save Profile Picture
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default AdvertiserProfile;

