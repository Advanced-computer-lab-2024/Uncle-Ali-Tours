import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserStore } from "../store/user";
import { useProductStore } from "../store/product";
import toast, { Toaster } from "react-hot-toast";
import Promo from "../components/Promo";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const {
    deleteUser,
    createUser,
    getUsersNumber,
    getNewUsersLastMonth,
    user,
  } = useUserStore();
  const { getProducts, products } = useProductStore();

  const [users, setUsers] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [accountUsername, setAccountUsername] = useState("");
  const [accountType, setAccountType] = useState("");
  const [adminData, setAdminData] = useState({ userName: "", password: "" });
  const [tourismData, setTourismData] = useState({ userName: "", password: "" });
  const [showProducts, setShowProducts] = useState(false);
  const [salesReport, setSalesReport] = useState([]);
  const [filteredReport, setFilteredReport] = useState([]);
  const [filters, setFilters] = useState({ product: "", dateRange: { start: "", end: "" }, month: "" });

  useEffect(() => {
    if (user.type !== "admin") navigate("/");
    const fetchData = async () => {
      setUsers(await getUsersNumber());
      setNewUsers(await getNewUsersLastMonth());
      fetchSalesReport();
    };
    fetchData();
  }, [user]);

  const fetchSalesReport = async () => {
    await getProducts(); // Ensure products are fetched
    if (products.length === 0) {
      console.error("No products fetched");
      return;
    }
  
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
  
  

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    let filtered = salesReport;

    // Filter by product (category)
    if (filters.product) {
      filtered = filtered.filter((item) => item.category.toLowerCase() === filters.product.toLowerCase());
    }

    // Filter by date range
    if (filters.dateRange.start && filters.dateRange.end) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    // Filter by month
    if (filters.month) {
      filtered = filtered.filter((item) => new Date(item.date).getMonth() + 1 === parseInt(filters.month));
    }

    setFilteredReport(filtered);
  };

  const handleDeleteAccount = async () => {
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

  const handleViewAllProducts = async () => {
    await getProducts();
    setShowProducts(true);
  };

  return (
    <div className="container mx-auto mt-12">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Dashboard Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Block */}
        <div className="p-6 bg-[#161821f0] rounded-lg shadow-lg text-white">
          <h3 className="text-xl mb-4">Admin Stats</h3>
          <p>Users: {users}</p>
          <p>New Users this Month: {newUsers}</p>
        </div>

        {/* Delete Account */}
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

        {/* Add Admin */}
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
          <button
            onClick={() => handleAddUser(adminData, "admin")}
            className="w-full mt-4 bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
          >
            Add New Admin
          </button>
        </div>

        {/* Manage Section and Promo Codes */}
        <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Manage Section */}
          <div className="p-6 bg-[#161821f0] rounded-lg shadow-lg text-white">
            <h3 className="text-xl mb-4">Manage</h3>
            <div className="flex flex-wrap gap-3">
              <Link to="/preferenceTag" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Preference Tags
              </Link>
              <Link to="/activityCategory" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Activity Categories
              </Link>
              <Link to="/product" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Products
              </Link>
              <Link to="/viewDeleteRequests" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                View Delete Requests
              </Link>
              <Link to="/complaints" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Complaints
              </Link>
              <Link to="/AdminItineraryPage" className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                Itinerary
              </Link>
              <Link to="/AdminActivitiesPage" className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                Activity
              </Link>
            </div>
          </div>

          {/* Promo Codes */}
          <div className="p-6 bg-[#161821f0] rounded-lg shadow-lg text-white">
            <h3 className="text-xl mb-4">Promo Codes</h3>
            <Promo />
          </div>
        </div>

        {/* Sales Report Section */}
        <div className="p-6 bg-[#161821f0] rounded-lg shadow-lg text-white col-span-1 lg:col-span-3">
          <h3 className="text-2xl text-center mb-4">Sales Report</h3>

          {/* Filters */}
          <div className="flex gap-4 mb-4">
            <select
              value={filters.product}
              onChange={(e) => handleFilterChange("product", e.target.value)}
              className="bg-gray-800 text-white rounded-md px-2 py-2"
            >
              <option value="">All Categories</option>
              <option value="Event">Event</option>
              <option value="Itinerary">Itinerary</option>
              <option value="Gift Shop">Gift Shop</option>
            </select>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleFilterChange("dateRange", { ...filters.dateRange, start: e.target.value })}
              className="bg-gray-800 text-white rounded-md px-2 py-2"
            />
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleFilterChange("dateRange", { ...filters.dateRange, end: e.target.value })}
              className="bg-gray-800 text-white rounded-md px-2 py-2"
            />
            <button
              onClick={applyFilters}
              className="bg-blue-500 px-4 py-2 rounded-md text-white hover:bg-blue-600"
            >
              Apply Filters
            </button>
          </div>

          {/* Report Table */}
          <table className="w-full text-white">
  <thead>
    <tr className="border-b border-gray-600">
      <th className="py-2 px-4">Category</th>
      <th className="py-2 px-4">Name</th>
      <th className="py-2 px-4">Revenue</th>
      <th className="py-2 px-4">App Rate (%)</th>
      <th className="py-2 px-4">App Revenue</th>
      <th className="py-2 px-4">Date</th>
    </tr>
  </thead>
  <tbody>
    {filteredReport.length > 0 ? (
      filteredReport.map((item, index) => (
        <tr key={index} className="border-b border-gray-600">
          <td className="py-2 px-4">{item.category}</td>
          <td className="py-2 px-4">{item.name}</td>
          <td className="py-2 px-4">${item.revenue}</td>
          <td className="py-2 px-4">{item.appRate}%</td>
          <td className="py-2 px-4">${item.appRevenue.toFixed(2)}</td>
          <td className="py-2 px-4">{item.date}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="6" className="py-4 text-center">
          No sales data available for the selected filters.
        </td>
      </tr>
    )}
  </tbody>
</table>

        </div>

        {/* View Products */}
        <div className="p-6 bg-[#161821f0] rounded-lg shadow-lg text-white col-span-1 lg:col-span-3">
          <h3 className="text-xl mb-4">View All Products</h3>
          <button
            onClick={handleViewAllProducts}
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
          >
            View Products
          </button>
          {showProducts && (
            <div className="mt-4 space-y-2">
              {products.map((product, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-600 rounded-md bg-gray-800 text-white"
                >
                  <p><strong>Name:</strong> {product.name}</p>
                  <p><strong>Price:</strong> ${product.price}</p>
                  <p><strong>Quantity:</strong> {product.Available_quantity}</p>
                  <p><strong>Sales:</strong> {product.sales || 0}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
