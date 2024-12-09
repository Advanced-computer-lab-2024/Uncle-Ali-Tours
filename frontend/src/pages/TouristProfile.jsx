import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaCheck, FaEdit } from 'react-icons/fa';
import { IoSaveOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import Dialog, { dialog } from '../components/Dialog.jsx';
import BronzeBadge from '../images/bronze.png';
import egypt from '../images/egypt.jpg';
import GoldBadge from '../images/gold.png';
import SilverBadge from '../images/silver.png';
import { useTagStore } from '../store/tag';
import { useTouristStore } from '../store/tourist';
import { useUserStore } from '../store/user';

const TouristProfilePage = () => {
  const { user } = useUserStore();
  const { tourist, getTourist, updateTourist, redeemPoints, badgeLevel, fetchUpcomingItems } = useTouristStore();
  const { tags, getTags } = useTagStore();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTourist, setUpdatedTourist] = useState({});
  const [preferences, setPreferences] = useState([]);
  const [badge, setBadge] = useState('');
  const [upcomingItineraries, setUpcomingItineraries] = useState(0);
  const [upcomingActivities, setUpcomingActivities] = useState(0);
  const [upcomingTActivities, setUpcomingTActivities] = useState(0);
  const { showDialog } = dialog();

  const handleRedeemClick = () => {
    showDialog();
  };

  useEffect(() => {
    if (user && user.userName) {
      getTourist({ userName: user.userName }, {});
      getTags();
      fetchBadge();
      fetchUpcomingData();
    }
  }, [user.userName]);  // Add user.userName as a dependency
  

  useEffect(() => {
    if (tourist && tourist.myPreferences) {
      setPreferences(tourist.myPreferences);
    }
  }, [tourist]);

  const fetchBadge = async () => {
    const response = await badgeLevel();
    if (response && response.success) {
      setBadge(response.badge);
    }
  };

  const fetchUpcomingData = async () => {
    try {
      const [itineraries, activities , tActivities] = await Promise.all([
        fetchUpcomingItems(user.userName , 'itinerary'),
        fetchUpcomingItems(user.userName , 'activity'),
        fetchUpcomingItems(user.userName , 'tActivity')
      ]);
  
      setUpcomingItineraries(itineraries.length || 0);
      setUpcomingActivities(activities.length || 0);
      setUpcomingTActivities(tActivities.length || 0);
    } catch (error) {
      console.error("Error fetching upcoming data:", error.message);
      setUpcomingItineraries(0);
      setUpcomingActivities(0);
      setUpcomingTActivities(0);
    }
  };
  

  const handleSaveClick = async () => {
    setIsEditing(false);
    if (Object.keys(updatedTourist).length) {
      const { success, message } = await updateTourist(user.userName, updatedTourist);
      success
        ? toast.success(message, { className: "text-white bg-gray-800" })
        : toast.error(message, { className: "text-white bg-gray-800" });
    }
  };

  const handlePreferenceToggle = async (tagName) => {
    const updatedPreferences = preferences.includes(tagName)
      ? preferences.filter((pref) => pref !== tagName)
      : [...preferences, tagName];

    setPreferences(updatedPreferences);
    const { success, message } = await updateTourist(user.userName, { myPreferences: updatedPreferences });
    success
      ? toast.success('Preferences updated successfully!', { className: 'text-white bg-gray-800' })
      : toast.error(message, { className: 'text-white bg-gray-800' });
  };

  const getBadgeImage = () => {
    switch (badge) {
      case 'level 2': return SilverBadge;
      case 'level 3': return GoldBadge;
      default: return BronzeBadge;
    }
  };

  const walletMoney = ((tourist.myWallet || 0) * user.currencyRate).toFixed(2);
  const pointsMoney = (((tourist.myPoints || 0) / 100) * user.currencyRate).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      
      <img src={egypt} className="fixed top-0 left-0 w-full h-full object-cover opacity-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 sm:p-10">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">Tourist Profile</h1>
              <img src={getBadgeImage()} alt={`${badge} badge`} className="h-16 w-16" />
            </div>
          </div>
          
          <div className="p-6 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
                {['userName', 'email', 'mobileNumber', 'nationality', 'dateOfBirth', 'occupation'].map((field) => (
                  <div key={field} className="flex items-center justify-between">
                    <span className="text-gray-600 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <input
                      type={field === 'dateOfBirth' ? 'date' : 'text'}
                      name={field}
                      defaultValue={
                        field === 'dateOfBirth' && tourist[field]
                          ? new Date(tourist[field]).toISOString().split('T')[0] 
                          : tourist[field] || ''
                      }                      
                      className={`${isEditing ? 'bg-gray-100' : 'bg-transparent'} transition-colors focus:outline-none border-b border-gray-300 px-2 py-1 w-2/3 text-right`}
                      readOnly={!isEditing}
                      onChange={(e) => setUpdatedTourist({ ...updatedTourist, [field]: e.target.value })}
                    />
                  </div>
                ))}
                {!isEditing ? (
                  <button className="text-orange-500 hover:text-orange-600 transition-colors" onClick={() => setIsEditing(true)}>
                    <FaEdit size={20} />
                  </button>
                ) : (
                  <button className="text-green-500 hover:text-green-600 transition-colors" onClick={handleSaveClick}>
                    <IoSaveOutline size={20} />
                  </button>
                )}
              </div>
              <Dialog
              msg={"Are you sure you want to redeem these points"}
              accept={redeemPoints}
              reject={() => console.log("Redeem canceled")}
              acceptButtonText='Redeem'
              rejectButtonText='Cancel'
            />
              <div className="space-y-6">
                <div className="bg-gray-100 p-6 rounded-lg shadow">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Wallet & Points</h2>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Wallet Balance:</span>
                    <span className="text-2xl font-bold text-green-600">{walletMoney} {user.chosenCurrency}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Points:</span>
                    <span className="text-2xl font-bold text-blue-600">{tourist.myPoints || 0}</span>
                  </div>
                  <button 
                    className="mt-4 w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors"
                    onClick={handleRedeemClick}
                  >
                    Redeem Points ({pointsMoney} {user.chosenCurrency})
                  </button>
                </div>
                
                <div className="bg-gray-100 p-6 rounded-lg shadow">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Itineraries:</span>
                    <span className="text-2xl font-bold text-purple-600">{upcomingItineraries}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Activities:</span>
                    <span className="text-2xl font-bold text-indigo-600">{upcomingActivities}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Transportation Activities:</span>
                    <span className="text-2xl font-bold text-indigo-600">{upcomingTActivities}</span>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <Link to="/upcomingItineraries" className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors">
                      View Itineraries
                    </Link>
                    <Link to="/upcomingActivities" className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition-colors">
                      View Activities
                    </Link>
                    <Link to="/upcomingTActivities" className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition-colors">
                      View Transportation Activities
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Preferences</h2>
              <div className="flex flex-wrap gap-2">
                {tags && tags.map((tag) => (
                  <button
                    key={tag._id || tag.name}
                    onClick={() => handlePreferenceToggle(tag.name)}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      preferences.includes(tag.name)
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } transition-colors`}
                  >
                    {tag.name}
                    {preferences.includes(tag.name) && <FaCheck className="inline-block ml-2" />}
                  </button>
                ))}
              </div>
            </div>
            <br/>
            <p>Here is a link for a video demo on how to use the website: https://drive.google.com/drive/folders/11bVsJ2HgrXGTd6EOkQgqL3WPJ9YkvCob?usp=sharing </p>
          </div>
        </div>
      </div>
    </div>

    
  );
};

export default TouristProfilePage;

