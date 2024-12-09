import React, { useState, useEffect } from 'react';
import { useComplaintStore } from '../store/complaint';
import toast, { Toaster } from 'react-hot-toast';

const Complaints = () => {
  const {
    complaints,
    getComplaints,
    getComplaintDetails,
    updateComplaintStatus,
    updateComplaintReply,
  } = useComplaintStore();

  const [expandedComplaintId, setExpandedComplaintId] = useState(null);
  const [expandedComplaintDetails, setExpandedComplaintDetails] = useState(null);
  const [replyText, setReplyText] = useState({}); // Track replies for each complaint

  useEffect(() => {
    // Fetch only pending complaints initially
    getComplaints({ status: 'pending' });
  }, [getComplaints]);

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
      toast.error(message, { className: 'text-white bg-gray-800' });
    }
  };

  const handleStatusToggle = async (id) => {
    const newStatus = 'resolved';
    const { success, message } = await updateComplaintStatus(id, newStatus);
    if (success) {
      toast.success(`Complaint marked as ${newStatus}`, { className: 'text-white bg-gray-800' });
      await getComplaints({ status: 'pending' }); // Refresh the complaints list to show only pending complaints
      setExpandedComplaintId(null);
      setExpandedComplaintDetails(null);
    } else {
      toast.error(message, { className: 'text-white bg-gray-800' });
    }
  };

  const handleReplyChange = (id, text) => {
    setReplyText((prev) => ({ ...prev, [id]: text }));
  };

  const handleReplySubmit = async (id) => {
    const reply = replyText[id];
    if (reply && reply.trim()) {
      const { success, message } = await updateComplaintReply(id, reply);
      if (success) {
        toast.success('Reply sent successfully!', { className: 'text-white bg-gray-800' });
        setReplyText((prev) => ({ ...prev, [id]: '' }));
      } else {
        toast.error(message, { className: 'text-white bg-gray-800' });
      }
    } else {
      toast.error('Reply cannot be empty', { className: 'text-white bg-gray-800' });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6 text-center">Pending Complaints</h1>

      {complaints.length === 0 ? (
        <p className="text-gray-500 text-center">No pending complaints.</p>
      ) : (
        <ul className="space-y-6">
          {complaints.map((complaint) => (
            <li key={complaint._id} className="p-6 border border-gray-300 rounded-lg shadow-md bg-white">
              <p className="font-semibold mb-2">
                <strong>Title:</strong> {complaint.title}
              </p>
              <p className="mb-2">
                <strong>Status:</strong> <span className="text-yellow-500">{complaint.status}</span>
              </p>

              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => handleViewDetails(complaint._id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                  {expandedComplaintId === complaint._id ? 'Hide Details' : 'View Details'}
                </button>
                <button
                  onClick={() => handleStatusToggle(complaint._id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                >
                  Mark as Resolved
                </button>
              </div>

              {/* Reply Input Section */}
              <div className="flex items-center mt-4">
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyText[complaint._id] || ''}
                  onChange={(e) => handleReplyChange(complaint._id, e.target.value)}
                  className="border border-gray-400 p-2 rounded-md flex-grow"
                />
                <button
                  onClick={() => handleReplySubmit(complaint._id)}
                  className="ml-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition duration-300"
                >
                  Send
                </button>
              </div>

              {/* Expanded Complaint Details */}
              {expandedComplaintId === complaint._id && expandedComplaintDetails && (
                <div className="mt-6 p-4 border-t border-gray-300">
                  <h3 className="text-lg font-bold mb-2">Complaint Details</h3>
                  <p className="mb-2">
                    <strong>Body:</strong> {expandedComplaintDetails.body}
                  </p>
                  <p className="mb-2">
                    <strong>Creator:</strong> {expandedComplaintDetails.creator}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Complaints;
