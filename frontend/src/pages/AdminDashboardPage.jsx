import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useUserStore } from "../store/user";
import { useProductStore } from "../store/product";
import { useItineraryStore } from "../store/itinerary";
import { useActivityStore } from "../store/activity";
import egypt from "../images/egypt.jpg";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.js Registration
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, getUsersNumber, getNewUsersLastMonth } = useUserStore();
  const { getProducts, products } = useProductStore();
  const { getItineraries, itineraries } = useItineraryStore();
  const { getActivities, activities } = useActivityStore();
  
  // States for statistics and filters
  const [productTotal, setProductTotal] = useState(0);
  const [itineraryTotal, setItineraryTotal] = useState(0);
  const [activityTotal, setActivityTotal] = useState(0);
  const [productBookings, setProductBookings] = useState(0);
  const [itineraryBookings, setItineraryBookings] = useState(0);
  const [activityBookings, setActivityBookings] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [minDateFilter, setMinDateFilter] = useState("");
  const [maxDateFilter, setMaxDateFilter] = useState("");
  const [totalAppRevenue, setTotalAppRevenue] = useState(0);
  const [totalSalesCount, setTotalSalesCount] = useState(0);

  useEffect(() => {
    if (user.type !== "admin") {
      navigate("/");
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setTotalUsers(await getUsersNumber());
      setNewUsers(await getNewUsersLastMonth());

      await getProducts();
      await getItineraries();
      await getActivities();

      // Gift shop data
      const giftShopSales = products
        .filter((product) => product.sales > 0)
        .map((product) => ({
          category: "Gift Shop",
          name: product.name,
          salesOrBookings: product.sales,
          price: `$${product.price.toFixed(2)}`,
          revenue: `$${(product.sales * product.price).toFixed(2)}`,
          appRate: 10,
          appRevenue: `$${(product.sales * product.price * 0.1).toFixed(2)}`,
          date: product.date ? new Date(product.date).toISOString().split("T")[0] : "----",
        }));

      // Itinerary data
      const itineraryData = itineraries
        .filter((itinerary) => itinerary.numberOfBookings > 0)
        .map((itinerary) => ({
          category: "Itinerary",
          name: itinerary.name,
          salesOrBookings: itinerary.numberOfBookings,
          price: `$${itinerary.price.toFixed(2)}`,
          revenue: `$${(itinerary.numberOfBookings * itinerary.price).toFixed(2)}`,
          appRate: 10,
          appRevenue: `$${(itinerary.numberOfBookings * itinerary.price * 0.1).toFixed(2)}`,
          date: itinerary.availableDates[0]
            ? new Date(itinerary.availableDates[0]).toISOString().split("T")[0]
            : "No Date",
        }));

      // Activity data
      const activityData = activities
        .filter((activity) => activity.numberOfBookings > 0)
        .map((activity) => ({
          category: "Activity",
          name: activity.name,
          salesOrBookings: activity.numberOfBookings,
          price: `$${activity.price.toFixed(2)}`,
          revenue: `$${(activity.numberOfBookings * activity.price).toFixed(2)}`,
          appRate: 10,
          appRevenue: `$${(activity.numberOfBookings * activity.price * 0.1).toFixed(2)}`,
          date: activity.date ? new Date(activity.date).toISOString().split("T")[0] : "No Date",
        }));

      const combinedSales = [...giftShopSales, ...itineraryData, ...activityData];
      setSalesData(combinedSales);
      setFilteredSales(combinedSales);

      const filteredAppRevenue = combinedSales.reduce((sum, item) => sum + parseFloat(item.appRevenue.slice(1)), 0);
      setTotalAppRevenue(filteredAppRevenue);

      const totalSales = combinedSales.reduce((sum, item) => sum + item.salesOrBookings, 0);
      setTotalSalesCount(totalSales);

      setProductTotal(giftShopSales.reduce((sum, item) => sum + parseFloat(item.appRevenue.slice(1)), 0));
      setItineraryTotal(itineraryData.reduce((sum, item) => sum + parseFloat(item.appRevenue.slice(1)), 0));
      setActivityTotal(activityData.reduce((sum, item) => sum + parseFloat(item.appRevenue.slice(1)), 0));

      setProductBookings(giftShopSales.reduce((sum, item) => sum + item.salesOrBookings, 0));
      setItineraryBookings(itineraryData.reduce((sum, item) => sum + item.salesOrBookings, 0));
      setActivityBookings(activityData.reduce((sum, item) => sum + item.salesOrBookings, 0));
    } catch (error) {
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    let filtered = salesData;

    if (categoryFilter !== "All") {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    if (searchText) {
      filtered = filtered.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
    }

    if (minDateFilter) {
      filtered = filtered.filter(item => new Date(item.date) >= new Date(minDateFilter));
    }

    if (maxDateFilter) {
      filtered = filtered.filter(item => new Date(item.date) <= new Date(maxDateFilter));
    }

    setFilteredSales(filtered);
  }, [categoryFilter, searchText, salesData, minDateFilter, maxDateFilter]);

  const getRevenueTableRows = () => {
    return filteredSales.map((item, index) => (
      <tr key={index} className="hover:bg-gray-100">
        <td className="px-4 py-2">{item.category}</td>
        <td className="px-4 py-2">{item.name}</td>
        <td className="px-4 py-2">{item.salesOrBookings}</td>
        <td className="px-4 py-2">{item.price}</td>
        <td className="px-4 py-2">{item.revenue}</td>
        <td className="px-4 py-2">{item.appRevenue}</td>
        <td className="px-4 py-2">{item.date}</td>
      </tr>
    ));
  };
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 relative">
      <img src={egypt} className="fixed top-0 left-0 w-full h-full object-cover opacity-10 pointer-events-none" alt="Background" />

      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 sm:p-10 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <div className="text-white">
            <p className="text-lg">Logged in as: <span className="font-semibold">{user.userName}</span></p>
          </div>
        </div>

        {/* User Statistics and Summary */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#161821f0] p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-xl">Total Users</h3>
            <p className="text-3xl font-bold">{totalUsers}</p>
          </div>
          <div className="bg-[#161821f0] p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-xl">New Users (Last Month)</h3>
            <p className="text-3xl font-bold">{newUsers}</p>
          </div>
          <div className="bg-[#161821f0] p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-xl">Total App Revenue</h3>
            <p className="text-3xl font-bold">${totalAppRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-[#161821f0] p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-xl">Total Sales/Bookings</h3>
            <p className="text-3xl font-bold">{totalSalesCount}</p>
          </div>
        </div>

        {/* Category Totals */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          <div className="bg-[#161821f0] p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-xl">Gift Shop Revenue</h3>
            <p className="text-3xl font-bold">${productTotal.toFixed(2)}</p>
            <p className="text-lg">Total Bookings: {productBookings}</p>
          </div>
          <div className="bg-[#161821f0] p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-xl">Itinerary Revenue</h3>
            <p className="text-3xl font-bold">${itineraryTotal.toFixed(2)}</p>
            <p className="text-lg">Total Bookings: {itineraryBookings}</p>
          </div>
          <div className="bg-[#161821f0] p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-xl">Activity Revenue</h3>
            <p className="text-3xl font-bold">${activityTotal.toFixed(2)}</p>
            <p className="text-lg">Total Bookings: {activityBookings}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 bg-gray-50 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="All">All Categories</option>
                <option value="Gift Shop">Gift Shop</option>
                <option value="Itinerary">Itinerary</option>
                <option value="Activity">Activity</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Search</label>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Date</label>
              <input
                type="date"
                value={minDateFilter}
                onChange={(e) => setMinDateFilter(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Date</label>
              <input
                type="date"
                value={maxDateFilter}
                onChange={(e) => setMaxDateFilter(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="p-6 bg-gray-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Sales Report</h2>
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Sales / Bookings</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Revenue</th>
                <th className="px-4 py-2 text-left">App Revenue</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>{getRevenueTableRows()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
