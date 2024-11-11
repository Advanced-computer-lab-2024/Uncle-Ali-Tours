import React, { useState,useEffect } from 'react'; 
//import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {useTouristStore} from '../store/tourist'
import { useUserStore } from '../store/user';
import Dialog, { dialog } from '../components/Dialog.jsx';
import { useTagStore } from '../store/tag';
import axios from 'axios';

const TouristProfile = () => {
  

  const {user} = useUserStore();
  const {tourist,getTourist,updateTourist , redeemPoints , badgeLevel} = useTouristStore();
  const [isRequired, setIsRequired] = useState(true);
  const [updatedTourist, setUpdatedTourist] = useState({});
  const [isWalletVisible, setIsWalletVisible] = useState(false);
  const walletMoney = (tourist.myWallet * user.currencyRate).toFixed(2);
  const pointsMoney = ((tourist.myPoints / 100) * user.currencyRate).toFixed(2); // Convert price based on currencyRate
  const [preferences, setPreferences] = useState([]);
  const [badge, setBadge] = useState('');
  const [isRedeemDialogVisible, setIsRedeemDialogVisible] = useState(false);
  const { showDialog } = dialog();
  const [complaints, setComplaints] = useState([]); // State to hold complaints data
  const [showComplaints, setShowComplaints] = useState(false);
  const {tags, getTags} = useTagStore();

  useEffect(() => {
    getTags();
    getTourist({ userName: user.userName }, {});
}, []);

useEffect(() => {
    fetchBadge(); // Ensure the badge level is fetched when the component mounts
}, []);

const fetchBadge = async () => {
    const response = await badgeLevel();
    if (response && response.success) {
        setBadge(response.badge);  // Set the badge in component state
    } else {
        toast.error('Failed to fetch badge level');
    }
};



 // Initialize preferences state from tourist data
 useEffect(() => {
  if (tourist && tourist.myPreferences && tourist.myPreferences.length > 0) {
    console.log("Loaded tourist preferences:", tourist.myPreferences); // Debugging statement
    setPreferences(tourist.myPreferences); // Set initial checked preferences
  }
}, [tourist]);


 
  // 28

  // const [filter, setFilter] = useState({
  //   productName: '',
  //   priceRange: 1000,
  //   rating: 0,
  //   category: '',
  //   budget: '',
  //   date: '',
  //   language: '',
  //   preferences: '',
  //   tags: '',
  // });

  useEffect(() => {
    getTourist({ userName: user.userName }, {});
  }, []);
const handleFetchComplaints = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/complaint/by-creator/${user.userName}`);
    const data = await response.json()
    if (data.success) {
      setComplaints(data.data);
      setShowComplaints(true);
    } else {
      toast.error('No complaints found.');
    }
  } catch (error) {
    console.error('Error fetching complaints:', error);
    toast.error('Failed to fetch complaints.');
  }
};


const handleButtonClick = () => {
  setIsRequired(false);
};
//button product , iternary, activivty , attraction
const handleProfileUpdate = async () => {
  const { success, message } = await updateTourist(user.userName, updatedTourist);
  success ? toast.success(message, { className: "text-white bg-gray-800" }) : toast.error(message, { className: "text-white bg-gray-800" });
};

const handlePreferencesChange = (event) => {
  const { value, checked } = event.target;
  setPreferences((prevPreferences) =>
    checked ? [...prevPreferences, value] : prevPreferences.filter((preference) => preference !== value)
  );
};

const handleSavePreferences = async () => {
  const { success, message } = await updateTourist(user.userName, { myPreferences: preferences });
  if (success) {
    toast.success('Preferences updated successfully!', { className: 'text-white bg-gray-800' });
    window.location.reload();
  } else {
    toast.error(message, { className: 'text-white bg-gray-800' });
  }
};

const handleClearPreferences = async () => {
  try {
    setPreferences([]);
    console.log("Clearing preferences in UI...");

    const { success, message } = await updateTourist(user.userName, { myPreferences: [] });
    if (success) {
      toast.success('Preferences cleared successfully!', { className: 'text-white bg-gray-800' });
      window.location.reload();
    } else {
      toast.error(message || 'Failed to clear preferences.', { className: 'text-white bg-gray-800' });
    }
  } catch (error) {
    console.error('Error clearing preferences:', error);
    toast.error('An error occurred while clearing preferences.', { className: 'text-white bg-gray-800' });
  }
};
  



const handleWalletClick = () => {
  setIsWalletVisible(!isWalletVisible);
};

const handleRedeemClick = () => {
  showDialog();
};


 
  return (
    <div className="relative p-10 max-w-3xl mx-auto mt-5 rounded-lg shadow-lg bg-gray-800 text-white">
       <Toaster/>
           <h1>profile</h1>
           <div className="grid">
           <label>Badge Level: <input type="text" value={badge} readOnly style={{ color: 'black', backgroundColor: 'white' }} /></label> 
           <label>NAME : <input type = "text" name='userName' defaultValue={tourist.userName} style={{color: 'black', backgroundColor: 'white'}} readOnly={isRequired} onChange= {(e) => setUpdatedTourist({ ...updatedTourist, userName: e.target.value})}></input></label>
           <label>Email : <input type = "text" name='email' defaultValue={tourist.email} style={{color: 'black', backgroundColor: 'white'}} readOnly={isRequired} onChange={(e) => setUpdatedTourist({ ...updatedTourist, email: e.target.value})}></input></label>
           <label>Mobile number : <input type = "text" name='mobileNumber' defaultValue={tourist.mobileNumber} style={{color: 'black', backgroundColor: 'white'}} readOnly={isRequired} onChange={(e) => setUpdatedTourist({ ...updatedTourist, mobileNumber: e.target.value})}></input></label>
           <label>occupation : <input type = "text" name='occupation' defaultValue={tourist.occupation} style={{color: 'black', backgroundColor: 'white'}} readOnly={isRequired} onChange={(e) => setUpdatedTourist({ ...updatedTourist, occupation: e.target.value})}></input></label>
          
           <label>Nationality : <input type = "text" name='nationality' defaultValue={tourist.nationality} style={{color: 'black', backgroundColor: 'white'}} readOnly={isRequired} onChange={(e) => setUpdatedTourist({ ...updatedTourist, nationality: e.target.value})}></input></label>
           <label>Date of birth : <input type = "text" name='dateOfBirth' defaultValue={tourist.dateOfBirth ? tourist.dateOfBirth.split('T')[0] : ""} style={{color: 'black', backgroundColor: 'white'}} readOnly={isRequired} onChange={(e) => setUpdatedTourist({ ...updatedTourist, dateOfBirth: e.target.value})}></input></label>   
           
           <Link to='/viewProducts'>
          <button className='bg-black text-white m-6 p-2 rounded' >product</button> </Link> <Link to ='/viewItineraries'> <button className='bg-black text-white m-6 p-2 rounded' >itinerary</button></Link> <Link to='/viewActivities'> <button className='bg-black text-white m-6 p-2 rounded' >activities</button> </Link> <Link to ='/viewAttractions'> <button className='bg-black text-white m-6 p-2 rounded' >attraction</button></Link>
           
           </div>
           <button className='bg-black text-white m-6 p-2 rounded' onClick={handleWalletClick}>Wallet</button>
           {isWalletVisible && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white p-4 rounded shadow-lg">
            <p>You have {walletMoney} {user.chosenCurrency} in your wallet.</p>
            <button className="bg-red-500 mt-4 px-4 py-2 rounded" onClick={() => setIsWalletVisible(false)}>Close</button>
            </div>
           )}
           <Dialog
           msg={`You have ${tourist.myPoints} points. Do you want to redeem these points for ${pointsMoney} ${user.chosenCurrency}?`}
           accept={redeemPoints}
           reject={() => console.log("Redemption canceled")}
           acceptButtonText="Redeem Points"
           rejectButtonText="Cancel"
           />

           <button className='bg-black text-white m-6 p-2 rounded' onClick={handleRedeemClick}>My Points</button>
           <br />
           <button className='bg-black text-white m-6 p-2 rounded' onClick={handleButtonClick}>Edit</button> 
           <button className='bg-black text-white m-6 p-2 rounded' onClick={handleProfileUpdate}>save</button>
           <br />

           <h2>Select Your Vacation Preferences:</h2>
        {tags && tags.length > 0 ? (
          tags.map((tag) => (
            <label key={tag._id || tag.name}>
              <input
                type="checkbox"
                value={tag.name}
                onChange={handlePreferencesChange}
                checked={preferences.includes(tag.name)}
              />
              {tag.name}
            </label>
          ))
        ) : (
          <p>Loading preferences...</p>
        )}
        <br/>
        <button className="bg-black text-white m-6 p-2 rounded" onClick={handleSavePreferences}>Save Preferences</button>
        <button className="bg-red-500 text-white m-6 p-2 rounded" onClick={handleClearPreferences}>Clear All Preferences</button>
        
        <Link to='/viewProducts'><button className='bg-black text-white m-6 p-2 rounded'>Product</button></Link>
        <Link to='/viewItineraries'><button className='bg-black text-white m-6 p-2 rounded'>Itinerary</button></Link>
        <Link to='/viewActivities'><button className='bg-black text-white m-6 p-2 rounded'>Activities</button></Link>
        <Link to='/viewAttractions'><button className='bg-black text-white m-6 p-2 rounded'>Attraction</button></Link>
      
      <button className='bg-black text-white m-6 p-2 rounded' onClick={handleWalletClick}>Wallet</button>
      {isWalletVisible && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white p-4 rounded shadow-lg">
          <p>You have {walletMoney} {user.chosenCurrency} in your wallet.</p>
          <button className="bg-red-500 mt-4 px-4 py-2 rounded" onClick={() => setIsWalletVisible(false)}>Close</button>
        </div>
      )}
      <Dialog
        msg={`You have ${tourist.myPoints} points. Do you want to redeem these points for ${pointsMoney} ${user.chosenCurrency}?`}
        accept={redeemPoints}
        reject={() => console.log("Redemption canceled")}
        acceptButtonText="Redeem Points"
        rejectButtonText="Cancel"
      />

      <button className='bg-black text-white m-6 p-2 rounded' onClick={handleRedeemClick}>My Points</button>
      <br />
      <button className='bg-black text-white m-6 p-2 rounded' onClick={handleButtonClick}>Edit</button>
      <button className='bg-black text-white m-6 p-2 rounded' onClick={handleProfileUpdate}>Save</button>
      
      {/* Complaints Button */}
      <button className='bg-black text-white m-6 p-2 rounded' onClick={handleFetchComplaints}>View Complaints</button>
      {/* Display Complaints */}
      {showComplaints && (
        <div className="mt-4 bg-gray-700 p-4 rounded">
          <h2 className="text-xl mb-2">My Complaints</h2> (
           { complaints.map((complaint) => (
              <div key={complaint._id} className="mb-4 p-3 bg-gray-600 rounded">
                <h3 className="text-lg font-semibold">Title:{complaint.title}</h3>
                <p>Body:{complaint.body}</p>
                <p>Status: {complaint.status}</p>
              </div>
            ))}
          )
        </div>
      )}
      <Link to='/transportationActivity'>
      <button className='bg-black text-white m-6 p-2 rounded' >Transportation Activity</button> </Link>
    </div>
  );
};    

export default TouristProfile;
