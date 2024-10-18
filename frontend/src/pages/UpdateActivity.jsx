import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useItineraryStore } from '../store/activity';
import { useTagStore } from '../store/tag';
import { useUserStore } from '../store/user';

const UpdateActivity = () => {
  const { activityId } = useParams(); // Get the activity ID from URL params
  const history = useHistory();

  // State to hold the updated activity data
  const [activityData, setActivityData] = useState({
    name: '',
    date: '',
    time: '',
    price: '',
    category: '',
    bookingOpen: false,
    creator: '',
    tags: [],
    specialDiscounts: '',
  });

  const [tagsFields, setTagsFields] = useState([]);
  const [error, setError] = useState(null);

  // Fetch the existing activity details when component loads
  useEffect(() => {
    fetch(`/api/activities/${activityId}`)
      .then((response) => response.json())
      .then((data) => {
        setActivityData({
          ...data,
          tags: data.tags || [],
        });
        setTagsFields(data.tags || []);
      })
      .catch((error) => {
        setError('Failed to load activity data.');
        console.error(error);
      });
  }, [activityId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setActivityData({
      ...activityData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle tags field input
  const handleTagChange = (index, value) => {
    const newTags = [...tagsFields];
    newTags[index] = value;
    setTagsFields(newTags);
    setActivityData({ ...activityData, tags: newTags });
  };

  // Add new tag field
  const addTagField = () => {
    setTagsFields([...tagsFields, '']);
  };

  // Remove a tag field
  const removeTagField = (index) => {
    const newTags = tagsFields.filter((_, i) => i !== index);
    setTagsFields(newTags);
    setActivityData({ ...activityData, tags: newTags });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // API call to update the activity
    fetch(`/api/activities/${activityId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update activity');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Activity updated successfully', data);
        history.push(`/activities/${activityId}`); // Redirect to the updated activity page
      })
      .catch((error) => {
        setError('Failed to update activity');
        console.error(error);
      });
  };

  return (
    <div className="update-activity-container">
      <h1>Update Activity</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={activityData.name}
          placeholder="Activity Name"
          onChange={handleInputChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
          required
        />

        <input
          type="date"
          name="date"
          value={activityData.date}
          onChange={handleInputChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
          required
        />

        <input
          type="text"
          name="time"
          value={activityData.time}
          onChange={handleInputChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
          required
        />

        <input
          type="text"
          name="price"
          value={activityData.price}
          onChange={handleInputChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
          required
        />

        <input
          type="text"
          name="category"
          value={activityData.category}
          onChange={handleInputChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
          required
        />

        <label className="inline-flex items-center mb-4">
          <input
            type="checkbox"
            name="bookingOpen"
            checked={activityData.bookingOpen}
            onChange={handleInputChange}
            className="form-checkbox h-5 w-5 text-indigo-600"
          />
          <span className="ml-2">Is Booking Open?</span>
        </label>

        <input
          type="text"
          name="creator"
          value={activityData.creator}
          placeholder="Creator"
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
              onChange={(e) => handleTagChange(index, e.target.value)}
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
          value={activityData.specialDiscounts}
          placeholder="Special Discounts"
          onChange={handleInputChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Update Activity
        </button>
      </form>
    </div>
  );
};

export default UpdateActivity;
