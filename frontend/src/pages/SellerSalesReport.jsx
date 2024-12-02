import React, { useEffect, useState, useRef } from "react";
import { useUserStore } from "../store/user";
import { useSellerStore } from "../store/seller";
import { useProductStore } from "../store/product";
import { useNavigate } from "react-router-dom";
import ProductContainerForSeller from "../components/ProductContainerForSeller";
import toast, { Toaster } from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { Bar } from "react-chartjs-2";
import { IoSaveOutline } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { FaArrowRotateRight } from "react-icons/fa6";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FiLoader } from "react-icons/fi";
import avatar from "/avatar.png";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import { useRequestStore } from "../store/requests.js";

import axios from "axios";
import { Modal } from "react-bootstrap";
import { FaEye, FaEdit } from "react-icons/fa";
import AvatarEditor from "react-avatar-editor";
import { set } from "mongoose";
import UnVerified from "../components/UnVerified.jsx";

const SellerSalesReport= () => {
    const [salesReport, setSalesReport] = useState([]);
  const [filteredReport, setFilteredReport] = useState([]);
  const [filters, setFilters] = useState({ product: "", dateRange: { start: "", end: "" }, month: "" });
  const { getProducts, products } = useProductStore();
  const [filter, setFilter] = useState({});
  const { user } = useUserStore();
    useEffect(() => {
        fetchSalesReport();
       });
      const fetchSalesReport = async () => {
        await getProducts({ ...filter, creator: user.userName }); // Ensure products are fetched
        if (products.length === 0) {
          console.error("No products fetched");
          return;
        }
      
        const productsSales = products
          .map((product) => ({
            name: product.name,
            revenue: (product.sales || 0) * product.price,
          }));
      
        const data = [
          ...productsSales,
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
    <div>                      {/* Sales Report Section */}
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
        </tr>
        </thead>
        <tbody>
        {filteredReport.length > 0 ? (
        filteredReport.map((item, index) => (
        <tr key={index} className="border-b border-gray-600">
        <td className="py-2 px-4">{item.name}</td>
        <td className="py-2 px-4">${item.revenue}</td>
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

        </div></div>
  )
}

export default SellerSalesReport