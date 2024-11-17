import React, {useState} from "react";
import toast, { Toaster } from "react-hot-toast";
import { useUserStore } from "../store/user";
function UnVerified() {
    const { user } = useUserStore();
    const [idFile, setIdFile] = useState();
    const [taxationCardFile, setTaxationCardFile] = useState();

    
    const handleFileUpload = async () => {
        if (!idFile || !taxationCardFile) {
          toast.error("Please upload both ID and Taxation Registry Card.");
          return;
        }
    
        // Form submission logic for file upload
        const formData = new FormData();
        formData.append("idFile", idFile);
        formData.append("taxationCardFile", taxationCardFile);
        formData.append("username", user.userName);
    
        try {
          const response = await fetch("/api/upload-documents", {
            // Replace with your backend endpoint
            method: "POST",
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
    <div className="mt-12">
        <Toaster/>
      <p className="text-4xl">You are not verified yet</p>
      <div className="relative p-6 w-[70vh] mx-auto mt-4 backdrop-blur-lg bg-[#161821f0] h-[37vh] max-w-3xl rounded-lg shadow-lg text-white">
        <p className="text-2xl">Please upload the required documents</p>

        <div className="mt-6">
            <label className="block my-2">
              ID:
              </label>
              <input
                type="file"
                onChange={(e) => setIdFile(e.target.files[0])}
                className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-1 mt-1"
              />
            <label className="block my-2">
              Taxation Registry Card:
              </label>
              <input
                type="file"
                onChange={(e) => setTaxationCardFile(e.target.files[0])}
                className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-1 mt-1"
              />
          </div>
            <button
              onClick={handleFileUpload}
              className="bg-green-600 p-2 mt-4 rounded"
            >
              Upload Documents
            </button>
      </div>
    </div>
  );
}

export default UnVerified;
