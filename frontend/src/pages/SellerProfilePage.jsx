import { VStack } from '@chakra-ui/react';
import { useUserStore } from '../store/user';
import React, { useEffect } from "react";
import { useState } from 'react';
import { useSellerStore } from '../store/seller';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const SellerProfile = () => {
  const { user } = useUserStore(); 
  const { sell, getSeller, updateSeller } = useSellerStore(); 

  const [isRequired, setIsRequired] = useState(true);
  const handleButtonClick = () => {
    setIsRequired(false); 
};

const [updatedSeller,setUpdatedSeller]= useState({});  
const handleButtonClickk = async () => {
    if(!isRequired){
       const {success, message}  = await updateSeller(user.userName , updatedSeller);
       success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})

    }
}

  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate('/product');
  };

  
  useEffect(()=>{
    getSeller({userName : user.userName},{});
})


return (
    <div className="relative p-10 max-w-3xl mx-auto mt-5 rounded-lg shadow-lg bg-gray-800 text-white">
      <Toaster />
  
      <div className="flex items-center border-b border-gray-600 pb-5 mb-5">
        <div className="w-24 h-24 rounded-full bg-gray-900 mr-5"></div>
        <div>
        <h1 className="text-white text-2xl font-bold">
      {sell?.userName || 'John Doe'}
    </h1>
          <h2 className="text-gray-400 text-xl">Seller</h2>
        </div>
      </div>

      <div className="relative p-10 max-w-3xl mx-auto mt-5 rounded-lg shadow-lg bg-gray-800 text-white">
        <h1 className="text-lg mb-4">Profile</h1>
        <VStack spacing={4} align="stretch"> {/* Add spacing and stretch alignment */}
          <label>
            NAME:
            <input
              type="text"
              name="name"
              defaultValue={sell.userName || ''}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2" // Darker background and padding for alignment
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
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2" // Darker background and padding for alignment
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
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2" // Darker background and padding for alignment
              readOnly={isRequired}
              onChange={(e) => setUpdatedSeller({ ...updatedSeller, mobileNumber: e.target.value })}
            />
          </label>
          <label>
            Password:
            <input
              type="text"
              name="password"
              defaultValue={sell.password || ''}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2" // Darker background and padding for alignment
              readOnly={isRequired}
              onChange={(e) => setUpdatedSeller({ ...updatedSeller, password: e.target.value })}
            />
          </label>
        </VStack>
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


export default SellerProfile;
