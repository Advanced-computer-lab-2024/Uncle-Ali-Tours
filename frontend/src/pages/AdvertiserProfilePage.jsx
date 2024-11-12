import { useUserStore } from '../store/user';
import React, { useEffect, useState } from "react";
import { useAdvertiserstore } from '../store/advertiser.js';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useRequestStore } from '../store/requests.js';
import { Link } from 'react-router-dom';

const AdvertiserProfile = () => {
  const { user } = useUserStore(); 
  const { advertiser, getAdvertiser, updateAdvertiser } = useAdvertiserstore(); 

  const [isRequired, setIsRequired] = useState(true);
  const [updatedAdvertiser, setUpdatedAdvertiser] = useState({});
  const [idFile, setIdFile] = useState(null);  // File input for ID
  const [taxationCardFile, setTaxationCardFile] = useState(null);  // File input for Taxation Registry Card
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  
  const navigate = useNavigate();
  const { createRequest } = useRequestStore();

  useEffect(() => {
    async function fetchAdvertiser() {
      await getAdvertiser({ userName: user.userName }, {}); // Fetch data including profile picture
    }
    fetchAdvertiser();
  }, []);


  const handleButtonClick = () => {
    setIsRequired(false); 
  };

  const handleSaveClick = async () => {
    if (!isRequired) {
      const { success, message } = await updateAdvertiser(user.username, updatedAdvertiser);
      success 
        ? toast.success(message, { className: "text-white bg-gray-800" }) 
        : toast.error(message, { className: "text-white bg-gray-800" });
    }
  };

  const handleRedirect = () => {
    navigate('/activityPage');
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

    // Form submission logic for file upload
    const formData = new FormData();
    formData.append("idFile", idFile);
    formData.append("taxationCardFile", taxationCardFile);
    formData.append("username", user.username);

    try {
      const response = await fetch('/api/upload-documents', {  // Replace with your backend endpoint
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

  return (
    <div className="relative p-10 max-w-3xl mx-auto mt-5 rounded-lg shadow-lg bg-gray-800 text-white">
      <Toaster />

      <div className="flex items-center border-b border-gray-600 pb-5 mb-5">
        <div className="w-24 h-24 rounded-full bg-gray-900 mr-5"></div>
        <div>
          <h1 className="text-white text-2xl font-bold">
            {advertiser.userName || 'John Doe'}
          </h1>
          <h2 className="text-gray-400 text-xl">Advertiser</h2>
        </div>
      </div>

      <div className="relative p-10 max-w-3xl mx-auto mt-5 rounded-lg shadow-lg bg-gray-800 text-white">
        <h1 className="text-lg mb-4">Profile</h1>
        <div spacing={4} align="stretch">
          {/* Editable Profile Fields */}
          <label>
            Name:
            <input
              type="text"
              name="name"
              defaultValue={advertiser.userName || ''}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2"
              readOnly={isRequired}
              onChange={(e) => setUpdatedAdvertiser({ ...updatedAdvertiser, username: e.target.value })}
            />
          </label>
          <label>
            Website:
            <input
              type="text"
              name="website"
              defaultValue={advertiser.website || ''}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2"
              readOnly={isRequired}
              onChange={(e) => setUpdatedAdvertiser({ ...updatedAdvertiser, website: e.target.value })}
            />
          </label>
          <label>
            Hotline:
            <input
              type="text"
              name="hotline"
              defaultValue={advertiser.hotline || ''}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2"
              readOnly={isRequired}
              onChange={(e) => setUpdatedAdvertiser({ ...updatedAdvertiser, hotline: e.target.value })}
            />
          </label>
          <label>
            Company Profile:
            <input
              type="text"
              name="companyProfile"
              defaultValue={advertiser.companyProfile || ''}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2"
              readOnly={isRequired}
              onChange={(e) => setUpdatedAdvertiser({ ...updatedAdvertiser, companyProfile: e.target.value })}
            />
          </label>
          <label>
            Industry:
            <input
              type="text"
              name="industry"
              defaultValue={advertiser.industry || ''}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2"
              readOnly={isRequired}
              onChange={(e) => setUpdatedAdvertiser({ ...updatedAdvertiser, industry: e.target.value })}
            />
          </label>
          <label>
            Address:
            <input
              type="text"
              name="address"
              defaultValue={advertiser.address || ''}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2"
              readOnly={isRequired}
              onChange={(e) => setUpdatedAdvertiser({ ...updatedAdvertiser, address: e.target.value })}
            />
          </label>
          <label>
            Email:
            <input
              type="text"
              name="email"
              defaultValue={advertiser.email || ''}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2"
              readOnly={isRequired}
              onChange={(e) => setUpdatedAdvertiser({ ...updatedAdvertiser, email: e.target.value })}
            />
          </label>
          <label>
            Company Name:
            <input
              type="text"
              name="companyName"
              defaultValue={advertiser.companyName || ''}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2"
              readOnly={isRequired}
              onChange={(e) => setUpdatedAdvertiser({ ...updatedAdvertiser, companyName: e.target.value })}
            />
          </label>
        </div>

        {/* Document Upload Section */}
        <div className="mt-6">
          <h2 className="text-xl mb-2">Upload Required Documents</h2>
          <label className="block mb-2">
            ID:
            <input
              type="file"
              onChange={(e) => setIdFile(e.target.files[0])}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-1 mt-1"
            />
          </label>
          <label className="block mb-2">
            Taxation Registry Card:
            <input
              type="file"
              onChange={(e) => setTaxationCardFile(e.target.files[0])}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-1 mt-1"
            />
          </label>
          <button onClick={handleFileUpload} className="bg-green-600 p-2 mt-4 rounded">
            Upload Documents
          </button>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button className="bg-black text-white p-2 rounded" onClick={handleButtonClick}>Edit</button>
          <button className="bg-black text-white p-2 rounded" onClick={handleSaveClick}>Save</button>
          <button className="bg-black text-white p-2 rounded" onClick={handleRedirect}>Activities</button>
          <button className="bg-black text-white m-6 p-2 rounded" onClick={handleDeleteClick}>Delete Account</button>
        </div>
        <div>
        <Link to='/CreateTransportationActivity'><button className='bg-black text-white m-6 p-2 rounded'>create transportation activity</button></Link>
        <Link to='/ViewTransportationActivity'>
      <button className='bg-black text-white m-6 p-2 rounded' >Transportation Activity</button> </Link>
      </div>

        {/* Delete Account Confirmation */}
        {isDeleteVisible && (
          <div className='bg-gray-700 h-fit text-center p-4 w-[23vw] rounded-xl absolute right-0 left-0 top-[20vh] mx-auto'>
            <p>Are you sure you want to request to delete your account?</p>
            <button className="bg-red-500 mt-4 px-4 py-2 rounded" onClick={handleDeleteAccountRequest}>Request</button>
            <button className="bg-red-500 mt-4 px-4 py-2 rounded" onClick={() => setIsDeleteVisible(false)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvertiserProfile;
