import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/user';
import { useActivityStore } from "../store/activity";
import { toast, Toaster } from 'react-hot-toast';
import { FiLoader } from 'react-icons/fi';

const SalesReportPage = () => {
  const { user } = useUserStore();
  const { getActivities, activities } = useActivityStore();
  const [filter, setFilter] = useState({});
  const [salesReport, setSalesReport] = useState([]);
  const [filteredReport, setFilteredReport] = useState([]);
  const [filters, setFilters] = useState({ product: "", dateRange: { start: "", end: "" }, month: "" });

  useEffect(() => {
    fetchSalesReport();
  }, [user.userName]);

  const fetchSalesReport = async () => {
    await getActivities({ ...filter, creator: user.userName });
    const activitiesSales = activities.map((activity) => ({
      name: activity.name,
      revenue: (activity.numberOfBookings || 0) * activity.price,
      dates: activity.date || "2024-11-01",
    }));
    setSalesReport(activitiesSales);
    setFilteredReport(activitiesSales);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    let filtered = salesReport;

    if (filters.dateRange.start && filters.dateRange.end) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.dates);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    if (filters.month) {
      filtered = filtered.filter((item) => new Date(item.dates).getMonth() + 1 === parseInt(filters.month));
    }

    setFilteredReport(filtered);
  };

  if (!user.userName) return <FiLoader size={50} className="animate-spin mx-auto mt-[49vh]" />;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sales Report</h1>
        <div className="bg-white shadow-xl rounded-lg overflow-hidden p-6">
          <div className="mb-4 flex gap-4">
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleFilterChange("dateRange", { ...filters.dateRange, start: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleFilterChange("dateRange", { ...filters.dateRange, end: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
            <button
              onClick={applyFilters}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Apply Filters
            </button>
          </div>
          <table className="w-full text-left text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Revenue</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredReport.length > 0 ? (
                filteredReport.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                    <td className="border border-gray-300 px-4 py-2">${item.revenue}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.dates}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="border border-gray-300 px-4 py-2 text-center">
                    No sales data available for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesReportPage;

