import React, { useEffect, useState, useRef } from "react";
import { useUserStore } from '../store/user';
import { useGuideStore } from '../store/tourGuide';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Dialog, { dialog } from '../components/Dialog.jsx';
import AvatarEditor from 'react-avatar-editor';
import { FaEye, FaEdit } from 'react-icons/fa';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { useRequestStore } from '../store/requests.js';
import { FiLoader } from "react-icons/fi";
import {useItineraryStore} from "../store/itinerary";

const TourGuideSalesReport = () => {
 
    const {user} = useUserStore();
 
    const { showDialog } = dialog()
 
    const [filter, setFilter] = useState({});
    const { getItineraries, itineraries } = useItineraryStore();
    const [salesReport, setSalesReport] = useState([]);
    const [filteredReport, setFilteredReport] = useState([]);
    const [filters, setFilters] = useState({ product: "", dateRange: { start: "", end: "" }, month: "" });
  
     useEffect(() => {
      fetchSalesReport();
     },[itineraries]);
    const fetchSalesReport = async () => {
      await getItineraries({ ...filter, creator: user.userName }); // Ensure itineraries are fetched

    
      const itinerariesSales = itineraries
        .map((itinerary) => ({
          name: itinerary.name,
          revenue: (itinerary.numberOfBookings || 0) * itinerary.price,
          availableDates: itinerary.availableDates || "2024-11-01",
        }));
    
      const data = [
        ...itinerariesSales,
      ];
    
      setSalesReport(data);
      
      setFilteredReport(data);
    };
    const handleFilterChange = (field, value) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
    };
  
    const applyFilters = () => {
      let filtered = salesReport;
  
  
  
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

    return (
    <div>{/* Sales Report Section */}
    
    <div className="relative p-10 max-w-3xl mx-auto mt-5 rounded-lg shadow-lg bg-gray-800 text-white">
        <h3 className="text-2xl text-center mb-4">Sales Report</h3>

        {/* Filters */}
        <div className="flex gap-4 mb-4">

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
        <th className="py-2 px-4">Name</th>
        <th className="py-2 px-4">Revenue</th>
        <th className="py-2 px-4">Available Dates</th>
        </tr>
        </thead>
        <tbody>
        {filteredReport.length > 0 ? (
        filteredReport.map((item, index) => (
        <tr key={index} className="border-b border-gray-600">
        <td className="py-2 px-4">{item.name}</td>
        <td className="py-2 px-4">${item.revenue}</td>
        <td className="py-2 px-4">{item.availableDates}</td>
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

        </div></div>
  )
}

export default TourGuideSalesReport