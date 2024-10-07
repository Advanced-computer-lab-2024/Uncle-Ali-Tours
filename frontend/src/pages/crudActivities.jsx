import React, { useState, useRef } from 'react';
function ActivitiesPage() {
  // State for storing activities
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    date: '',
    time: '',
    location: '',
    price: '',
    categoryTags: '',
    specialDiscounts: '',
    bookingOpen: false,
  });
  const [editingActivity, setEditingActivity] = useState(null);
  const autocompleteRef = useRef(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewActivity({
      ...newActivity,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle location input (from Google Maps Autocomplete)
  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    setNewActivity({
      ...newActivity,
      location: place.formatted_address,
    });
  };

  // Create new activity
  const handleCreate = (e) => {
    e.preventDefault();
    setActivities([...activities, { ...newActivity, id: Date.now() }]);
    setNewActivity({
      date: '',
      time: '',
      location: '',
      price: '',
      categoryTags: '',
      specialDiscounts: '',
      bookingOpen: false,
    });
  };

  // Update existing activity
  const handleUpdate = (e) => {
    e.preventDefault();
    setActivities(
      activities.map((activity) =>
        activity.id === editingActivity.id ? editingActivity : activity
      )
    );
    setEditingActivity(null);
  };

  // Delete activity
  const handleDelete = (id) => {
    setActivities(activities.filter((activity) => activity.id !== id));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Advertise an Activity</h1>

      {/* Create New Activity Form */}
      <form onSubmit={handleCreate} className="bg-white p-6 shadow-md rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Activity</h2>
        
        <input
          type="date"
          name="date"
          value={newActivity.date}
          onChange={handleInputChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
          required
        />

        <input
          type="time"
          name="time"
          value={newActivity.time}
          onChange={handleInputChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
          required
        />

        {/* Google Maps Autocomplete */}
        <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={['places']}>
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceChanged}
          >
            <input
              type="text"
              name="location"
              placeholder="Enter location"
              value={newActivity.location}
              onChange={handleInputChange}
              className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
              required
            />
          </Autocomplete>
        </LoadScript>

        <input
          type="text"
          name="price"
          placeholder="Price or Price Range"
          value={newActivity.price}
          onChange={handleInputChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
          required
        />

        <input
          type="text"
          name="categoryTags"
          placeholder="Category Tags"
          value={newActivity.categoryTags}
          onChange={handleInputChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
        />

        <input
          type="text"
          name="specialDiscounts"
          placeholder="Special Discounts"
          value={newActivity.specialDiscounts}
          onChange={handleInputChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
        />

        <label className="inline-flex items-center">
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
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600"
        >
          Create Activity
        </button>
      </form>

      {/* List of Activities */}
      <h2 className="text-2xl font-semibold mb-4">Activities List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="bg-white p-4 rounded-lg shadow-md">
              {editingActivity?.id === activity.id ? (
                // Edit form
                <form onSubmit={handleUpdate}>
                  <input
                    type="date"
                    name="date"
                    value={editingActivity.date}
                    onChange={(e) =>
                      setEditingActivity({ ...editingActivity, date: e.target.value })
                    }
                    className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
                  />

                  <input
                    type="time"
                    name="time"
                    value={editingActivity.time}
                    onChange={(e) =>
                      setEditingActivity({ ...editingActivity,
                        time: e.target.value })
                    }
                    className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
                  />

                  <input
                    type="text"
                    name="location"
                    value={editingActivity.location}
                    onChange={(e) =>
                      setEditingActivity({ ...editingActivity, location: e.target.value })
                    }
                    className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
                  />

                  <input
                    type="text"
                    name="price"
                    value={editingActivity.price}
                    onChange={(e) =>
                      setEditingActivity({ ...editingActivity, price: e.target.value })
                    }
                    className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
                  />

                  <input
                    type="text"
                    name="categoryTags"
                    value={editingActivity.categoryTags}
                    onChange={(e) =>
                      setEditingActivity({ ...editingActivity, categoryTags: e.target.value })
                    }
                    className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
                  />

                  <input
                    type="text"
                    name="specialDiscounts"
                    value={editingActivity.specialDiscounts}
                    onChange={(e) =>
                      setEditingActivity({ ...editingActivity, specialDiscounts: e.target.value })
                    }
                    className="block w-full p-2 mb-4 border border-gray-300 rounded-lg"
                  />

                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="bookingOpen"
                      checked={editingActivity.bookingOpen}
                      onChange={(e) =>
                        setEditingActivity({ ...editingActivity, bookingOpen: e.target.checked })
                      }
                      className="form-checkbox h-5 w-5 text-indigo-600"
                    />
                    <span className="ml-2">Is Booking Open?</span>
                  </label>

                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-green-600"
                  >
                    Save
                  </button>
                </form>
              ) : (
                // Display activity details
                <>
                  <p>
                    <strong>Date:</strong> {activity.date}
                  </p>
                  <p>
                    <strong>Time:</strong> {activity.time}
                  </p>
                  <p>
                    <strong>Location:</strong> {activity.location}
                  </p>
                  <p>
                    <strong>Price:</strong> {activity.price}
                  </p>
                  <p>
                    <strong>Category Tags:</strong> {activity.categoryTags}
                  </p>
                  <p>
                    <strong>Special Discounts:</strong> {activity.specialDiscounts}
                  </p>
                  <p>
                    <strong>Booking Open:</strong> {activity.bookingOpen ? 'Yes' : 'No'}
                  </p>

                  {/* Edit & Delete buttons */}
                  <button
                    onClick={() => setEditingActivity(activity)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(activity.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No activities available.</p>
        )}
      </div>
    </div>
  );
}

export default ActivitiesPage;