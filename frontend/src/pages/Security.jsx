import React, {useState} from 'react'
import toast, {Toaster} from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { useRequestStore } from "../store/requests.js";

function Security() {
    const user  = JSON.parse(localStorage.getItem("user"));
    const [isDeleteVisible, setIsDeleteVisible] = useState(false);
    const { createRequest } = useRequestStore();

    const handleDeleteAccountRequest = async () => {
        const deleteRequest = {
          userName: user.userName,
          userType: user.type,
          userID: user._id,
          type: "delete",
        };
        const { success, message } = await createRequest(deleteRequest);
        console.log(deleteRequest);
        if (success) {
          toast.success("Account deletion request submitted successfully.");
          setIsDeleteVisible(false); // Close the delete dialog
        } else {
          toast.error(message);
        }
      };

      const handleDeleteClick = () => {
        setIsDeleteVisible(!isDeleteVisible);
      };

  return (
    <div className="grid relative p-6 w-[33vh] mx-auto mt-12 backdrop-blur-lg bg-[#161821f0] h-fit max-w-3xl rounded-lg shadow-lg text-white">
        <Toaster />
        <Link to='/changePassword' className="my-2 mx-auto hover:underline">
          changePassword
        </Link>
        <button className='mt-6 rounded hover:underline hover:text-red-500  text-red-400' onClick={handleDeleteClick}>Delete Account</button> 
           {isDeleteVisible && (
            <div className='bg-gray-700 h-fit text-center p-4 w-[23vw] rounded-xl absolute right-0 left-0 top-[20vh] mx-auto'>
            <p>Are you sure you want to request to delete your account?</p>
            <button className="bg-red-500 mt-4 mx-2 px-4 py-2 rounded" onClick={handleDeleteAccountRequest}>Request</button>
            <button className="bg-red-500 mt-4 mx-2 px-4 py-2 rounded" onClick={() => setIsDeleteVisible(false)}>Cancel</button>
            </div>
           )}
    </div>
  )
}

export default Security