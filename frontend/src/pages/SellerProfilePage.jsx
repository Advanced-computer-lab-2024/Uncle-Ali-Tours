import { useUserStore } from '../store/user';
import React, { useEffect, useState } from 'react';
import { useSellerStore } from '../store/seller';
import { useProductStore } from '../store/product';
import { useNavigate } from 'react-router-dom';
import ProductContainerForSeller from '../components/ProductContainerForSeller';
import toast, { Toaster } from 'react-hot-toast';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import { useRequestStore } from '../store/requests.js';


import axios from 'axios';

const SellerProfile = () => {
  const { user } = useUserStore(); 
  const { sell, getSeller, updateSeller } = useSellerStore(); 
  const { getProducts, products } = useProductStore();
    const [filter, setFilter] = useState({});
  const [isRequired, setIsRequired] = useState(true);
  const [showChart, setShowChart] = useState(false); // Toggle for chart visibility



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


const handleButtonClickk = async () => {
    if(!isRequired){
       const {success, message}  = await updateSeller(user.userName , updatedSeller);
       success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})

    }
}
  const [updatedSeller, setUpdatedSeller] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // To preview the image


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

  

  const handlePress = async () => {
    // Fetch products filtered by the seller's userName
    await getProducts({ ...filter , creator: user.userName }, {});
    setShowChart(true); // Show chart after fetching products
  };

  const navigate = useNavigate();
  const handleRedirect = () => navigate('/product');

  useEffect(() => {
    getSeller({ userName: user.userName }, {});
  }, []);

const [isDeleteVisible, setIsDeleteVisible] = useState(false);
const { createRequest } = useRequestStore();
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
  console.log(deleteRequest);
  if (success) {
    toast.success('Account deletion request submitted successfully.');
    setIsDeleteVisible(false); // Close the delete dialog
  } else {
    toast.error(message);
  }
};




  // Prepare data for Bar chart
  const getSalesData = () => {
    return {
      labels: products.map(product => product.name),
      datasets: [
        {
          label: 'Sales',
          data: products.map(product => product.sales || 0),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
  };
  
  return (
    <div className="relative p-10 max-w-3xl mx-auto mt-5 rounded-lg shadow-lg bg-gray-800 text-white">
      <p>dd</p>
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
          <button className="bg-black text-white p-2 rounded" onClick={handleButtonClick}>Edit</button>
          <button className="bg-black text-white p-2 rounded" onClick={handleButtonClickk}>Save</button>
          <button className="bg-black text-white p-2 rounded" onClick={handleRedirect}>Product</button>
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
          <br />
          <button className='bg-black text-white m-6 p-2 rounded' onClick={handleDeleteClick}>Delete Account</button> 
           {isDeleteVisible && (
            <div className='bg-gray-700 h-fit text-center p-4 w-[23vw] rounded-xl absolute right-0 left-0 top-[20vh] mx-auto'>
            <p>Are you sure you want to request to delete your account?</p>
            <button className="bg-red-500 mt-4 px-4 py-2 rounded" onClick={handleDeleteAccountRequest}>Request</button>
            <button className="bg-red-500 mt-4 px-4 py-2 rounded" onClick={() => setIsDeleteVisible(false)}>Cancel</button>
            </div>
           )}
        </div>

        <button className='p-2 bg-black text-white mt-4' onClick={handlePress}>View My Products</button>
        
        {/* Product List */}
        <div className="grid w-fit mx-auto">
          <h2 className="text-xl mb-4">Available Products</h2>
          {products.map((product, index) => (
            !product.archive && (<ProductContainerForSeller key={index} product={product} />)
          ))}
        </div>

        {/* Sales Chart */}
        {showChart && products.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl text-center">Sales Data</h3>
            <Bar data={getSalesData()} options={{ responsive: true }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProfile;
