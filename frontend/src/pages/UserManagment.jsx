import React, { useState, useEffect } from "react";
import { useUserStore } from "../store/user";
import toast from "react-hot-toast";

const UserManagement = () => {
  const { deleteUser, createUser, getUsersNumber, getNewUsersLastMonth, user } = useUserStore();
  const [users, setUsers] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [adminData, setAdminData] = useState({ userName: "", password: "", email: "", userType: "admin" });
  const [deleteUsername, setDeleteUsername] = useState("");
  const [deleteUserType, setDeleteUserType] = useState(""); // Track user type for deletion (manual input)
  const [userType, setUserType] = useState(""); // Track selected user type for adding users

  // Fetch user data
  const fetchUserData = async () => {
    setUsers(await getUsersNumber());
    setNewUsers(await getNewUsersLastMonth());
  };

  const handleAddUser = async (data) => {
    const { userName, password, email, userType } = data;
    const payload = { userName, password, email, type: userType };

    const { success, message } = await createUser(payload);
    success ? toast.success(message) : toast.error(message);
  };

  const handleDeleteAccount = async () => {
    if (!deleteUserType) {
      toast.error("Please enter a valid user type (admin or governor).");
      return;
    }
    const { success, message } = await deleteUser(deleteUsername, deleteUserType); // Pass username and userType for deletion
    success ? toast.success(message) : toast.error(message);
  };

  useEffect(() => {
    if (user.type !== "admin") navigate("/"); // Ensure only admin can access
    fetchUserData();
  }, [user]);

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">User Management</h1>

      {/* Stats Section */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-2xl font-semibold mb-4">User Stats</h3>
          <p className="text-xl mb-2">Total Users: {users}</p>
          <p className="text-xl">New Users this Month: {newUsers}</p>
        </div>
      </div>

      {/* Add New User Form (Admin / Governor) */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-2xl font-semibold mb-4">Add New User</h3>
        <form onSubmit={(e) => { e.preventDefault(); handleAddUser(adminData); }}>
          <input
            type="text"
            value={adminData.userName}
            onChange={(e) => setAdminData({ ...adminData, userName: e.target.value })}
            placeholder="Username"
            className="w-full mb-4 p-3 border rounded-md"
          />
          <input
            type="password"
            value={adminData.password}
            onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
            placeholder="Password"
            className="w-full mb-4 p-3 border rounded-md"
          />
          <input
            type="email"
            value={adminData.email}
            onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
            placeholder="Email"
            className="w-full mb-4 p-3 border rounded-md"
          />

          {/* User Type Dropdown for Adding User */}
          <div className="mb-4">
            <select
              value={userType}
              onChange={(e) => {
                setUserType(e.target.value);
                setAdminData({ ...adminData, userType: e.target.value });
              }}
              id="userType"
              className="w-full p-3 mt-2 border rounded-md"
            >
              <option value="" disabled>
                Select User Type
              </option>
              <option value="admin">Admin</option>
              <option value="governor">Governor</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-orange-500 text-white py-3 px-6 rounded-full hover:bg-orange-600 transition duration-300"
          >
            Add {userType ? userType.charAt(0).toUpperCase() + userType.slice(1) : "User"}
          </button>
        </form>
      </div>

      {/* Delete Account Form */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-4">Delete Account</h3>
        <form onSubmit={(e) => { e.preventDefault(); handleDeleteAccount(); }}>
          <input
            type="text"
            value={deleteUsername}
            onChange={(e) => setDeleteUsername(e.target.value)}
            placeholder="Enter Username to Delete"
            className="w-full mb-4 p-3 border rounded-md"
          />

          {/* User Type Input for Deletion */}
          <div className="mb-4">
            <input
              type="text"
              value={deleteUserType}
              onChange={(e) => setDeleteUserType(e.target.value)}
              placeholder="Enter User Type"
              className="w-full p-3 mt-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            className="bg-red-500 text-white py-3 px-6 rounded-full hover:bg-red-600 transition duration-300"
          >
            Delete Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;