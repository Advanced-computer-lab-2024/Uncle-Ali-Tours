import { useUserStore } from '../store/user';
import React, { useEffect } from "react";
import { useState } from 'react';
import { useAdvertiserstore } from '../store/advertiser.js';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const AdvertiserProfile = () => {
  const { user } = useUserStore(); 
  const { advertiser, getAdvertiser, updateAdvertiser } = useAdvertiserstore(); 

  const [isRequired, setIsRequired] = useState(true);
  const handleButtonClick = () => {
    setIsRequired(false); 
};

const [updatedAdvertiser,setUpdatedAdvertiser]= useState({});  
const handleButtonClickk = async () => {
    if(!isRequired){
       const {success, message}  = await updateAdvertiser(user.userName , updatedAdvertiser);
       success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})

    }
}

  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate('/product');
  };

  
  useEffect(()=>{
    getAdvertiser({username : user.username},{});
},[])


return (
    <div className="relative p-10 max-w-3xl mx-auto mt-5 rounded-lg shadow-lg bg-gray-800 text-white">
      <Toaster />
  
      <div className="flex items-center border-b border-gray-600 pb-5 mb-5">
        <div className="w-24 h-24 rounded-full bg-gray-900 mr-5"></div>
        <div>
        <h1 className="text-white text-2xl font-bold">
      {advertiser.username || 'John Doe'}
    </h1>
          <h2 className="text-gray-400 text-xl">Advertiser</h2>
        </div>
      </div>

      <div className="relative p-10 max-w-3xl mx-auto mt-5 rounded-lg shadow-lg bg-gray-800 text-white">
        <h1 className="text-lg mb-4">Profile</h1>
        <div spacing={4} align="stretch"> {/* Add spacing and stretch alignment */}
          <label>
            name:
            <input
              type="text"
              name="name"
              defaultValue={advertiser.username || ''}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2" // Darker background and padding for alignment
              readOnly={isRequired}
              onChange={(e) => setUpdatedAdvertiser({ ...updatedAdvertiser, username: e.target.value })}
            />
          </label>
          <label>
            password:
            <input
              type="text"
              name="password"
              defaultValue={advertiser.password || ''}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2" // Darker background and padding for alignment
              readOnly={isRequired}
              onChange={(e) => setUpdatedAdvertiser({ ...updatedAdvertiser, password: e.target.value })}
            />
          </label>
          <label>
            WEBSITE:
            <input
              type="text"
              name="website"
              defaultValue={advertiser.website || ''}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2" // Darker background and padding for alignment
              readOnly={isRequired}
              onChange={(e) => setUpdatedAdvertiser({ ...updatedAdvertiser, website: e.target.value })}
            />
          </label>
          <label>
            HOTLINE:
            <input
              type="text"
              name="hotline"
              defaultValue={advertiser.hotline || ''}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2" // Darker background and padding for alignment
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
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2" // Darker background and padding for alignment
              readOnly={isRequired}
              onChange={(e) => setUpdatedAdvertiser({ ...updatedAdvertiser, companyProfile: e.target.value })}
            />
          </label>
          <label>
          industry:
            <input
              type="text"
              name="industry"
              defaultValue={advertiser.industry || ''}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2" // Darker background and padding for alignment
              readOnly={isRequired}
              onChange={(e) => setUpdatedAdvertiser({ ...updatedAdvertiser, industry: e.target.value })}
            />
          </label>
          <label>
          address:
            <input
              type="text"
              name="address"
              defaultValue={advertiser.address || ''}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2" // Darker background and padding for alignment
              readOnly={isRequired}
              onChange={(e) => setUpdatedAdvertiser({ ...updatedAdvertiser, address: e.target.value })}
            />
          </label>
          <label>
          email:
            <input
              type="text"
              name="email"
              defaultValue={advertiser.email || ''}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2" // Darker background and padding for alignment
              readOnly={isRequired}
              onChange={(e) => setUpdatedAdvertiser({ ...updatedAdvertiser, email: e.target.value })}
            />
          </label>
          <label>
          companyName:
            <input
              type="text"
              name="companyName"
              defaultValue={advertiser.companyName || ''}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2" // Darker background and padding for alignment
              readOnly={isRequired}
              onChange={(e) => setUpdatedAdvertiser({ ...updatedAdvertiser, companyName: e.target.value })}
            />
          </label>
        </div>
        <div className="flex justify-between mt-6">
          <button className="bg-black text-white p-2 rounded" onClick={handleButtonClick}>
            Edit
          </button>
          <button className="bg-black text-white p-2 rounded" onClick={handleButtonClickk}>
            Save
          </button>
          <button className="bg-black text-white p-2 rounded" onClick={handleRedirect}>
            Product 
          </button>
        </div>
      </div>
    </div>
  );
};


export default AdvertiserProfile;
