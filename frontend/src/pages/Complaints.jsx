import React, { useState, useEffect } from 'react';
import { useComplaintStore } from '../store/complaint';
import toast, { Toaster } from 'react-hot-toast';

const Complaints= () => {
  const { 
    complaints, 
    getComplaints, 
    getComplaintDetails, 
    updateComplaintStatus 
  } = useComplaintStore();
  
  const [expandedComplaintId, setExpandedComplaintId] = useState(null); // Track which complaint is expanded
  const [expandedComplaintDetails, setExpandedComplaintDetails] = useState(null);

  // Fetch complaints on page load
  useEffect(() => {
    getComplaints();
  }, [getComplaints]);

  // Function to handle viewing complaint details
  const handleViewDetails = async (id) => {
    if (expandedComplaintId === id) {
      // Collapse if the same complaint is clicked again
      setExpandedComplaintId(null);
      setExpandedComplaintDetails(null);
      return;
    }
    
    const { success, data, message } = await getComplaintDetails(id);
    if (success) {
      setExpandedComplaintId(id);
      setExpandedComplaintDetails(data);
    } else {
      toast.error(message, { className: "text-white bg-gray-800" });
    }
  };

  // Function to toggle complaint status
  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'resolved' : 'pending';
    const { success, message } = await updateComplaintStatus(id, newStatus);
    if (success) {
      toast.success(`Complaint marked as ${newStatus}`, { className: "text-white bg-gray-800" });
      getComplaints(); // Refresh complaints list
      if (expandedComplaintId === id && expandedComplaintDetails) {
        setExpandedComplaintDetails((prev) => ({ ...prev, status: newStatus }));
      }
    } else {
      toast.error(message, { className: "text-white bg-gray-800" });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <h1 className="text-3xl font-bold mb-4">Complaints Management</h1>

      {/* Complaints List */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">All Complaints</h2>
        <ul className="space-y-4">
          {complaints.map((complaint) => (
            <li key={complaint._id} className="p-4 border border-gray-600 rounded-md">
              <p><strong>Title:</strong> {complaint.title}</p>
              <p><strong>Status:</strong> {complaint.status}</p>
              <div className="flex space-x-4 mt-2">
                <button
                  onClick={() => handleViewDetails(complaint._id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                  {expandedComplaintId === complaint._id ? 'Hide Details' : 'View Details'}
                </button>
                <button
                  onClick={() => handleStatusToggle(complaint._id, complaint.status)}
                  className={`px-4 py-2 ${complaint.status === 'pending' ? 'bg-green-500' : 'bg-yellow-500'} text-white rounded-md hover:bg-opacity-75 transition duration-300`}
                >
                  Mark as {complaint.status === 'pending' ? 'Resolved' : 'Pending'}
                </button>
              </div>

              {/* Expanded Complaint Details */}
              {expandedComplaintId === complaint._id && expandedComplaintDetails && (
                <div className="mt-4 p-4 border-t border-gray-400">
                  <h3 className="text-xl font-bold mb-2">Complaint Details</h3>
                  <p><strong>Title:</strong> {expandedComplaintDetails.title}</p>
                  <p><strong>Body:</strong> {expandedComplaintDetails.body}</p>
                  <p><strong>Status:</strong> {expandedComplaintDetails.status}</p>
                  <p><strong>Creator:</strong> {expandedComplaintDetails.creator}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Complaints;
