import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/user';
import { toast, Toaster } from 'react-hot-toast';
import { FiLoader } from 'react-icons/fi';

const TouristReportPage = () => {
  const { user } = useUserStore();
  const [report, setReport] = useState({
    totalTourists: 0,
    activities: [],
    itineraries: []
  });

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

  if (!user.userName) return <FiLoader size={50} className="animate-spin mx-auto mt-[49vh]" />;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tourist Report</h1>
        <div className="bg-white shadow-xl rounded-lg overflow-hidden p-6">
          <p className="text-xl mb-4"><strong>Total Tourists:</strong> {report.totalTourists}</p>
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

