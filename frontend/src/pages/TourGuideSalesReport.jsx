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
    const [dateFields, setDateFields] = useState(["", ""]);

    const { showDialog } = dialog()
 
    const [filter, setFilter] = useState({});
    const { getItineraries, itineraries } = useItineraryStore();
    const [salesReport, setSalesReport] = useState([]);
    const [filteredReport, setFilteredReport] = useState([]);
    const [filters, setFilters] = useState({ itinerary: "", dateRange: { start: "", end: "" }, month: "" });
    // Helper function to format date in YYYY-MM-DD
    const formatDate = (date) => {
      if (!date) return null;
      const d = new Date(date);
      return isNaN(d) ? null : d.toISOString().split("T")[0]; // Format to YYYY-MM-DD
    };
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

    
    return (
    <div>{/* Sales Report Section */}
    
    <div className="relative p-10 max-w-3xl mx-auto mt-5 rounded-lg shadow-lg bg-gray-800 text-white">
        <h3 className="text-2xl text-center mb-4">Sales Report</h3>

       
      {/* Dynamic Date Fields */}
      <div className="flex items-center gap-2 mb-4 text-black mt-4">
      {dateFields.map((field, index) => (
          <div key={index} className="mb-4">
            <input
              value={field}
              type="date"  // Changed type to "date" to ensure YYYY-MM-DD format
              placeholder={`Enter date ${index + 1}`}
              className="rounded w-[200px] p-2 border border-[#ccc] rounded-md mr-2"
              onChange={(e) => {
                const newFields = [...dateFields];
                newFields[index] = e.target.value; // Set the new date value
                setDateFields(newFields);

                // Update the available dates in your state
                setFilters((prev) => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, start: newFields[0], end: newFields[1] }, // Automatically update the filter
                }));
              }}
            />
              {index === 0 ? (
              <span className="text-white m1-2">Start</span>
            ) : (
              <span className="text-white ml-2">End</span>
            )}
          </div>
        ))}
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