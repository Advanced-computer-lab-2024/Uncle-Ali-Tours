import React, { useState, useRef } from 'react';
import { useActivityStore } from '../store/activity'; 
import toast, { Toaster } from 'react-hot-toast';
import { useUserStore } from '../store/user'; // Assuming user store for activity creator

function CreateActivity() {
  const { user } = useUserStore(); // Assuming user is logged in and available
  const { createActivity } = useActivityStore(); 
  const [newActivity, setNewActivity] = useState({
    name: '',
    date: '',
    time: '',
    location: {
      type: 'Point',
      coordinates: [0, 0], // Default coordinates for GeoJSON
    },
    price: '',
    category: '',
    tags: [],
    specialDiscounts: '',
    bookingOpen: false,
    creator: user?.userName, // Assuming the user's name is used as the creator
  });

  console.log("user " , user?.userName || "")

  const [tagsFields, setTagsFields] = useState([]);
  const autocompleteRef = useRef(null);

  // Handle input changes for general fields
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewActivity({
      ...newActivity,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle location input via Google Maps Autocomplete
  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setNewActivity({
      ...newActivity,
      location: { type: 'Point', coordinates: [lng, lat] },
    });
  };

  // Add or remove tag fields dynamically
  const addTagField = () => setTagsFields([...tagsFields, '']);
  const removeTagField = (index) => setTagsFields(tagsFields.filter((_, idx) => idx !== index));

  // Handle creating activity
  const handleCreateActivity = async (e) => {
    e.preventDefault();
    const finalActivity = { ...newActivity, tags: tagsFields };
    const { success, message } = await createActivity(finalActivity);

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
        creator: user?.userName,
      });
      setTagsFields([]); // Clear tag fields after creation
    } else {
      toast.error(message, { className: 'text-white bg-gray-800' });
    }
  };

  return (
    <div className="container mx-auto p-6">
      
      <h1 className="text-3xl font-bold text-center mb-6">Create New Activity</h1>

      {/* Form to create new activity */}
      <form onSubmit={handleCreateActivity} className="bg-white p-6 shadow-md rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Activity Information</h2>

        <input
          type="text"
          name="name"
          value={newActivity.name}
          placeholder="Activity Name"
          onChange={handleInputChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
          required
        />

        <input
          type="date"
          name="date"
          value={newActivity.date}
          onChange={handleInputChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
          required
        />

        <input
          type="text"
          name="time"
          value={newActivity.time}
          onChange={handleInputChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
          required
        />


            
            <input
              type="text"
              name="location"
              placeholder="Enter location"
              className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
              required
            /> 
          

        <input
          type="text"
          name="price"
          placeholder="Price"
          value={newActivity.price}
          onChange={handleInputChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newActivity.category}
          onChange={handleInputChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
          required
        />
        
        
        

        {/* Tags Section */}
        <h3 className="text-lg font-semibold mb-2">Tags</h3>
        {tagsFields.map((field, index) => (
          <div key={index} className="mb-4 flex">
            <input
              type="text"
              value={field}
              placeholder={`Tag ${index + 1}`}
              className="block w-full p-2 border border-gray-300 rounded-lg mr-2"
              onChange={(e) => {
                const newTags = [...tagsFields];
                newTags[index] = e.target.value;
                setTagsFields(newTags);
              }}
            />
            <button
              type="button"
              onClick={() => removeTagField(index)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addTagField}
          className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-green-600"
        >
          Add Tag
        </button>

        <input
          type="text"
          name="specialDiscounts"
          placeholder="Special Discounts"
          value={newActivity.specialDiscounts}
          onChange={handleInputChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
        />

        <label className="inline-flex items-center mb-4">
          <input
            type="checkbox"
            name="bookingOpen"
            checked={newActivity.bookingOpen}
            onChange={handleInputChange}
            className="form-checkbox h-5 w-5 text-indigo-600"
          />
          <span className="ml-2">Is Booking Open?</span>
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

export default CreateActivity;
