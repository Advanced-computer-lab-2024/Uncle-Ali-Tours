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



const tourGuideTouristReport = () =>{
    const {user} = useUserStore();
const [report, setReport] = useState({
    totalTourists: 0,
    activities: [],
    itineraries: []
  });
useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/tourGuide/report/${user.userName}`);
        if (!response.ok) {
          throw new Error('Failed to fetch report');
        }
        const data = await response.json(); // Parse the JSON data
        console.log('Fetched Report:', data); // Debug log
        setReport(data); // Update the report state
      } catch (error) {
        console.error('Error fetching report:', error);
        toast.error('Failed to fetch report.', { className: 'text-white bg-gray-800' });
      }
    };
  
    if (user.userName) {
      fetchReport();
    }
  }, [user.userName]);
  return (
    <div> 
            <Toaster/>
            {/* Report Section */}
            <div className="relative p-10 max-w-3xl mx-auto mt-5 rounded-lg shadow-lg bg-gray-800 text-white">
      <h2 className="text-xl mb-4">Tourist Report</h2>
      <p>
        <strong>Total Tourists:</strong> {report.totalTourists}
      </p>
     

    <div className="mt-4">
        <h3 className="text-lg mb-2">Itineraries</h3>
        <table className="w-full text-left text-sm border-collapse border border-gray-600">
          <thead>
            <tr>
              <th className="border border-gray-600 px-2 py-1">Title</th>
              <th className="border border-gray-600 px-2 py-1">Language</th>
              <th className="border border-gray-600 px-2 py-1">Tourists</th>
            </tr>
          </thead>
          <tbody>
            {report.itineraries.length > 0 ? (
              report.itineraries.map((itinerary, index) => (
                <tr key={index}>
                  <td className="border border-gray-600 px-2 py-1">{itinerary.title}</td>
                  <td className="border border-gray-600 px-2 py-1">
                    {itinerary.language}
                  </td>
                  <td className="border border-gray-600 px-2 py-1">{itinerary.numberOfTourists}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border border-gray-600 px-2 py-1" colSpan="3">
                  No itineraries available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div></div>
  )
}

export default tourGuideTouristReport