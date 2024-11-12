import { useUserStore } from '../store/user';
import React, { useEffect ,useRef} from "react";
import { useState } from 'react';
import { useAdvertiserstore } from '../store/advertiser.js';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { FaEye, FaEdit } from 'react-icons/fa';
import AvatarEditor from 'react-avatar-editor';
import { useRequestStore } from '../store/requests.js';
import { Link } from 'react-router-dom';
const AdvertiserProfile = () => {
  const { user } = useUserStore(); 
  const { advertiser, getAdvertiser, updateAdvertiser, uploadProfilePicture } = useAdvertiserstore(); 
  const [isRequired, setIsRequired] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [previewFile, setPreviewFile] = useState(localStorage.getItem("profilePicture") || "");
  const [showPreview, setShowPreview] = useState(false);
  const [scale, setScale] = useState(1.2);
  const [rotate, setRotate] = useState(0);
  const editorRef = useRef(null);
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
  useEffect(() => {
    // Retrieve the profile picture from localStorage on component mount
    const storedProfilePic = localStorage.getItem("advertiserProfilePicture");
    if (storedProfilePic) {
      setPreviewFile(storedProfilePic);
    }
  }, []);

  
  useEffect(() => {
    const fetchAdvertiserData = async () => {
      if (user.userName) {
        const result = await getAdvertiser({ userName: user.userName });
        if (result.success && advertiser.profilePicture) {
          setPreviewFile(advertiser.profilePicture);
          localStorage.setItem("profilePicture", advertiser.profilePicture);
        }
      }
    };
    fetchAdvertiserData();
  }, [user.userName, advertiser.profilePicture]);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
    setProfilePic(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        setProfilePic(file);
        localStorage.removeItem("profilePicture"); // Clear previous photo before uploading a new one
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

        // Set the full path for preview and save in localStorage with a custom name
        setPreviewFile(profileImagePath);
        localStorage.setItem("advertiserProfilePicture", profileImagePath);
        const storedProfilePic = localStorage.getItem("advertiserProfilePicture");
        setPreviewFile(storedProfilePic);
 // Custom key name
        setIsEditing(false);
        setProfilePic(null);
        toast.success(response.data.message, { className: "text-white bg-gray-800" });

        // Re-fetch advertiser data if necessary
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

const updatePreview = () => {
  const storedProfilePic = localStorage.getItem("advertiserProfilePicture");
  if (storedProfilePic) {
    setPreviewFile(storedProfilePic);
  }
};



const handleUploadClick = async () => {
  if (selectedFile) {
    const formData = new FormData();
    formData.append('profilePicture', selectedFile);
    formData.append('userName', user.userName);

    try {
      const response = await axios.put('/api/advertiser/uploadPicture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(response.data.message, { className: "text-white bg-gray-800" });
      
    
      if (user.userName) {
        await getAdvertiser({ userName: user.userName }, {});
      }
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed", { className: "text-white bg-gray-800" });
    }
  } else {
    toast.error("Please select a file first", { className: "text-white bg-gray-800" });
  }
};


// const handleSaveClick = async () => {
//   if (!isRequired) {
//     const { success, message } = await updateSeller(user.userName, updatedSeller);
//     success ? toast.success(message, { className: "text-white bg-gray-800" }) : toast.error(message, { className: "text-white bg-gray-800" });
//   }
// };
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

      <div className="flex items-center justify-center mb-6">
        {previewFile ? (
          <img
            style={{ width: "160px", height: "160px", borderRadius: "50%", objectFit: "cover" }}
            src={`http://localhost:3000${previewFile}`}
            alt="Profile Picture"
          />
        ) : (
          <div className="text-gray-500">add logo</div>
        )}
        <div className="icon-buttons ml-4">
          <button onClick={() => setShowPreview(true)}>
            <FaEye />
          </button>
          <button onClick={toggleEdit}>
            <FaEdit />
          </button>
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

          {isEditing && (
            <>
              <label>
                Upload logo:
                <input
                  type="file"
                  name="profilePicture"
                  className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2"
                  onChange={handleFileChange}
                />
              </label>
              {profilePic && (
                <div className="avatar-editor">
                  <AvatarEditor
                    ref={editorRef}
                    image={profilePic}
                    width={150}
                    height={150}
                    border={30}
                    borderRadius={75}
                    color={[255, 255, 255, 0.6]}
                    scale={scale}
                    rotate={rotate}
                    style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }}
                  />
                  <div className="controls mt-3">
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.1"
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className="slider bg-gray-700"
                    />
                    <button className="bg-gray-600 text-white p-2 rounded" onClick={() => setRotate((prev) => prev + 90)}>
                      Rotate
                    </button>
                    <button className="bg-black text-white p-2 rounded mt-4" onClick={handleSave}>
                      Save Profile Picture
                    </button>
                    
                  </div>
                </div>
              )}
            </>
          )}
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
