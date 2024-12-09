import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { FaPlus } from "react-icons/fa"; // Using a simple icon for button
import egypt from "../images/egypt.jpg"; // Background image
import { useNavigate } from "react-router-dom";
const GovernorProfilePage = () => {
  const [archivedButton, setArchivedButton] = useState(false);
 
  const navigate = useNavigate(); 
  useEffect(() => {
    // Fetch any initial data if needed, but for now, this can be empty
  }, []);

  const handleCreateHistoricalPlacesClick = () => {
    // Navigate to the "Attraction" page (adjust the path if needed)
    navigate("/attraction"); 
    toast.success("Redirecting to Create Historical Places page");
  };

  const handleCreateTagsClick = () => {
    // Navigate to the "Governor Preferences Tags" page
    navigate("/GovernorPreferencesTag"); // Redirect to the Governor Preferences Tags page
    toast.success("Redirecting to Create Tags page");
  };


  

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
       />
      <img
        src={egypt}
        className="fixed top-0 left-0 w-full h-full object-cover opacity-10 pointer-events-none"
        alt="Background"
      />
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 sm:p-10">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">Governor Profile</h1>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="flex flex-col gap-4">
                {/* Create Historical Places Button */}
                <button
                  className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 flex items-center gap-2"
                  onClick={handleCreateHistoricalPlacesClick}
                >
                  <FaPlus size={16} />
                  Create Historical Places
                </button>
                {/* Create Tags Button */}
                <button
                  className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 flex items-center gap-2"
                  onClick={handleCreateTagsClick}
                >
                  <FaPlus size={16} />
                  Create Tags
                </button>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Manage Archived Items</h2>
              <div className="flex justify-center mb-4">
                <button
                  className={`px-4 py-2 rounded-l-lg ${
                    !archivedButton ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setArchivedButton(false)}
                >
                  Visible
                </button>
                <button
                  className={`px-4 py-2 rounded-r-lg ${
                    archivedButton ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setArchivedButton(true)}
                >
                  Archived
                </button>
              </div>
              <div className="text-center text-gray-700">
                <p>{archivedButton ? "Showing Archived Items" : "Showing Visible Items"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernorProfilePage;
