import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useUserStore } from "../store/user";
import { useSellerStore } from "../store/seller";
import egypt from "../images/egypt.jpg";

const UnVerified = () => {
  const { uploadDocuments } = useSellerStore();
  const { user } = useUserStore();
  const [idFile, setIdFile] = useState(null);
  const [taxationCardFile, setTaxationCardFile] = useState(null);

  const handleFileUpload = async () => {
    if (!idFile || !taxationCardFile) {
      toast.error("Please upload both ID and Taxation Registry Card.");
      return;
    }

    const formData = new FormData();
    formData.append("taxID", idFile);
    formData.append("taxationRegistryCard", taxationCardFile);
    formData.append("userName", user.userName);

    try {
      const result = await uploadDocuments(user.userName, formData);
      console.log("Upload result:", result);

      if (result.success) {
        toast.success("Documents uploaded successfully.");
      } else {
        toast.error(result.message || "Failed to upload documents.");
      }
    } catch (error) {
      console.error("Error during upload:", error);
      toast.error("An error occurred during the upload.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      <Toaster />
      {/* Background Image with Overlay */}
      <img
        src={egypt}
        alt="Background"
        className="fixed top-0 left-0 w-full h-full object-cover opacity-30 pointer-events-none"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

      <div className="relative max-w-lg w-full bg-white p-8 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
          Account Verification Required
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          To access your dashboard, please upload your identification documents. This step ensures the security and authenticity of our marketplace.
        </p>

        <div className="space-y-6">
          {/* ID Document Upload Field */}
          <div>
            <label htmlFor="idFile" className="block text-gray-700 font-medium mb-2">
              Upload ID Document
            </label>
            <input
              type="file"
              id="idFile"
              onChange={(e) => setIdFile(e.target.files[0])}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Taxation Registry Card Upload Field */}
          <div>
            <label htmlFor="taxationCardFile" className="block text-gray-700 font-medium mb-2">
              Upload Taxation Registry Card
            </label>
            <input
              type="file"
              id="taxationCardFile"
              onChange={(e) => setTaxationCardFile(e.target.files[0])}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleFileUpload}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
          >
            Submit Documents
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnVerified;
