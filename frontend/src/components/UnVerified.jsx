import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useUserStore } from "../store/user";
import { useSellerStore } from "../store/seller"; // Import the useSellerStore hook
import axios from 'axios';

function UnVerified() {
  const { uploadDocuments } = useSellerStore();
  const { user } = useUserStore();
  const [idFile, setIdFile] = useState();
  const [taxationCardFile, setTaxationCardFile] = useState();

  const handleFileUpload = async () => {
    console.log("File upload triggered");  // Debugging point

    // Check if both files are selected
    if (!idFile || !taxationCardFile) {
      toast.error("Please upload both ID and Taxation Registry Card.");
      return;
    }

    // Create the FormData object after files are selected
  // Include userName or other necessary data
  const formData = new FormData();
  // Ensure correct field names
  
formData.append("taxID", taxIDFile);  // Ensure the correct file field name
formData.append("taxationRegistryCard", taxationCardFile);  // Ensure the correct file field name
formData.append("userName", user.userName);
    try {
      // Call the uploadDocuments function (which handles the file upload)
      const result = await uploadDocuments(user.userName, formData);
      console.log('Upload result:', result);  // Check the result
      if (result.success) {
        toast.success("Documents uploaded successfully.");
      } else {
        toast.error(result.message || "Failed to upload documents.");
      }
    } catch (error) {
      console.error('Error during upload:', error);  // Log the error
      toast.error("An error occurred during the upload.");
    }

   
  };

  return (
    <div className="mt-12">
        
      <p className="text-4xl">You are not verified yet</p>
      <div className="relative p-6 w-[70vh] mx-auto mt-4 backdrop-blur-lg bg-[#161821f0] h-[37vh] max-w-3xl rounded-lg shadow-lg text-white">
        <p className="text-2xl">Please upload the required documents</p>

        <div className="mt-6">
          <label className="block my-2">
            ID:
          </label>
          <input
  type="file"
  onChange={(e) => {
    setIdFile(e.target.files[0]);
    console.log("Selected file for ID:", e.target.files[0]);
  }}
  className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-1 mt-1"

  
/>

<input
  type="file"
  onChange={(e) => {setTaxationCardFile(e.target.files[0]);
    console.log("Selected file for tax:", e.target.files[0]);
  }}
  className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-1 mt-1"
/>
        </div>
        <button
          onClick={handleFileUpload}
          className="bg-green-600 p-2 mt-4 rounded"
        >
          Submit Documents
        </button>
      </div>
    </div>
  );
}

export default UnVerified;
