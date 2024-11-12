import React, { useState, useEffect } from 'react';
import { useComplaintStore } from '../store/complaint';
import toast, { Toaster } from 'react-hot-toast';

const Complaints = () => {
  const { 
    complaints, 
    getComplaints, 
    getComplaintDetails, 
    updateComplaintStatus 
  } = useComplaintStore();
  
  const [expandedComplaintId, setExpandedComplaintId] = useState(null);
  const [expandedComplaintDetails, setExpandedComplaintDetails] = useState(null);
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});
  const [sortVisibility, setSortVisibility] = useState(false);
  const [filterVisibility, setFilterVisibility] = useState(false);

  // Fetch complaints whenever filter or sort changes
  useEffect(() => {
    const fetchComplaints = async () => {
      await getComplaints(filter, sort);
    };
    fetchComplaints();
  }, [filter, sort, getComplaints]);

  const handleSort = () => {
    setSortVisibility((prev) => !prev);
  };

  const handleFilter = () => {
    setFilterVisibility((prev) => !prev);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  // Function to handle viewing complaint details
  const handleViewDetails = async (id) => {
    if (expandedComplaintId === id) {
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
      await getComplaints(filter, sort); // Refresh complaints list
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

      {/* Sorting and Filtering Controls */}
      <button onClick={handleSort}>{Object.keys(sort)[0] ? `Sorted by ${Object.keys(sort)[0]}` : 'Sort'}</button>
      <br />
      <button onClick={handleFilter}>Filter by Status</button>
      <br />

      <div className="flex space-x-4 my-4">
  {/* Sorting Options */}
  <div className={`${sortVisibility ? '' : 'hidden'} flex space-x-2`}>
    <div><button onClick={() => handleSortChange({ createdAt: -1 })}>Date New to Old</button></div>
    <div><button onClick={() => handleSortChange({ createdAt: 1 })}>Date Old to New</button></div>
  </div>

  {/* Filtering Options */}
  <div className={`${filterVisibility ? '' : 'hidden'} flex space-x-2`}>
    <div><button onClick={() => handleFilterChange({ status: 'pending' })}>Status: Pending</button></div>
    <div><button onClick={() => handleFilterChange({ status: 'resolved' })}>Status: Resolved</button></div>
  </div>
</div>

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
