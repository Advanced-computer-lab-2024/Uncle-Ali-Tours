import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/user';
import { toast, Toaster } from 'react-hot-toast';
import { FiLoader } from 'react-icons/fi';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const TouristReportPage = () => {
  const { user } = useUserStore();
  const [report, setReport] = useState({
    totalTourists: 0,
    activities: [],
    itineraries: [],
  });
  const [showBarChart, setShowBarChart] = useState(true); // Default to Bar Chart
  const [showPieChart, setShowPieChart] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(""); // State to store selected month
  const [filteredItineraries, setFilteredItineraries] = useState([]); // State for filtered itineraries
  const [totalTouristsForMonth, setTotalTouristsForMonth] = useState(0); 

  const formatMonth = (date) => {
    if (!date) return "";
    const [month] = date.split("-");
    return month;
  };
  const handleMonthChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedMonth(selectedDate);

    const filtered = report.activities.filter((activity) => {
      const activityMonth = formatMonth(activity.date); // Format the itinerary date to YYYY-MM
      return activityMonth === selectedDate;
    });
    setFilteredItineraries(filtered);

    const totalTourists = filtered.reduce((acc, activity) => acc + activity.numberOfTourists, 0);
    setTotalTouristsForMonth(totalTourists);
  };


  useEffect(() => {
    if (user.userName) {
      fetchReport();
    }
  }, [user.userName]);

  const fetchReport = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/advertiser/report/${user.userName}`);
      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }
      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Failed to fetch report.', { className: 'text-white bg-gray-800' });
    }
  };

  const chartData = {
    labels: ['Total Tourists'],
    datasets: [
      {
        label: 'Total Tourists',
        data: [report.totalTourists],
        backgroundColor: '#4caf50',
        borderColor: '#4caf50',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ['Total Tourists'],
    datasets: [
      {
        label: 'Total Tourists',
        data: [report.totalTourists],
        backgroundColor: ['#4caf50'],
      },
    ],
  };

  if (!user.userName) return <FiLoader size={50} className="animate-spin mx-auto mt-[49vh]" />;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tourist Report</h1>
        <div className="bg-white shadow-xl rounded-lg overflow-hidden p-6">
          {/* Filter and Toggle Charts */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => {
                setShowBarChart(true);
                setShowPieChart(false);
              }}
              className={`px-4 py-2 rounded-lg ${showBarChart ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Bar Chart
            </button>
            <button
              onClick={() => {
                setShowPieChart(true);
                setShowBarChart(false);
              }}
              className={`px-4 py-2 rounded-lg ${showPieChart ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Pie Chart
            </button>
          </div>
          {/* Charts Section */}
          <div className="flex gap-8 mb-8">
            <div className="w-full lg:w-1/2">
              {showBarChart && (
                <>
                  <h3 className="text-xl font-semibold mb-4">Total Tourists (Bar Chart)</h3>
                  <Bar data={chartData} />
                </>
              )}
            </div>
            <div className="w-full lg:w-1/2">
              {showPieChart && (
                <>
                  <h3 className="text-xl font-semibold mb-4">Total Tourists (Pie Chart)</h3>
                  <Pie data={pieChartData} />
                </>
              )}
            </div>
          </div>

          {/* Activities Table */}
          <div className="mt-4">
            <h3 className="text-2xl font-semibold mb-4">Activities</h3>
            <table className="w-full text-left text-sm border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Title</th>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">Tourists</th>
                </tr>
              </thead>
              <tbody>
                {report.activities.length > 0 ? (
                  report.activities.map((activity, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">{activity.title}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(activity.date).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{activity.numberOfTourists}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="border border-gray-300 px-4 py-2 text-center">
                      No activities available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristReportPage;
