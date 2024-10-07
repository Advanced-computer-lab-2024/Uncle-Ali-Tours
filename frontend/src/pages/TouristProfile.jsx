import React, { useState } from 'react'; 

const TouristProfile = () => {
  // Profile data with a static wallet value
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    wallet: 100, 
    phone_number:'' 
  });

  const [filter, setFilter] = useState({
    productName: '',
    priceRange: 1000,
    rating: 0,
    category: '',
    budget: '',
    date: '',
    language: '',
    preferences: '',
    tags: '',
  });

  
  const handleProfileUpdate = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle product filter based on name, price, etc.
  const handleProductFilter = (e) => {
    e.preventDefault();
    console.log('Filtering products based on:', filter);
  };

  // Handle activities filter based on various criteria
  const handleActivityFilter = (e) => {
    e.preventDefault();
    console.log('Filtering activities based on:', filter);
  };

  return (
    <div className="p-4 relative min-h-screen bg-gray-100">
      
      {/* Static Wallet at the Top Right */}
      <div className="absolute top-4 right-4 text-xl font-bold text-gray-800">
        Wallet Balance: ${profile.wallet}
      </div>

      {/* Search, Sort, and Filter on the Top Left */}
      <div className="absolute top-4 left-4 w-80 bg-white p-6 shadow-lg rounded-lg">
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Search for Places/Activities</h2>
          <form onSubmit={handleActivityFilter}>
            <input
              type="text"
              name="category"
              placeholder="Search by name, category, or tag"
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="w-full p-3 mb-4 border border-gray-300 rounded text-gray-900"
            />
            <button 
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Search
            </button>
          </form>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <form onSubmit={handleProductFilter}>
            <input
              type="text"
              placeholder="Search by product name"
              value={filter.productName}
              onChange={(e) => setFilter({ ...filter, productName: e.target.value })}
              className="w-full p-3 mb-4 border border-gray-300 rounded text-gray-900"
            />
            <button 
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Search
            </button>
          </form>

          <div className="mt-4">
            <label className="block mb-2 text-gray-800">Price Range: {filter.priceRange}</label>
            <input
              type="range"
              min="0"
              max="1000"
              value={filter.priceRange}
              onChange={(e) => setFilter({ ...filter, priceRange: e.target.value })}
              className="w-full"
            />
          </div>

          <div className="mt-4">
            <label className="block mb-2 text-gray-800">Sort by Ratings</label>
            <select
              value={filter.rating}
              onChange={(e) => setFilter({ ...filter, rating: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded text-gray-900"
            >
              <option value="0">All Ratings</option>
              <option value="1">1 star</option>
              <option value="2">2 stars</option>
              <option value="3">3 stars</option>
              <option value="4">4 stars</option>
              <option value="5">5 stars</option>
            </select>
          </div>
        </section>
      </div>

      {/* Profile Section */}
      <section className="mt-32 bg-white p-8 shadow-lg rounded-lg w-11/12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">My Profile</h2>
        <form>
          <div className="mb-6">
            <label className="block mb-2 text-gray-800">Name:</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileUpdate}
              className="w-full p-3 border border-gray-300 rounded text-gray-900"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-gray-800">Email:</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileUpdate}
              className="w-full p-3 border border-gray-300 rounded text-gray-900"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-gray-800">phone number:</label>
            <input
              type="Phone number"
              name="Phone number"
              value={profile.phone_number}
              onChange={handleProfileUpdate}
              className="w-full p-3 border border-gray-300 rounded text-gray-900"
            />
          </div>
          

          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-800">Wallet Balance: ${profile.wallet}</label>
          </div>
        </form>
      </section>

      {/* Activities Section */}
      <section className="mt-12 bg-white p-8 shadow-lg rounded-lg w-11/12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Upcoming Activities</h2>
        <form onSubmit={handleActivityFilter}>
          <div className="mb-6">
            <label className="block mb-2 text-gray-800">Filter by Budget</label>
            <input
              type="number"
              placeholder="Budget"
              value={filter.budget}
              onChange={(e) => setFilter({ ...filter, budget: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded text-gray-900"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-gray-800">Filter by Date</label>
            <input
              type="date"
              value={filter.date}
              onChange={(e) => setFilter({ ...filter, date: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded text-gray-900"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-gray-800">Preferences (e.g., historic areas, beaches)</label>
            <input
              type="text"
              placeholder="Preferences"
              value={filter.preferences}
              onChange={(e) => setFilter({ ...filter, preferences: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded text-gray-900"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-gray-800">Language</label>
            <input
              type="text"
              placeholder="Language"
              value={filter.language}
              onChange={(e) => setFilter({ ...filter, language: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded text-gray-900"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Apply Filters
          </button>
        </form>
      </section>

      {/* Historical Places Section */}
      <section className="mt-12 bg-white p-8 shadow-lg rounded-lg w-11/12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Historical Places</h2>
        <form onSubmit={handleActivityFilter}>
          <div className="mb-6">
            <label className="block mb-2 text-gray-800">Filter by Tags</label>
            <input
              type="text"
              placeholder="Tag (e.g., museum, historic site)"
              value={filter.tags}
              onChange={(e) => setFilter({ ...filter, tags: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded text-gray-900"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Apply Filters
          </button>
        </form>
      </section>
    </div>
  );
};

export default TouristProfile;
