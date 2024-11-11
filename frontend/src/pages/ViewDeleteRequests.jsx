import React from 'react'
import { useEffect } from 'react';
import { useRequestStore } from '../store/requests';
import toast, { Toaster } from 'react-hot-toast';
import { useUserStore } from '../store/user';
import { useSellerStore } from '../store/seller';
import { useTouristStore } from '../store/tourist';
import { useGuideStore } from '../store/tourGuide';
function ViewDeleteRequests() {
  const {requests,getDeleteRequests,updateRequestStatus}=useRequestStore();
  const {deleteUser}=useUserStore();
  const {deleteTourist}=useTouristStore();
  const {deleteSeller}=useSellerStore();
  const {deleteGuide}=useGuideStore();
  getDeleteRequests();
  const handleReject = async (id) => {
    const { success, message } = await updateRequestStatus(id, 'rejected');
    if (success) {
      toast.success('Delete request is rejected', { className: "text-white bg-gray-800" });
    } else {
      toast.error(message, { className: "text-white bg-gray-800" });
    }
  };
  const handleApprove = async (id,userName,userType) => {
    await deleteUser(userName,userType); 
    const { success, message } = await updateRequestStatus(id, 'approved');
    if (success) {
      toast.success('Delete request is approved,account deleted', { className: "text-white bg-gray-800" });
    } else {
      toast.error(message, { className: "text-white bg-gray-800" });
    }
  };
  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <h1 className="text-3xl font-bold mb-4">Delete Accounts Requests</h1>

      {/* Complaints List */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">All Requests</h2>
        <ul className="space-y-4">
        {requests.map((r) => (
         <li key={r._id} className="p-4 border border-gray-600 rounded-md">
          <p><strong>Username:</strong> {r.userName}</p>
          <p><strong>Type:</strong> {r.userType}</p>
          <p><strong>Status:</strong> {r.status}</p>
          <div>
            <button 
            className="ml-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition duration-300"
            onClick={() => handleApprove(r._id,r.userName,r.userType)}>
            Approve
            </button>
            <button 
            className="ml-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition duration-300"
            onClick={() => handleReject(r._id)}>
              Reject
            </button>
          </div>
         </li> 
        ))}
        </ul>
      </div>
    </div>
  );
}

export default ViewDeleteRequests