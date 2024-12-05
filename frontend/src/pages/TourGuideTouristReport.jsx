import React, { useEffect, useState } from "react"; // Ensure React is properly imported
import { useUserStore } from '../store/user';
import toast, { Toaster } from 'react-hot-toast';

const TourGuideTouristReport = () => {
  const { user } = useUserStore(); // Get user from the store
  const [report, setReport] = useState({
    totalTourists: 0,
    activities: [],
    itineraries: []
  });

  const [selectedMonth, setSelectedMonth] = useState(""); // State to store selected month
  const [filteredItineraries, setFilteredItineraries] = useState([]); // State for filtered itineraries
  const [totalTouristsForMonth, setTotalTouristsForMonth] = useState(0); // State to track tourists count for the selected month
  const formatMonth = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  };
  useEffect(() => {
    // Fetch report data on component mount
    const fetchReport = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/tourGuide/report/${user.userName}`);
        if (!response.ok) {
          throw new Error('Failed to fetch report');
        }
        const data = await response.json(); // Parse the JSON data
        console.log('Fetched Report:', data); // Debug log
        setReport(data); // Update report state
      } catch (error) {
        console.error('Error fetching report:', error);
        toast.error('Failed to fetch report.', { className: 'text-white bg-gray-800' });
      }
    };

    if (user.userName) {
      fetchReport(); // Fetch data when username is available
    }
  }, [user.userName]); // Fetch data when username changes

  // Handle month change
  const handleMonthChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedMonth(selectedDate);

    // Filter itineraries for the selected month
    const filtered = report.itineraries.filter((itinerary) => {
      const itineraryMonth = formatMonth(itinerary.availableDates[0]); // Format the itinerary date to YYYY-MM
      return itineraryMonth === selectedDate;
    });
    setFilteredItineraries(filtered); // Update filtered itineraries

    // Calculate total tourists for the selected month
    const totalTourists = filtered.reduce((acc, itinerary) => acc + itinerary.numberOfTourists, 0);
    setTotalTouristsForMonth(totalTourists); // Update total tourists for the selected month
  };

  return (
    <div>
      <Toaster /> {/* Display toasts for notifications */}
      {/* Report Section */}
      <div className="relative p-10 max-w-3xl mx-auto mt-5 rounded-lg shadow-lg bg-gray-800 text-white">
        <h2 className="text-xl mb-4">Tourist Report</h2>
        <p>
          <strong>Total Tourists:</strong> {report.totalTourists}
        </p>

        {/* Month Selection */}
        <div className="flex items-center gap-2 mt-4">
          <label htmlFor="month" className="text-white">Select Month</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="p-2 bg-gray-700 text-white rounded"
          >
            <option value="">--Select Month--</option>
            {/* Generate options for each month */}
            {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        {/* Display total tourists for the selected month */}
        <div className="mt-4">
          <strong>Total Tourists in {selectedMonth}:</strong> {totalTouristsForMonth}
        </div>


        <div className="mt-4">
        <h3 className="text-lg mb-2">Itineraries</h3>
        <table className="w-full text-left text-sm border-collapse border border-gray-600">
          <thead>
            <tr>
              <th className="border border-gray-600 px-2 py-1">Title</th>
              <th className="border border-gray-600 px-2 py-1">Language</th>
              <th className="border border-gray-600 px-2 py-1">Tourists</th>
              <th className="border border-gray-600 px-2 py-1">Date</th>

            </tr>
          </thead>
          <tbody>
          {(filteredItineraries.length > 0 ? filteredItineraries : report.itineraries).length > 0 ? (
                (filteredItineraries.length > 0 ? filteredItineraries : report.itineraries).map((itinerary, index) => (
                <tr key={index}>
                  <td className="border border-gray-600 px-2 py-1">{itinerary.title}</td>
                  <td className="border border-gray-600 px-2 py-1">
                    {itinerary.language}
                  </td>
                  <td className="border border-gray-600 px-2 py-1">{itinerary.numberOfTourists}</td>
                  <td className="border border-gray-600 px-5 py-1">{itinerary.availableDates }</td>

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

export default TourGuideTouristReport;
