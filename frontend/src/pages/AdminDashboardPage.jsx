import React, { useState } from 'react';
import { useUserStore } from '../store/user';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/product';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Promo from '../components/Promo';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { 
    deleteUser, 
    fetchPendingRegistrations, 
    approveUser, 
    rejectUser, 
    createUser, 
    user,
    getUsersNumber,
    getNewUsersLastMonth 
  } = useUserStore();
  const { getProducts, products } = useProductStore();
  const [users, setUsers] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [showProducts, setShowProducts] = useState(false);

  const [accountUsername, setAccountUsername] = useState('');
  const [accountType, setAccountType] = useState('');
  const [adminData, setAdminData] = useState({ userName: '', password: '' }); // Username and password for admin
  const [tourismData, setTourismData] = useState({ userName: '', password: '' }); // Username and password for tourism

  const handleDeleteAccount = async () => {
    const { success, message } = await deleteUser(accountUsername, accountType);
    success
        ? toast.success(message, { className: "text-white bg-gray-800" })
        : toast.error(message, { className: "text-white bg-gray-800" });
  };

  useEffect(() => {
    if (user.type !== 'admin') {
      navigate('/');
    }
    const fetchData = async () => {
    setUsers(await getUsersNumber());
    console.log(users);
    setNewUsers(await getNewUsersLastMonth());
    };
    fetchData();
  }, []);

  const handleAddAdmin = async function(type) {
    const passedUser = adminData;
    passedUser.type = 'admin';
    const { success, message } = await createUser(passedUser);
    success ? toast.success(message, { className: "text-white bg-gray-800" }) : toast.error(message, { className: "text-white bg-gray-800" });
  };

  const handleAddTourismGovernor = async function(type)  {
    const passedUser = tourismData;
    passedUser.type = 'governor';
    const { success, message } = await createUser(passedUser);
    success ? toast.success(message, { className: "text-white bg-gray-800" }) : toast.error(message, { className: "text-white bg-gray-800" });
  };

  const handleViewAllProducts = async () => {
    await getProducts(); // Fetch all products
    setShowProducts(true); // Show the products list
  };

  const getSalesData = () => {
    return {
      labels: products.map(product => product.name),
      datasets: [
        {
          label: 'Sales',
          data: products.map(product => product.sales || 0), // Use sales attribute
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
  };

  return (
    <div className="container mx-auto p-4 pt-6">
      <Toaster />
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          <p>users: {users}</p>
          <p>new users this month: {newUsers}</p>

      <div className="flex flex-wrap justify-center mb-4">
        {/* Delete Account Section */}
        <div className="w-full md:w-1/2 xl:w-1/3 p-6">
          <h2 className="text-2xl font-bold mb-4">Delete Account</h2>
          <input 
            type="text" 
            value={accountUsername} 
            onChange={(e) => setAccountUsername(e.target.value)} 
            placeholder="Enter Username"
            className="w-full rounded-md p-2 border border-gray-600 bg-gray-900 text-white"
          />
          <input 
            type="text" 
            value={accountType} 
            onChange={(e) => setAccountType(e.target.value)} 
            placeholder="Enter Type"
            className="w-full rounded-md p-2 border border-gray-600 bg-gray-900 text-white"
          />
          <button 
            className="px-5 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300" 
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>

        {/* Add Tourism Governor Form */}
        <div className="w-full md:w-1/2 xl:w-1/3 p-6">
          <h2 className="text-2xl font-bold mb-4">Add Tourism Governor</h2>
          <input
            type="text"
            value={tourismData.userName}
            onChange={(e) => setTourismData({ ...tourismData, userName: e.target.value })}
            placeholder="Username"
            className="w-full rounded-md p-2 border border-gray-600 bg-gray-900 text-white mb-4"
          />
          <input
            type="password"
            value={tourismData.password}
            onChange={(e) => setTourismData({ ...tourismData, password: e.target.value })}
            placeholder="Password"
            className="w-full rounded-md p-2 border border-gray-600 bg-gray-900 text-white"
          />
          <button 
            className="px-5 py-3 mt-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
            onClick={handleAddTourismGovernor}
          >
            Add Tourism Governor
          </button>
        </div>

        {/* Add New Admin Form */}
        <div className="w-full md:w-1/2 xl:w-1/3 p-6">
          <h2 className="text-2xl font-bold mb-4">Add New Admin</h2>
          <input
            type="text"
            value={adminData.userName}
            onChange={(e) => setAdminData({ ...adminData, userName: e.target.value })}
            placeholder="Username"
            className="w-full rounded-md p-2 border border-gray-600 bg-gray-900 text-white mb-4"
          />
          <input
            type="password"
            value={adminData.password}
            onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
            placeholder="Password"
            className="w-full rounded-md p-2 border border-gray-600 bg-gray-900 text-white"
          />
          <button 
            className="px-5 py-3 mt-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
            onClick={handleAddAdmin}
          >
            Add New Admin
          </button>
        </div>
      </div>

      {/* Redirect Buttons */}
      <div className="flex flex-wrap justify-center mb-4">
        <div className="w-full md:w-1/2 xl:w-1/3 p-6">
          <h2 className="text-2xl font-bold mb-4">Manage</h2>
          <div className="flex flex-wrap justify-center mb-4">
            <div className="w-full md:w-1/3 xl:w-1/3 p-6">
              <Link to="/preferenceTag">
                <button 
                  className="px-5 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Preference Tags
                </button>
              </Link>
            </div>
            <div className="w-full md:w-1/3 xl:w-1/3 p-6">
              <Link to="/activityCategory">
                <button 
                  className="px-5 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Activity Categories
                </button>
              </Link>
            </div>
            <div className="w-full md:w-1/3 xl:w-1/3 p-6">
              <Link to="/product">
                <button 
                  className="px-5 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Products
                </button>
              </Link>
              <Link to="/viewDeleteRequests">
                <button 
                  className="px-5 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                  View Delete Requests
                </button>
              </Link>
              <Link to="/complaints">
                <button 
                  className="px-5 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Complaints
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* New Buttons for Itinerary and Activity */}
      <div className="w-full md:w-1/2 xl:w-1/3 p-6">
        <div className="flex flex-wrap justify-center mb-4">
          <h2 className="text-2xl font-bold mb-4">Manage Itineraries and Activities</h2>
          <div className="flex space-x-4">
            <Link to="/AdminItineraryPage">
              <button 
                className="px-5 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
              >
                Itinerary
              </button>
            </Link>
            <Link to="/AdminActivitiesPage">
              <button 
                className="px-5 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
              >
                Activity
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 xl:w-1/3 p-6">
        <div className="flex flex-wrap justify-center mb-4">
          <h2 className="text-2xl font-bold mb-4">View All Products : </h2>
          <button 
            className="px-5 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
            onClick={handleViewAllProducts}
          >
            View Products
          </button>
        </div>
      </div>

      {showProducts && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">All Products</h2>
          {products.map((product, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-600 rounded-md">
              <p><strong>Name:</strong> {product.name}</p>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Available Quantity:</strong> {product.Available_quantity}</p>
              <p><strong>Sales:</strong> {product.sales || 0}</p>
            </div>
          ))}
        </div>
      )}

      {/* Sales Chart */}
      {showProducts && products.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl text-center">Sales Data for All Products</h3>
          <Bar data={getSalesData()} options={{ responsive: true }} />
        </div>
      )}

      <Promo />
    </div>
  );
};

export default AdminDashboard;
