import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAddressStore } from "../store/address";
import { useUserStore } from "../store/user";

const AddAddressPage = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { createAddress } = useAddressStore();

  // Define the state for the form fields
  const [newAddress, setNewAddress] = useState({
    creator: user.userName,
    addressLine: "",
    city: "",
    country: "",
    });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAddress = async () => {
    try{
      const response = await createAddress(newAddress);
      if (response.success) {
        toast.success(response.message, { className: "text-white bg-gray-800" });
      } else {
        console.error(response.message);
        toast.error(response.message, { className: "text-white bg-gray-800" });
      }
    }
    catch (error) {
      console.error('Error adding address:', error.message);
      toast.error('Error adding address', { className: "text-white bg-gray-800" });
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 shadow-lg rounded-lg w-full sm:w-3/4 md:w-1/2">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Add New Address</h2>
      
      <form onSubmit={handleAddAddress} className="space-y-4">
        
        {/* Address Line 1 */}
        <div>
          <label htmlFor="addressLine" className="text-gray-700">Address Line 1</label>
          <input
            type="text"
            name="addressLine"
            id="addressLine"
            placeholder="Enter Address Line 1"
            value={newAddress.addressLine}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-black"
            required
          />
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="text-gray-700">City</label>
          <input
            type="text"
            name="city"
            id="city"
            placeholder="Enter City"
            value={newAddress.city}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-black"
            required
          />
        </div>

        {/* Country */}
        <div>
          <label htmlFor="country" className="text-gray-700">Country</label>
          <input
            type="text"
            name="country"
            id="country"
            placeholder="Enter Country"
            value={newAddress.country}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-black"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"  // Submit the form
            className="w-full py-3 mt-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            Add Address
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAddressPage;
