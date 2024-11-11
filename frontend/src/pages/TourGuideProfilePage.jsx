// import { Box, filter, useColorModeValue, VStack } from '@chakra-ui/react';
import React, { useEffect } from "react";
import { useUserStore } from '../store/user';
import { useGuideStore } from '../store/tourGuide';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import UploadPicture from '../components/UploadPicture.jsx';
import Dialog, { dialog } from '../components/Dialog.jsx';
import { useRequestStore } from '../store/requests.js';


const TourGuideProfilePage = () =>{
    const {user} = useUserStore();
    const {guide,getGuide,updateGuide} = useGuideStore();
    const [isRequired, setIsRequired] = useState(true);
    const { showDialog } = dialog()
    const handleButtonClick = () => {
        setIsRequired(false);
    };
    
    const [updatedGuide,setUpdatedGuide]= useState({});  
    const handleButtonClickk = async () => {
        if(!isRequired){
           const {success, message}  = await updateGuide(user.userName , updatedGuide);
           success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})

        }
    }
    const navigate = useNavigate();
    const handleRedirect = () => {
        navigate('/itineraryPage');
    };

    useEffect(() => {
        if (user.type !== 'tour guide') {
            navigate('/');
        }
    }, []);

    const [isDeleteVisible, setIsDeleteVisible] = useState(false);
    const { createRequest } = useRequestStore();
    const handleDeleteClick = () => {
        setIsDeleteVisible(!isDeleteVisible);
    };
    const handleDeleteAccountRequest = async () => {
        const deleteRequest = {
          userName: user.userName,
          userType: user.type,
          userID: user._id,
          type: 'delete',
        };
        const { success, message } = await createRequest(deleteRequest);
        console.log(deleteRequest);
        if (success) {
          toast.success('Account deletion request submitted successfully.');
          setIsDeleteVisible(false); // Close the delete dialog
        } else {
          toast.error(message);
        }
      };
      

    return (
        <div className="relative p-10 max-w-3xl mx-auto mt-5 rounded-lg shadow-lg bg-gray-800 text-white">
            <Toaster/>
           <h1>profile</h1>
           <div className="grid">
           <label>NAME : <input type = "text" name='name' defaultValue={guide.userName} style={{color: 'black', backgroundColor: 'white'}} readOnly={isRequired} onChange= {(e) => setUpdatedGuide({ ...updatedGuide, userName: e.target.value})}></input></label>
           <label>Email : <input type = "text" name='email' defaultValue={guide.email} style={{color: 'black', backgroundColor: 'white'}} readOnly={isRequired} onChange={(e) => setUpdatedGuide({ ...updatedGuide, email: e.target.value})}></input></label>
           <label>Mobile number : <input type = "text" name='mobileNumer' defaultValue={guide.mobileNumber} style={{color: 'black', backgroundColor: 'white'}} readOnly={isRequired} onChange={(e) => setUpdatedGuide({ ...updatedGuide, mobileNumber: e.target.value})}></input></label>
           <label>Years of experience : <input type = "Number" name='yearsOfExperiance' defaultValue={guide.yearsOfExperience} style={{color: 'black', backgroundColor: 'white'}} readOnly={isRequired} onChange={(e) => setUpdatedGuide({ ...updatedGuide, yearsOfExperience: e.target.value})}></input></label>
           <label>Previous Work : <input type = "text" name='previousWork' defaultValue={guide.previousWork} style={{color: 'black', backgroundColor: 'white'}} readOnly={isRequired} onChange={(e) => setUpdatedGuide({ ...updatedGuide, previousWork: e.target.value})}></input></label>
           <label>Nationality : <input type = "text" name='nationality' defaultValue={guide.nationality} style={{color: 'black', backgroundColor: 'white'}} readOnly={isRequired} onChange={(e) => setUpdatedGuide({ ...updatedGuide, nationality: e.target.value})}></input></label>
           <label>Date of birth : <input type = "text" name='dateOfBirth' defaultValue={guide.dateOfBirth ? guide.dateOfBirth.split('T')[0] : ""} style={{color: 'black', backgroundColor: 'white'}} readOnly={isRequired} onChange={(e) => setUpdatedGuide({ ...updatedGuide, dateOfBirth: e.target.value})}></input></label>           
           </div>

           <div>
            
            <UploadPicture userType="tourGuide" />

        </div>

           <button className='bg-black text-white m-6 p-2 rounded' onClick={handleButtonClick}>Edit</button> 
           <button className='bg-black text-white m-6 p-2 rounded' onClick={handleButtonClickk}>save</button>
           <button className='bg-black text-white m-6 p-2 rounded' onClick={handleRedirect}>itinerary</button>
           <div>
           <Dialog msg={"Are you sure you want to delete your account?"} accept={() => (console.log("deleted"))} reject={() => (console.log("rejected"))} acceptButtonText='Delete' rejectButtonText='Cancel'/>
           <br />
          <button className='bg-black text-white m-6 p-2 rounded' onClick={handleDeleteClick}>Delete Account</button> 
           {isDeleteVisible && (
            <div className='bg-gray-700 h-fit text-center p-4 w-[23vw] rounded-xl absolute right-0 left-0 top-[20vh] mx-auto'>
            <p>Are you sure you want to request to delete your account?</p>
            <button className="bg-red-500 mt-4 px-4 py-2 rounded" onClick={handleDeleteAccountRequest}>Request</button>
            <button className="bg-red-500 mt-4 px-4 py-2 rounded" onClick={() => setIsDeleteVisible(false)}>Cancel</button>
            </div>
           )}           </div>
        </div>
    );
}

export default TourGuideProfilePage;