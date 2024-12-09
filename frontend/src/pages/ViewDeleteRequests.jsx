import React, { useEffect } from 'react';
import { useRequestStore } from '../store/requests';
import toast, { Toaster } from 'react-hot-toast';
import { useUserStore } from '../store/user';
import { useSellerStore } from '../store/seller';
import { useTouristStore } from '../store/tourist';
import { useGuideStore } from '../store/tourGuide';

function ViewDeleteRequests() {
  const { requests, getDeleteRequests, updateRequestStatus, setRequests } = useRequestStore();
  const { deleteUser } = useUserStore();
  const { deleteTourist } = useTouristStore();
  const { deleteSeller } = useSellerStore();
  const { deleteGuide } = useGuideStore();

  // Fetch delete requests once when the component mounts
  useEffect(() => {
    fetchDeleteRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDeleteRequests = async () => {
    try {
      await getDeleteRequests();
    } catch (error) {
      console.error('Error fetching delete requests:', error);
      toast.error('Failed to load delete requests.', { className: "text-white bg-red-600" });
    }
  };

  const handleReject = async (id) => {
    try {
      const { success, message } = await updateRequestStatus(id, 'rejected');
      if (success) {
        toast.success('Delete request has been rejected.', { className: "text-white bg-gray-800" });
        // Remove the request from the local state
        removeRequestFromState(id);
      } else {
        toast.error(message, { className: "text-white bg-gray-800" });
      }
    } catch (error) {
      console.error('Error rejecting delete request:', error);
      toast.error('An error occurred while rejecting the request.', { className: "text-white bg-red-600" });
    }
  };

  const handleApprove = async (id, userName, userType) => {
    try {
      // Delete the user based on their type
      let deleteSuccess = false;
      switch (userType.toLowerCase()) {
        case 'user':
          deleteSuccess = await deleteUser(userName, userType);
          break;
        case 'tourist':
          deleteSuccess = await deleteTourist(userName, userType);
          break;
        case 'seller':
          deleteSuccess = await deleteSeller(userName, userType);
          break;
        case 'tour guide':
        case 'tourguide':
          deleteSuccess = await deleteGuide(userName, userType);
          break;
        default:
          toast.error('Unknown user type.', { className: "text-white bg-red-600" });
          return;
      }

      if (deleteSuccess) {
        // Update the request status to 'approved'
        const { success, message } = await updateRequestStatus(id, 'approved');
        if (success) {
          toast.success('Delete request approved and account deleted.', { className: "text-white bg-gray-800" });
          // Remove the request from the local state
          removeRequestFromState(id);
        } else {
          toast.error(message, { className: "text-white bg-gray-800" });
        }
      } else {
        toast.error('Failed to delete the user.', { className: "text-white bg-red-600" });
      }
    } catch (error) {
      console.error('Error approving delete request:', error);
      toast.error('An error occurred while approving the request.', { className: "text-white bg-red-600" });
    }
  };

  const removeRequestFromState = (id) => {
    const updatedRequests = requests.filter(request => request._id !== id);
    setRequests(updatedRequests);
  };

  // Filter requests to show only pending
  const pendingRequests = requests.filter(request => request.status.toLowerCase() === 'pending');

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <h1 className="text-3xl font-bold mb-4">Delete Accounts Requests</h1>

      {/* Requests List */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Pending Requests</h2>
        {pendingRequests.length === 0 ? (
          <p className="text-gray-600">No pending delete requests found.</p>
        ) : (
          <ul className="space-y-4">
            {pendingRequests.map((r) => (
              <li key={r._id} className="p-4 border border-gray-600 rounded-md flex justify-between items-center">
                <div>
                  <p><strong>Username:</strong> {r.userName}</p>
                  <p><strong>Type:</strong> {r.userType}</p>
                  <p><strong>Status:</strong> {r.status}</p>
                </div>
                <div>
                  <button 
                    className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                    onClick={() => handleApprove(r._id, r.userName, r.userType)}
                  >
                    Approve
                  </button>
                  <button 
                    className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                    onClick={() => handleReject(r._id)}
                  >
                    Reject
                  </button>
                </div>
              </li> 
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ViewDeleteRequests;
