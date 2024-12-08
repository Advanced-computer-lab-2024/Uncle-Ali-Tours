import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/user";
import { useProductStore } from "../store/product";
import toast, { Toaster } from "react-hot-toast";
import Promo from "../components/Promo";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { deleteUser, createUser, getUsersNumber, getNewUsersLastMonth, user } = useUserStore();
  const { getProducts, products } = useProductStore();

  const [users, setUsers] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [accountUsername, setAccountUsername] = useState("");
  const [accountType, setAccountType] = useState("");
  const [adminData, setAdminData] = useState({ userName: "", password: "", email: "" });
  const [salesReport, setSalesReport] = useState([]);
  const [filteredReport, setFilteredReport] = useState([]);
  const [filters, setFilters] = useState({ product: "", dateRange: { start: "", end: "" }, month: "", searchName: "" });

  const [uploadedDocuments, setUploadedDocuments] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user.type !== "admin") navigate("/");

    const fetchData = async () => {
      setUsers(await getUsersNumber());
      setNewUsers(await getNewUsersLastMonth());
      fetchSalesReport();
    };
    fetchData();
  }, [user]);

  // Fetch Uploaded Documents
  useEffect(() => {
    if (user.userName) {
      fetchDocuments();  // Fetch documents only if userName is available
    }
  }, [user.userName]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`/api/seller/getAllUploadedDocuments`);
      const data = await response.json();
  
      if (data.success) {
        setUploadedDocuments(data.documents); // Set the documents state with all seller documents
      } else {
        setError(data.message || "Failed to fetch documents.");
      }
    } catch (error) {
      setError("An error occurred while fetching documents.");
      console.error(error);
    }
  };
  
  

  const fetchSalesReport = async () => {
    await getProducts();
    const giftShopSales = products
      .filter((product) => product.sales > 0)
      .map((product) => ({
        category: "Gift Shop",
        name: product.name,
        revenue: (product.sales || 0) * product.price,
        appRate: 10,
        appRevenue: ((product.sales || 0) * product.price) * 0.1,
        date: product.date || "2024-11-01",
      }));

    const data = [
      { category: "Event", name: "Event 1", revenue: 1000, appRate: 10, appRevenue: 100, date: "2024-11-01" },
      { category: "Itinerary", name: "Itinerary 1", revenue: 500, appRate: 10, appRevenue: 50, date: "2024-11-02" },
      ...giftShopSales,
    ];

    setSalesReport(data);
    setFilteredReport(data);
  };

  const handleDeleteAccount = async () => {
    if (!accountUsername || !accountType) {
      toast.error("Username and Account Type cannot be empty.", { className: "text-white bg-red-600" });
      return;
    }
    const { success, message } = await deleteUser(accountUsername, accountType);
    success
      ? toast.success(message, { className: "text-white bg-gray-800" })
      : toast.error(message, { className: "text-white bg-gray-800" });
  };

  const handleAddUser = async (data, type) => {
    const payload = { ...data, type };
    const { success, message } = await createUser(payload);
    success
      ? toast.success(message, { className: "text-white bg-gray-800" })
      : toast.error(message, { className: "text-white bg-gray-800" });
  };

  useEffect(() => {
    let filtered = salesReport;

    if (filters.product) {
      filtered = filtered.filter((item) => item.category === filters.product);
    }

    if (filters.dateRange.start && filters.dateRange.end) {
      filtered = filtered.filter(
        (item) =>
          new Date(item.date) >= new Date(filters.dateRange.start) && new Date(item.date) <= new Date(filters.dateRange.end)
      );
    }

    if (filters.month) {
      const currentMonth = new Date().getMonth();
      filtered = filtered.filter((item) => new Date(item.date).getMonth() === currentMonth);
    }
    if (filters.searchName) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(filters.searchName.toLowerCase())
      );
    }

    setFilteredReport(filtered);
  }, [filters, salesReport]);

  return (
    <div className="container mx-auto mt-12">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        <div className="col-span-1 lg:col-span-3 p-6 bg-[#161821f0] rounded-lg shadow-lg text-white">
          <h3 className="text-xl text-center mb-4">Admin Stats</h3>
          <p>Users: {users}</p>
          <p>New Users this Month: {newUsers}</p>
        </div>

        {/* Add Admin / Delete User */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-3">
          {/* Add New Admin */}
          <div className="p-6 bg-[#161821f0] rounded-lg shadow-lg text-white">
            <h3 className="text-xl mb-4">Add New Admin</h3>
            <input
              type="text"
              placeholder="Username"
              value={adminData.userName}
              onChange={(e) => setAdminData({ ...adminData, userName: e.target.value })}
              className="w-full bg-transparent border border-gray-600 rounded-md px-2 py-2 mb-3"
            />
            <input
              type="password"
              placeholder="Password"
              value={adminData.password}
              onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
              className="w-full bg-transparent border border-gray-600 rounded-md px-2 py-2"
            />
            <input
              type="text"
              placeholder="Email"
              value={adminData.email}
              onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
              className="w-full bg-transparent border border-gray-600 rounded-md px-2 py-2 mb-3"
            />
            <button
              onClick={() => handleAddUser(adminData, "admin")}
              className="w-full mt-4 bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
            >
              Add New Admin
            </button>
          </div>

          {/* Delete User */}
          <div className="p-6 bg-[#161821f0] rounded-lg shadow-lg text-white">
            <h3 className="text-xl mb-4">Delete Account</h3>
            <input
              type="text"
              placeholder="Username"
              value={accountUsername}
              onChange={(e) => setAccountUsername(e.target.value)}
              className="w-full bg-transparent border border-gray-600 rounded-md px-2 py-2 mb-3"
            />
            <input
              type="text"
              placeholder="Account Type"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full bg-transparent border border-gray-600 rounded-md px-2 py-2"
            />
            <button
              onClick={handleDeleteAccount}
              className="w-full mt-4 bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* Promo Codes */}
        <div className="col-span-1 lg:col-span-3 p-6 bg-[#161821f0] rounded-lg shadow-lg text-white">
          <h3 className="text-xl mb-4">Promo Codes</h3>
          <Promo />
        </div>
      </div>

      {/* Uploaded Documents Section */}
      <div className="col-span-1 lg:col-span-3 p-6 bg-[#161821f0] rounded-lg shadow-lg text-white">
  <h3 className="text-xl text-center mb-4">Uploaded Documents</h3>

  {error && <p className="text-red-500">{error}</p>} {/* Show error if any */}

  {uploadedDocuments ? (
    uploadedDocuments.length > 0 ? (
      uploadedDocuments.map((doc, index) => (
        <div key={index} className="mb-4">
          <h4 className="text-lg mt-4">Seller: {doc.userName}</h4>

          <h5 className="text-md mt-2">Seller ID:</h5>
          {doc.sellerID ? (
            <a
              href={`http://localhost:5000${doc.sellerID}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Seller ID
            </a>
          ) : (
            <p>No Seller ID uploaded</p>
          )}

          <h5 className="text-md mt-2">Taxation Registry Card:</h5>
          {doc.taxationRegistryCard ? (
            <a
              href={`http://localhost:5000${doc.taxationRegistryCard}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Taxation Registry Card
            </a>
          ) : (
            <p>No Taxation Registry Card uploaded</p>
          )}
        </div>
      ))
    ) : (
      <p>No documents found.</p>
    )
  ) : (
    <p>Loading documents...</p> // Show loading message if documents are still being fetched
  )}
</div>


      {/* Sales Report Section */}
      <div className="p-6 bg-[#161821f0] rounded-lg shadow-lg text-white mt-6">
        <h3 className="text-2xl text-center mb-4">Sales Report</h3>
        {/* Sales Report Filters */}
        <div className="flex gap-4 mb-4">
          <select
            value={filters.product}
            onChange={(e) => setFilters({ ...filters, product: e.target.value })}
            className="bg-gray-800 text-white rounded-md px-2 py-2"
          >
            <option value="">All Categories</option>
            <option value="Event">Event</option>
            <option value="Itinerary">Itinerary</option>
            <option value="Gift Shop">Gift Shop</option>
          </select>
          <input
            type="text"
            value={filters.searchName}
            onChange={(e) => setFilters({ ...filters, searchName: e.target.value })}
            placeholder="Search ..."
            className="bg-gray-800 text-white rounded-md px-2 py-2"
          />
          <input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, start: e.target.value } })}
            className="bg-gray-800 text-white rounded-md px-2 py-2"
          />
          <input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, end: e.target.value } })}
            className="bg-gray-800 text-white rounded-md px-2 py-2"
          />
        </div>

        {/* Sales Report Table */}
        <table className="w-full table-auto mt-4 text-white">
          <thead>
            <tr>
              <th className="py-2">Category</th>
              <th className="py-2">Name</th>
              <th className="py-2">Revenue</th>
              <th className="py-2">App Rate</th>
              <th className="py-2">App Revenue</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredReport.map((report, index) => (
              <tr key={index} className="bg-gray-800 hover:bg-gray-700">
                <td className="py-2">{report.category}</td>
                <td className="py-2">{report.name}</td>
                <td className="py-2">{report.revenue}</td>
                <td className="py-2">{report.appRate}%</td>
                <td className="py-2">{report.appRevenue}</td>
                <td className="py-2">{report.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View All Products Section */}
      <div className="p-6 bg-[#161821f0] rounded-lg shadow-lg text-white mt-6">
        <h3 className="text-2xl text-center mb-4">View All Products</h3>
        <table className="w-full table-auto mt-4 text-white">
          <thead>
            <tr>
              <th className="py-2">Product Name</th>
              <th className="py-2">Price</th>
              <th className="py-2">Quantity</th>
              <th className="py-2">Sales</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="bg-gray-800 hover:bg-gray-700">
                <td className="py-2">{product.name}</td>
                <td className="py-2">${product.price}</td>
                <td className="py-2">{product.Available_quantity}</td>
                <td className="py-2">{product.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
