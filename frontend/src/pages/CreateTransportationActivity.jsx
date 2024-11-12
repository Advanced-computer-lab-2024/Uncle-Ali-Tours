import React, { useState, useRef } from 'react';
import { useTransportationActivityStore } from '../store/transportationActivity';
import toast, { Toaster } from 'react-hot-toast';
import { useUserStore } from '../store/user'; // Assuming user store for activity creatoer

function CreateTransportationActivity() {
        const user = JSON.parse(localStorage.getItem("user")); // Assuming user is logged in and available
        const { createTransportationActivity } = useTransportationActivityStore(); 
        const [newActivity, setNewActivity] = useState({
          name: '',
          date: '',
          time: '',
          pickUpLocation:'',
          dropOfLocation:'',
          price: '',
          bookingOpen: false,
          creator: user?.userName || '', // Assuming the user's name is used as the creator
        });
      
        const autocompleteRef = useRef(null);
      
        // Handle input changes for general fields
        const handleInputChange = (e) => {
          const { name, value, type, checked } = e.target;
          setNewActivity({
            ...newActivity,
            [name]: type === 'checkbox' ? checked : value,
          });
        };
      
      
        // Handle creating activity
        const handleCreateActivity = async (e) => {
          e.preventDefault();
        //   const finalActivity = { ...newActivity, tags: tagsFields };
        if(user.type !== "advertiser"){
            return toast.error("you are not alloewd to create an activity" , { className: 'text-white bg-gray-800' });
        }
          const { success, message } = await createTransportationActivity(newActivity);
      
          if (success) {
            toast.success(message, { className: 'text-white bg-gray-800' });
            setNewActivity({
              name: '',
              date: '',
              time: '',
              location: { type: 'Point', coordinates: [0, 0] },
              price: '',
              category: '',
              tags: [],
              specialDiscounts: '',
              bookingOpen: false,
              creator: user?.userName || '',
            });
          } else {
            toast.error(message, { className: 'text-white bg-gray-800' });
          }
        };
      
        return (
          <div className="container mx-auto p-6">
            <Toaster />
            <h1 className="text-3xl font-bold text-center mb-6">Create New Transportation Activity</h1>
      
            {/* Form to create new activity */}
            <form onSubmit={handleCreateActivity} className="bg-white p-6 shadow-md rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-4">Activity Information</h2>
      
              <input
                type="text"
                name="name"
                value={newActivity.name}
                placeholder="Activity Name"
                onChange={handleInputChange}
                className="block w-full p-2 mb-4 border border-gray-300 rounded-lg text-black"
                required
              />
      
              <input
                type="date"
                name="date"
                value={newActivity.date}
                placeholder="date"
                onChange={handleInputChange}
                className="block w-full p-2 mb-4 border border-gray-300 rounded-lg text-black"
                required
              />
      
              <input
                type="text"
                name="time"
                value={newActivity.time}
                placeholder="time"
                onChange={handleInputChange}
                className="block w-full p-2 mb-4 border border-gray-300 rounded-lg text-black"
                required
              />
                <input
                type="text"
                name="pickUpLocation"
                value={newActivity.pickUpLocation}
                placeholder="pick up location"
                onChange={handleInputChange}
                className="block w-full p-2 mb-4 border border-gray-300 rounded-lg text-black"
                required
              />
              <input
                type="text"
                name="dropOfLocation"
                value={newActivity.dropOfLocation}
                placeholder="drop of location"
                onChange={handleInputChange}
                className="block w-full p-2 mb-4 border border-gray-300 rounded-lg text-black"
                required
              />
              <input
                type="text"
                name="price"
                placeholder="Price"
                value={newActivity.price}
                onChange={handleInputChange}
                className="block w-full p-2 mb-4 border border-gray-300 rounded-lg text-black"
                required
              />
      
              
              {/* <input
                type="text"
                name="creator"
                placeholder="Creator"
                value={newActivity.creator}
                onChange={handleInputChange}
                className="block w-full p-2 mb-4 border border-gray-300 rounded-lg text-black"
                required
              /> */}
      
      
      
              <label className="inline-flex items-center mb-4">
                <input
                  type="checkbox"
                  name="bookingOpen"
                  checked={newActivity.bookingOpen}
                  onChange={handleInputChange}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <span className="ml-2 text-black">Is Booking Open?</span>
              </label>
      
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Create Activity
              </button>
            </form>
          </div>
        );
      }
      
      export default CreateTransportationActivity;