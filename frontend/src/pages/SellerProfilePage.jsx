import { useUserStore } from '../store/user';
import React, { useEffect, useState } from 'react';
import { useSellerStore } from '../store/seller';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const SellerProfile = () => {
  const { user } = useUserStore(); 
  const { sell, getSeller, updateSeller } = useSellerStore(); 

  const [isRequired, setIsRequired] = useState(true);
  const [updatedSeller, setUpdatedSeller] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // To preview the image

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSeller() {
      await getSeller({ userName: user.userName }, {}); // Fetch data including profile picture
    }
    fetchSeller();
  }, []);

  useEffect(() => {
    // Update the preview image when sell.profilePicture changes
    if (sell.profilePicture) {
      setPreviewImage(`/uploads/${sell.profilePicture}`);
    }
  }, [sell.profilePicture]);

  const handleButtonClick = () => {
    setIsRequired(false); 
  };

  const handleSaveClick = async () => {
    if (!isRequired) {
      const { success, message } = await updateSeller(user.userName, updatedSeller);
      success ? toast.success(message, { className: "text-white bg-gray-800" }) : toast.error(message, { className: "text-white bg-gray-800" });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file)); // Preview the selected image
  };

  const handleUploadClick = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);
      formData.append('userName', user.userName);

      try {
        const response = await axios.put('/api/seller/uploadPicture', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success(response.data.message, { className: "text-white bg-gray-800" });
       // await getSeller({ userName: user.userName }, {}); // Refresh seller data after upload
      } catch (error) {
        toast.error(error.response?.data?.message || "Upload failed", { className: "text-white bg-gray-800" });
      }
    } else {
      toast.error("Please select a file first", { className: "text-white bg-gray-800" });
    }
  };

  const handleRedirect = () => {
    navigate('/product');
  };

  return (
    <div className="relative p-10 max-w-3xl mx-auto mt-5 rounded-lg shadow-lg bg-gray-800 text-white">
      <Toaster />

      <div className="flex items-center border-b border-gray-600 pb-5 mb-5">
        <div className="w-24 h-24 rounded-full bg-gray-900 mr-5 overflow-hidden">
          {previewImage ? (
            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">add logo</div>
          )}
        </div>
        
        <div>
          <h1 className="text-white text-2xl font-bold">{sell.userName || 'John Doe'}</h1>
          <h2 className="text-gray-400 text-xl">Seller</h2>
        </div>
      </div>

      <div className="relative p-10 max-w-3xl mx-auto mt-5 rounded-lg shadow-lg bg-gray-800 text-white">
        <h1 className="text-lg mb-4">Profile</h1>
        <div spacing={4} align="stretch">
          <label>
            NAME:
            <input
              type="text"
              name="name"
              defaultValue={sell.userName || ''}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2"
              readOnly={isRequired}
              onChange={(e) => setUpdatedSeller({ ...updatedSeller, userName: e.target.value })}
            />
          </label>
          <label>
            Email:
            <input
              type="text"
              name="email"
              defaultValue={sell.email || ''}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2"
              readOnly={isRequired}
              onChange={(e) => setUpdatedSeller({ ...updatedSeller, email: e.target.value })}
            />
          </label>
          <label>
            Mobile number:
            <input
              type="text"
              name="mobileNumber"
              defaultValue={sell.mobileNumber || ''}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2"
              readOnly={isRequired}
              onChange={(e) => setUpdatedSeller({ ...updatedSeller, mobileNumber: e.target.value })}
            />
          </label>
          <label>
            Upload Picture:
            <input
              type="file"
              name="profilePicture"
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <div className="flex justify-between mt-6">
          <button className="bg-black text-white p-2 rounded" onClick={handleButtonClick}>
            Edit
          </button>
          <button className="bg-black text-white p-2 rounded" onClick={handleSaveClick}>
            Save
          </button>
          <button className="bg-black text-white p-2 rounded" onClick={handleUploadClick}>
            Upload Picture
          </button>
          <button className="bg-black text-white p-2 rounded" onClick={handleRedirect}>
            Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
