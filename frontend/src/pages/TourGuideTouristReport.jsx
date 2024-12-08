import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { useUserStore } from "../store/user";
import toast, { Toaster } from "react-hot-toast";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const TourGuideTouristReport = () => {
  const { user } = useUserStore(); // Get user from the store
  const [report, setReport] = useState({
    totalTourists: 0,
    activities: [],
    itineraries: [],
  });

  const [selectedMonth, setSelectedMonth] = useState(""); // State to store selected month
  const [filteredItineraries, setFilteredItineraries] = useState([]); // State for filtered itineraries
  const [totalTouristsForMonth, setTotalTouristsForMonth] = useState(0); // State to track tourists count for the selected month
  const [showBarChart, setShowBarChart] = useState(true); // Show Bar Chart by default
  const [showPieChart, setShowPieChart] = useState(false);

  const formatMonth = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${(d.getMonth() + 1).toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/tourGuide/report/${user.userName}`);
        if (!response.ok) {
          throw new Error("Failed to fetch report");
        }
        const data = await response.json(); // Parse the JSON data
        console.log("Fetched Report:", data); // Debug log
        setReport(data); // Update report state
      } catch (error) {
        console.error("Error fetching report:", error);
        toast.error("Failed to fetch report.", { className: "text-white bg-gray-800" });
      }
    };

    if (user.userName) {
      fetchReport(); // Fetch data when username is available
    }
  }, [user.userName]); // Fetch data when username changes

  const handleMonthChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedMonth(selectedDate);

    const filtered = report.itineraries.filter((itinerary) => {
      const itineraryMonth = formatMonth(itinerary.availableDates[0]); // Format the itinerary date to YYYY-MM
      return itineraryMonth === selectedDate;
    });
    setFilteredItineraries(filtered);

    const totalTourists = filtered.reduce((acc, itinerary) => acc + itinerary.numberOfTourists, 0);
    setTotalTouristsForMonth(totalTourists);
  };

  const chartData = {
    labels: (filteredItineraries.length > 0 ? filteredItineraries : report.itineraries).map(
      (itinerary) => itinerary.title
    ),
    datasets: [
      {
        label: "Tourists",
        data: (filteredItineraries.length > 0 ? filteredItineraries : report.itineraries).map(
          (itinerary) => itinerary.numberOfTourists
        ),
        backgroundColor: ["#4caf50", "#2196f3", "#ff9800", "#f44336", "#9c27b0"],
        borderColor: ["#4caf50", "#2196f3", "#ff9800", "#f44336", "#9c27b0"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Tourist Report</h1>

        {/* Month Selection */}
        <div className="mb-6 flex justify-center space-x-4">
          <label htmlFor="month" className="text-gray-700 font-medium">
            Select Month
          </label>
          <select
            id="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">--Select Month--</option>
            {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map(
              (month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              )
            )}
          </select>
        </div>

        {/* Charts and Table Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Charts Section */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between mb-4">
              <button
                onClick={() => {
                  setShowBarChart(true);
                  setShowPieChart(false);
                }}
                className={`px-4 py-2 rounded-md ${
                  showBarChart ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                Bar Chart
              </button>
              <button
                onClick={() => {
                  setShowPieChart(true);
                  setShowBarChart(false);
                }}
                className={`px-4 py-2 rounded-md ${
                  showPieChart ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                Pie Chart
              </button>
            </div>
            {showBarChart && <Bar data={chartData} />}
            {showPieChart && <Pie data={chartData} />}
          </div>

          {/* Table Section */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <h3 className="text-lg font-bold p-4">Itineraries</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tourists
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(filteredItineraries.length > 0 ? filteredItineraries : report.itineraries).map(
                  (itinerary, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {itinerary.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {itinerary.language}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {itinerary.numberOfTourists}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {itinerary.availableDates[0]}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourGuideTouristReport;
