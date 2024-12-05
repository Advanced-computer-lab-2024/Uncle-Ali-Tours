import React, { useEffect, useState } from 'react';
//import React, { useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Dialog, { dialog } from '../components/Dialog.jsx';
import { useRequestStore } from '../store/requests.js';
import { useTagStore } from '../store/tag';
import { useTouristStore } from '../store/tourist';
import { useUserStore } from '../store/user';
import TouristPromos from '../components/TouristPromos.jsx';
import { FiLoader } from 'react-icons/fi';
import { FaEye, FaEdit } from "react-icons/fa";
import { IoSaveOutline } from "react-icons/io5";
import BronzeBadge from '../images/bronze.png';
import SilverBadge from '../images/silver.png';
import GoldBadge from '../images/gold.png';

const TouristProfile = ({ userName }) => {
  const {user} = useUserStore();
  const {tourist,getTourist,updateTourist , redeemPoints , badgeLevel ,fetchUpcomingActivities, fetchUpcomingItineraries} = useTouristStore();
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
  const [showComplaints, setShowComplaints] = useState(false); // Toggle display
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const { createRequest } = useRequestStore();
  const {tags, getTags} = useTagStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [upcomingItineraries,setUpcomingItineraries]= useState(0);
  const [upcomingActivities,setUpcomingActivities]= useState(0);
  

  useEffect(() => {
    // Trigger the check when the profile page loads
    const checkNotifications = async () => {
        try {
            // Make GET request to check for upcoming itineraries
            const response = await axios.get(`/api/tourist/${userName}/check-upcoming-itinerary`);

            // If the server responds with success
            if (response.data.success) {
                console.log(response.data.message);  // Notification sent successfully
            } else {
                console.log(response.data.message);  // No notification needed
            }
        } catch (error) {
            console.error("Error checking upcoming itinerary notifications:", error);
        }
    };

    // Call the function to check for notifications when the component mounts
    checkNotifications();
}, [userName]);  // The effect will rerun if userName changes


  // Function to check if an event is within the next 2 days
  const isEventStartingInTwoDays = (eventDate) => {
    const now = new Date();
    const twoDaysLater = new Date(now);
    twoDaysLater.setDate(now.getDate() + 2);

   
    return eventDate >= now && eventDate <= twoDaysLater;
  };

  
  const checkForUpcomingEvents = () => {
    upcomingItineraries.forEach((itinerary) => {
      const itineraryDate = new Date(itinerary.startDate);
      if (isEventStartingInTwoDays(itineraryDate)) {
        toast(`Your upcoming itinerary "${itinerary.title}" starts in 2 days!`);
      }
    });

    upcomingActivities.forEach((activity) => {
      const activityDate = new Date(activity.startDate);
      if (isEventStartingInTwoDays(activityDate)) {
        toast(`Your upcoming activity "${activity.title}" starts in 2 days!`);
      }
    });
  };

  
  useEffect(() => {
    const fetchData = async () => {
      const itineraries = await fetchUpcomingItineraries(user.userName);
      const activities = await fetchUpcomingActivities(user.userName);
      setUpcomingItineraries(itineraries);
      setUpcomingActivities(activities);
    };

    fetchData();
  }, []);

  
  useEffect(() => {
    if (upcomingItineraries.length || upcomingActivities.length) {
      checkForUpcomingEvents();
    }
  }, [upcomingItineraries, upcomingActivities]);

  
  
  useEffect(() => {
    getTags();
}, []);

useEffect(() => {
    fetchBadge(); 
}, []);

const fetchBadge = async () => {
    const response = await badgeLevel();
    if (response && response.success) {
        setBadge(response.badge);  // Set the badge in component state
    } else {
        toast.error('Failed to fetch badge level');
    }
};
useEffect(() => {
  // Fetch itineraries and activities when the component mounts
  const fetchData = async () => {
    const itineraries = await fetchUpcomingItineraries(user.userName);
    const activities = await fetchUpcomingActivities(user.userName);

    setUpcomingItineraries(itineraries.length); // Update state with number of itineraries
    setUpcomingActivities(activities.length); // Update state with number of activities
  };

  fetchData();
}, []);


const handleRedirect1 = () => {
  navigate('/touristviewitineraries');
};
const handleRedirect2 = () => {
  navigate('/touristviewactivities');
};
 // Initialize preferences state from tourist data
 useEffect(() => {
  if (tourist && tourist.myPreferences && tourist.myPreferences.length > 0) {
    console.log("Loaded tourist preferences:", tourist.myPreferences); // Debugging statement
    setPreferences(tourist.myPreferences); // Set initial checked preferences
  }
}, [tourist]);
  useEffect(() => {
    getTourist({ userName: user.userName }, {});
  }, []);
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
const handleDeleteClick = () => {
  setIsDeleteVisible(!isDeleteVisible);
};
const handleRedeemClick = () => {
  showDialog();
};

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

const handleSaveClick = async () => {
  setIsEditing(false);
  if (!Object.keys(updatedTourist).length) return;
  const { success, message } = await updateTourist(
    user.userName,
    updatedTourist
  );
  console.log(updatedTourist);
  success
    ? toast.success(message, { className: "text-white bg-gray-800" })
    : toast.error(message, { className: "text-white bg-gray-800" });
};
const getBadgeImage = () => {
  switch (badge) {
    case 'level 2':
      return SilverBadge;
    case 'level 3':
      return GoldBadge;
    default:
      return BronzeBadge; 
  }
};


// if(!tourist.userName) return <FiLoader size={50} className="animate-spin mx-auto mt-[49vh]" />;
 
  return (
    <div className="flex w-full mt-12 justify-around">
    <Toaster />
      <div className="flex flex-col gap-[6vh] justify-start"> 
        <div className="flex gap-[6vw] justify-around"> 
         <div className="relative p-6 w-fit backdrop-blur-lg bg-[#161821f0] h-[68vh] max-w-3xl rounded-lg shadow-lg text-white left-[-20%]"> 
         <div className="absolute top-[-25px] left-[50%] transform -translate-x-[50%] w-24 h-24">
          <img src={getBadgeImage()} alt={`${badge} badge`} className="h-full w-full object-contain" />
         </div>
         <br />
          <div className="space-y-4 flex flex-col justify-around h-[22vh] justify-items-start "> 
              <div className="flex justify-between"> 
                <p className="text-center my-auto">Name: </p>
                <input
                  type="text"
                  name="name"
                  defaultValue={tourist.userName || ""}
                  className={`bg-transparent h-[2.3ch] w-[21ch] border-none text-white border border-gray-600 my-4 focus:outline-none rounded-md px-2 py-2`}
                  readOnly={true}
                  onChange={(e) =>
                    updateTourist(tourist.userName, { userName: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-between">
                <p className="text-center my-auto">Email:</p>
                <input
                  type="text"
                  name="email"
                  defaultValue={tourist.email || ""}
                  className={`${
                    isEditing ? "bg-gray-800" : "bg-transparent"
                  } transition-colors focus:outline-none h-[2.3ch] w-[21ch] border-none text-white border border-gray-600 my-4 rounded-md px-2 py-2`}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    updateTourist(tourist.userName, { email: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-between">
                <p className="text-center my-auto">Mobile:</p>
                <input
                  type="number"
                  name="mobileNumber"
                  defaultValue={tourist.mobileNumber || ""}
                  className={`${
                    isEditing ? "bg-gray-800" : "bg-transparent"
                  } transition-colors focus:outline-none h-[2.3ch] w-[21ch] border-none text-white border border-gray-600 my-4 rounded-md px-2 py-2`}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    setUpdatedTourist({
                      ...updatedTourist,
                      mobileNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-between">
                <p className="text-center my-auto">Nationality:</p>
                <input
                  type="text"
                  name="nationality"
                  defaultValue={tourist.nationality || ""}
                  className={`${
                    isEditing ? "bg-gray-800" : "bg-transparent"
                  } transition-colors focus:outline-none h-[2.3ch] w-[21ch] border-none text-white border border-gray-600 my-4 rounded-md px-2 py-2`}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    setUpdatedTourist({
                      ...updatedTourist,
                      nationality: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-between">
              <p className="text-center my-auto">Date Of Birth:</p>
              <input
                type="text"
                name="dateOfBirth"
                defaultValue={
                  tourist.dateOfBirth
                    ? new Date(tourist.dateOfBirth).toLocaleDateString('en-GB') // Display format
                    : ""
                }
                className={`${
                  isEditing ? "bg-gray-800" : "bg-transparent"
                } transition-colors focus:outline-none h-[2.3ch] w-[21ch] border-none text-white border border-gray-600 my-4 rounded-md px-2 py-2`}
                readOnly={!isEditing}
                onChange={(e) => {
                  const dateInput = e.target.value;
                  const [day, month, year] = dateInput.split('/');
                  
                  // Ensure the input has valid parts
                  if (day && month && year) {
                    const formattedDate = new Date(`${year}-${month}-${day}`);
                    if (!isNaN(formattedDate)) {
                      setUpdatedTourist({
                        ...updatedTourist,
                        dateOfBirth: formattedDate.toISOString(), // Save in ISO format
                      });
                    } else {
                      console.error("Invalid date format entered.");
                    }
                  }
                }}
              />
            </div>

              <div className="flex justify-between">
                <p className="text-center my-auto">Occupation:</p>
                <input
                  type="text"
                  name="occupation"
                  defaultValue={tourist.occupation || ""}
                  className={`${
                    isEditing ? "bg-gray-800" : "bg-transparent"
                  } transition-colors focus:outline-none h-[2.3ch] w-[21ch] border-none text-white border border-gray-600 my-4 rounded-md px-2 py-2`}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    setUpdatedTourist({
                      ...updatedTourist,
                      occupation: e.target.value,
                    })
                  }
                />
              </div>
              {!isEditing ? (
                <button
                  className="mb-4 w-fit focus:outline-none"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit />
                </button>
              ) : (
                <button
                  className="mb-4 w-fit focus:outline-none"
                  onClick={handleSaveClick}
                >
                  <IoSaveOutline />
                </button>
              )}
              
            </div>
            <Dialog
              msg={`You have ${tourist.myPoints} points. Do you want to redeem these points for ${pointsMoney} ${user.chosenCurrency}?`}
              accept={redeemPoints}
              reject={() => console.log("Redemption canceled")}
              acceptButtonText="Redeem Points"
              rejectButtonText="Cancel"
              />
          </div>
          <div className="relative p-6 w-fit backdrop-blur-lg bg-[#161821f0] h-[37vh] max-w-3xl rounded-lg shadow-lg text-white justify-between"> 
            <div className="flex-1 flex flex-col justify-center items-center border-b border-white">
              <h3 className="text-xl font-bold mb-2">Wallet</h3>
              <p className="text-2xl">{walletMoney} {user.chosenCurrency}</p>
              <br/>
            </div>
            
            <div className="flex-1 flex flex-col justify-center items-center mt-4">
              <p className="text-2xl mb-2">{tourist.myPoints} points</p>

              <button 
                className="bg-green-700 text-white cursor-pointer py-2 px-2 rounded hover:bg-green-600 transition-colors mt-2"
                onClick={handleRedeemClick}
              >
                Redeem Points
              </button>
            </div>
          </div>
          <div className="relative p-6 w-fit backdrop-blur-lg bg-[#161821f0] h-[37vh] max-w-3xl rounded-lg shadow-lg text-white justify-right"> 
            <TouristPromos userName={user.userName} />
          </div>
        </div>
        <div className="relative py-4 px-10 w-[45vw] h-[25vh] backdrop-blur-lg bg-[#161821f0] mb-12 h-fit rounded-lg shadow-lg text-white left-[25%] transform -translate-y-[125%] flex">
        <div className="flex-1 flex items-center justify-center relative">
          <div className="text-center">
            <p className="text-lg font-bold">Upcoming Itineraries</p>
            <p className="text-xl mt-2">{upcomingItineraries}</p>
            <Link to="/upcomingItineraries" className="mx-2 relative">
              <button className="bg-green-700 text-white cursor-pointer py-2 px-2 rounded hover:bg-green-600 transition-colors mt-2">view</button>
            </Link> 
          </div>
          <div className="absolute right-0 h-[80%] w-[1px] bg-white"></div>
          </div>
          <div className="flex-1 flex items-center justif y-center relative">
            <div className="text-center w-[100%]">
              <p className="text-lg font-bold">Upcoming Activities</p>
              <p className="text-xl mt-2">{upcomingActivities}</p>
              <Link to="/upcomingActivities" className="mx-2 relative">
              <button className="bg-green-700 text-white cursor-pointer py-2 px-2 rounded hover:bg-green-600 transition-colors mt-2">view</button>
              </Link> 
            </div>
            <div className="absolute right-0 h-[80%] w-[1px] bg-white"></div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-bold">Current Orders</p>
            </div>
          </div>
        </div>
        <div className="flex w-full mt-12 justify-around">
      <Toaster />
      <div className="flex flex-col gap-[6vh] justify-start">
        <div className="relative py-4 px-10 w-[45vw] h-[25vh] backdrop-blur-lg bg-[#161821f0] mb-12 h-fit rounded-lg shadow-lg text-white left-[25%] transform -translate-y-[125%] flex">
          <div className="flex-1 flex items-center justify-center relative">
            <div className="text-center">
              <p className="text-lg font-bold">Upcoming Itineraries</p>
              <p className="text-xl mt-2">{upcomingItineraries.length}</p>
              <button
                onClick={() => navigate('/touristviewitineraries')}
                className="bg-green-700 text-white cursor-pointer py-2 px-2 rounded hover:bg-green-600 transition-colors mt-2"
              >
                View
              </button>
            </div>
          </div>
          <div className="absolute right-0 h-[80%] w-[1px] bg-white"></div>
          <div className="flex-1 flex items-center justify-center relative">
            <div className="text-center">
              <p className="text-lg font-bold">Upcoming Activities</p>
              <p className="text-xl mt-2">{upcomingActivities.length}</p>
              <button
                onClick={() => navigate('/touristviewactivities')}
                className="bg-green-700 text-white cursor-pointer py-2 px-2 rounded hover:bg-green-600 transition-colors mt-2"
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

      </div>
    </div>

    
  );
};    

export default TouristProfile;
