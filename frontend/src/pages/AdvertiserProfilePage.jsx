import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/user'; 

const AdvertiserProfile = () => {
    const { user } = useUserStore(); 
    const [name, setName] = useState('Joe Doe'); 
    const [description, setDescription] = useState('I am a verified Advertiser');
    const [isEditing, setIsEditing] = useState(false); 

    useEffect(() => {
        if (user && user.userName) {
            setName(user.userName); 
        }
    }, [user]); 

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const toggleEditProfile = () => {
        setIsEditing(!isEditing); 
    };

    const handleDeleteProfile = () => {
        console.log('Delete Profile clicked');
    };

    const handleViewProducts = () => {
        console.log('View Products clicked');
    };

    return (
        <div className="relative p-10 max-w-3xl mx-auto mt-5 rounded-lg shadow-lg bg-gray-800 text-white">
            {/* Green Verified Banner */}
            <div className="absolute top-0 right-0 p-2 bg-green-500 text-white text-sm font-bold rounded-bl-lg">
                Verified
            </div>

            <div className="flex items-center border-b border-gray-600 pb-5 mb-5">
                <div className="w-24 h-24 rounded-full bg-gray-900 mr-5"></div> {/* Placeholder for profile picture */}
                <div>
                    <h1 className="text-white text-2xl font-bold">{name}</h1> {/* Display the name from the store */}
                    <h2 className="text-gray-400 text-xl">Advertiser</h2>
                </div>
            </div>
            
            <div className="p-5 bg-gray-800 rounded-md shadow-sm mt-5">
                <h3 className="text-lg font-semibold mb-3 text-white">About</h3>
                {isEditing ? (
                    <div>
                        <textarea
                            value={description}
                            onChange={handleDescriptionChange}
                            rows="4"
                            className="w-full rounded-md p-2 border border-gray-600 bg-gray-900 text-white"
                        />
                    </div>
                ) : (
                    <p className="text-white text-lg">{description}</p>
                )}
            </div>

            <div className="flex justify-between mt-5">
                <button 
                    className="px-5 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300" 
                    onClick={toggleEditProfile}
                >
                    {isEditing ? 'Save' : 'Edit Profile'}
                </button> 
                <div className="flex space-x-4">
                    {/* Products Button */}
                    <button 
                        className="px-5 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300" 
                        onClick={handleViewProducts}
                    >
                        Products
                    </button>
                    {/* Delete Profile Button */}
                    <button 
                        className="px-5 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300" 
                        onClick={handleDeleteProfile}
                    >
                        Delete Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdvertiserProfile;
