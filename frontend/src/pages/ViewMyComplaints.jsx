import React, { useEffect, useState } from 'react';
import ComplaintContainer from '../components/ComplaintContainer'
import toast from 'react-hot-toast';
function ViewMyComplaints() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [complaints, setComplaints] = useState([]); // State to hold complaints data
    useEffect(() => {
        const fetchComplaints = async () => {
          try {
            const response = await fetch(`http://localhost:3000/api/complaint/by-creator/${user.userName}`);
            const data = await response.json();
            if (data.success) {
              setComplaints(data.data);
            } else {
              toast.error('No complaints found.');
            }
          } catch (error) {
            console.error('Error fetching complaints:', error);
            toast.error('Failed to fetch complaints.');
          }
        };
    
        fetchComplaints(); // Call the function when the component mounts
    }, [user.userName]); // Dependency array includes user.userName to refetch if it changes
    
    
  return (
    <div>
        <div className='mb-6 mt-6 text-2xl'>My Complaints</div>
        <div className="flex flex-wrap gap-3 justify-center">
              {complaints.length > 0 ? (
                    complaints.map((complaint, index) => (
                        <ComplaintContainer key={index} complaint={complaint} />
                    ))
                ) : (
                    <div className="text-white text-lg mt-4">You have no complaints</div>
                )}
          </div>
    </div>
  )
}

export default ViewMyComplaints