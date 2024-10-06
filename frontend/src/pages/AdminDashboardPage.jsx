import React, { useState } from 'react';
import { useUserStore } from '../store/user';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';


const AdminDashboard = () => {
  const { deleteUser } = useUserStore();
  const [accountId, setAccountId] = useState('');
  const [adminData, setAdminData] = useState({ userName: '', password: '' }); // Username and password for admin
  const [tourismData, setTourismData] = useState({ userName: '', password: '' }); // Username and password for tourism



  const handleDeleteAccount = async () => {
    const passedUser = accountId.length > 0?accountId:"-1"
    const {success, message} =  await deleteUser(passedUser);
    success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
  };

    const {createUser, user} = useUserStore();

    const handleAddAdmin =  async function(type) {
        const passedUser = adminData
        passedUser.type = 'admin'
       const {success, message} =  await createUser(passedUser);
       success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
   
    }

  const handleAddTourismGovernor = async function(type)  {
    const passedUser = tourismData
    passedUser.type = 'governor'
   const {success, message} =  await createUser(passedUser);
   success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})

  };

  return (
    <div className="container mx-auto p-4 pt-6">
      <Toaster/>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <div className="flex flex-wrap justify-center mb-4">
        {/* Delete Account Section */}
        <div className="w-full md:w-1/2 xl:w-1/3 p-6">
          <h2 className="text-2xl font-bold mb-4">Delete Account</h2>
          <input 
            type="text" 
            value={accountId} 
            onChange={(e) => setAccountId(e.target.value)} 
            placeholder="Enter Account ID" 
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
              <Link to="/manage-products">
                <button 
                  className="px-5 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Products
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
