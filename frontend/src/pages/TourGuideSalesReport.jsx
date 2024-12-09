import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { useUserStore } from "../store/user";
import { useItineraryStore } from "../store/itinerary";
import { FiLoader } from "react-icons/fi";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const TourGuideSalesReport = () => {
  const { user } = useUserStore();
  const [dateFields, setDateFields] = useState(["", ""]);
  const [filter, setFilter] = useState({});
  const { getItineraries, itineraries } = useItineraryStore();
  const [salesReport, setSalesReport] = useState([]);
  const [filteredReport, setFilteredReport] = useState([]);
  const [filters, setFilters] = useState({ dateRange: { start: "", end: "" } });
  const [isLoading, setIsLoading] = useState(true);
  const [showBarChart, setShowBarChart] = useState(true); // Default to showing Bar Chart
  const [showPieChart, setShowPieChart] = useState(false);

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return isNaN(d) ? null : d.toISOString().split("T")[0];
  };

  useEffect(() => {
    fetchSalesReport();
  }, [itineraries , filters]);

  const fetchSalesReport = async () => {
    setIsLoading(true);
    await getItineraries({ ...filter, creator: user.userName });

    const itinerariesSales = itineraries.map((itinerary) => ({
      name: itinerary.name,
      revenue: (itinerary.numberOfBookings || 0) * itinerary.price,
      availableDates: itinerary.availableDates || ["2024-11-01"],
      bookings: itinerary.numberOfBookings || 0,
      price: itinerary.price || 0,
    }));

    setSalesReport(itinerariesSales);
    setFilteredReport(itinerariesSales);
    setIsLoading(false);
  };

  useEffect(() => {
    let filtered = salesReport;

    if (filters.dateRange.start && filters.dateRange.end) {
      const startDate = formatDate(filters.dateRange.start);
      const endDate = formatDate(filters.dateRange.end);

      filtered = filtered.filter((item) => {
        const availableDates = item.availableDates.map(formatDate);
        return availableDates.some(
          (availableDate) => availableDate >= startDate && availableDate <= endDate
        );
      });
    }

    setFilteredReport(filtered);
  }, [filters, salesReport]);

  // Chart Data
  const chartData = { 
    labels: filteredReport.map((item) => item.name),
    datasets: [
      {
        label: "Revenue",
        data: filteredReport.map((item) => item.revenue),
        backgroundColor: ["#4caf50", "#2196f3", "#ff9800", "#f44336", "#9c27b0"],
        borderColor: ["#4caf50", "#2196f3", "#ff9800", "#f44336", "#9c27b0"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Sales Report</h1>

        {/* Date Range Selector */}
        <div className="mb-6 flex justify-center space-x-4">
          {dateFields.map((field, index) => (
            <div key={index} className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">
                {index === 0 ? "Start Date" : "End Date"}
              </label>
              <input
                type="date"
                value={field}
                className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  const newFields = [...dateFields];
                  newFields[index] = e.target.value;
                  setDateFields(newFields);
                  setFilters((prev) => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, [index === 0 ? "start" : "end"]: e.target.value },
                  }));
                }}
              />
            </div>
          ))}
        </div>

        {/* Chart and Table Layout */}
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
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <FiLoader className="animate-spin h-8 w-8 text-blue-600" />
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bookings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReport.length > 0 ? (
                    filteredReport.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${item.revenue.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.bookings}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${item.price.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                        No sales data available for the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourGuideSalesReport;
