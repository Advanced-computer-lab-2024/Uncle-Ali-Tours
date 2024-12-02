import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// A more modern form with additional styling
const AddAddressPage = () => {
  const navigate = useNavigate();

  const [newAddress, setNewAddress] = useState({
    
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    isDefault: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("/api/tourist/addDeliveryAddress", newAddress);
  
      if (response.status === 201) {
        toast.success("Address added successfully!");
        
      }
    } catch (error) {
      console.error("Error details:", error);  // Log the error details for better debugging
      toast.error("Error adding address");
    }
  };
  

  return (
    <div className="container mx-auto p-4 bg-gray-50 shadow-lg rounded-lg w-full sm:w-3/4 md:w-1/2">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Add New Address</h2>
      
      <form onSubmit={handleAddAddress} className="space-y-4">
         
        {/* Address Line 1 */}
        <div>
          <label htmlFor="addressLine1" className="text-gray-700">Address Line 1</label>
          <input
            type="text"
            name="addressLine1"
            id="addressLine1"
            placeholder="Enter Address Line 1"
            value={newAddress.addressLine1}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-black"
            required
          />
        </div>

        {/* Address Line 2 */}
        <div>
          <label htmlFor="addressLine2" className="text-gray-700">Address Line 2</label>
          <input
            type="text"
            name="addressLine2"
            id="addressLine2"
            placeholder="Enter Address Line 2 (Optional)"
            value={newAddress.addressLine2}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-black"
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

        {/* State */}
        <div>
          <label htmlFor="state" className="text-gray-700">State</label>
          <input
            type="text"
            name="state"
            id="state"
            placeholder="Enter State"
            value={newAddress.state}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-black"
            required
          />
        </div>

        {/* Zip Code */}
        <div>
          <label htmlFor="zipCode" className="text-gray-700">Zip Code</label>
          <input
            type="text"
            name="zipCode"
            id="zipCode"
            placeholder="Enter Zip Code"
            value={newAddress.zipCode}
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

        {/* Set as Default Address */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isDefault"
            id="isDefault"
            checked={newAddress.isDefault}
            onChange={(e) => setNewAddress((prev) => ({ ...prev, isDefault: e.target.checked }))}
            className="mr-2"
          />
          <label htmlFor="isDefault" className="text-gray-700">Set as Default Address</label>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="button"  // Prevent the form's default submit action
            className="w-full py-3 mt-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            onClick={handleAddAddress}  // Directly trigger the addAddress method
          >
            Add Address
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAddressPage;
