import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/user';
import { Link, useNavigate } from 'react-router-dom';

import { useProductStore } from '../store/product';
import toast, { Toaster } from 'react-hot-toast';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { 
    deleteUser, 
    fetchPendingRegistrations, 
    approveUser, 
    rejectUser, 
    createUser, 
    user 
  } = useUserStore();
  const { getProducts, products } = useProductStore();

  const [accountUsername, setAccountUsername] = useState('');
  const [accountType, setAccountType] = useState('');
  const [adminData, setAdminData] = useState({ userName: '', password: '' });
  const [tourismData, setTourismData] = useState({ userName: '', password: '' });
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [showProducts, setShowProducts] = useState(false);

  useEffect(() => {
    if (user.type !== 'admin') {
      navigate('/');
    }

    const fetchRegistrations = async () => {
      const data = await fetchPendingRegistrations();
      setPendingRegistrations(data);
    };

    fetchRegistrations();
  }, [navigate, user.type, fetchPendingRegistrations]);

  const handleDeleteAccount = async () => {
    const { success, message } = await deleteUser(accountUsername, accountType);
    success
      ? toast.success(message, { className: "text-white bg-gray-800" })
      : toast.error(message, { className: "text-white bg-gray-800" });
  };

  const handleAddAdmin = async () => {
    const passedUser = { ...adminData, type: 'admin' };
    const { success, message } = await createUser(passedUser);
    success ? toast.success(message, { className: "text-white bg-gray-800" }) : toast.error(message, { className: "text-white bg-gray-800" });
  };

  const handleAddTourismGovernor = async () => {
    const passedUser = { ...tourismData, type: 'governor' };
    const { success, message } = await createUser(passedUser);
    success ? toast.success(message, { className: "text-white bg-gray-800" }) : toast.error(message, { className: "text-white bg-gray-800" });
  };

  const handleApproveRegistration = async (userId) => {
    const { success, message } = await approveUser(userId);
    success ? toast.success(message) : toast.error(message);
    setPendingRegistrations((prev) => prev.filter((user) => user._id !== userId));
  };

  const handleRejectRegistration = async (userId) => {
    const { success, message } = await rejectUser(userId);
    success ? toast.success(message) : toast.error(message);
    setPendingRegistrations((prev) => prev.filter((user) => user._id !== userId));
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
      <Toaster/>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* View Pending Registrations Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Pending Registrations</h2>
        <div className="space-y-4">
          {pendingRegistrations.length > 0 ? (
            pendingRegistrations.map((user) => (
              <div key={user._id} className="p-4 border border-gray-600 rounded-md">
                <p><strong>Username:</strong> {user.userName}</p>
                <p><strong>Type:</strong> {user.type}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <div className="mt-4 space-x-4">
                  <button
                    onClick={() => handleApproveRegistration(user._id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectRegistration(user._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No pending registrations at the moment.</p>
          )}
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="flex flex-wrap justify-center mb-4">
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
            </div>
            <div className="w-full md:w-1/3 xl:w-1/3 p-6">
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
    </div>
    
  );
};

export default AdminDashboard;
