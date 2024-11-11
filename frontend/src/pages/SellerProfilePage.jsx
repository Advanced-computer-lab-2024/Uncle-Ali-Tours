import { useUserStore } from '../store/user';
import React, { useEffect, useState } from 'react';
import { useSellerStore } from '../store/seller';
import { useProductStore } from '../store/product';
import { useNavigate } from 'react-router-dom';
import ProductContainerForSeller from '../components/ProductContainerForSeller';
import toast, { Toaster } from 'react-hot-toast';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SellerProfile = () => {
  const { user } = useUserStore(); 
  const { sell, getSeller, updateSeller } = useSellerStore(); 
  const { getProducts, products } = useProductStore();
    const [filter, setFilter] = useState({});
  const [isRequired, setIsRequired] = useState(true);
  const [updatedSeller, setUpdatedSeller] = useState({});
  const [showChart, setShowChart] = useState(false); // Toggle for chart visibility

  const handleButtonClick = () => setIsRequired(false);

  const handleButtonClickk = async () => {
    if (!isRequired) {
      const { success, message } = await updateSeller(user.userName, updatedSeller);
      success ? toast.success(message, { className: "text-white bg-gray-800" }) : toast.error(message, { className: "text-white bg-gray-800" });
    }
  };

  const handlePress = async () => {
    // Fetch products filtered by the seller's userName
    await getProducts({ ...filter , creator: user.userName }, {});
    setShowChart(true); // Show chart after fetching products
  };

  const navigate = useNavigate();
  const handleRedirect = () => navigate('/product');

  useEffect(() => {
    getSeller({ userName: user.userName }, {});
  }, []);


  // Prepare data for Bar chart
  const getSalesData = () => {
    return {
      labels: products.map(product => product.name),
      datasets: [
        {
          label: 'Sales',
          data: products.map(product => product.sales || 0),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
  };

  return (
    <div className="relative p-10 max-w-3xl mx-auto mt-5 rounded-lg shadow-lg bg-gray-800 text-white">
      <Toaster />
  
      <div className="flex items-center border-b border-gray-600 pb-5 mb-5">
        <div className="w-24 h-24 rounded-full bg-gray-900 mr-5"></div>
        <div>
          <h1 className="text-white text-2xl font-bold">{sell.userName || 'John Doe'}</h1>
          <h2 className="text-gray-400 text-xl">Seller</h2>
        </div>
      </div>

      <div className="relative p-10 max-w-3xl mx-auto mt-5 rounded-lg shadow-lg bg-gray-800 text-white">
        <h1 className="text-lg mb-4">Profile</h1>
        <div spacing={4} align="stretch">
          <label>
            NAME:
            <input
              type="text"
              name="name"
              defaultValue={sell.userName || ''}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2"
              readOnly={isRequired}
              onChange={(e) => setUpdatedSeller({ ...updatedSeller, userName: e.target.value })}
            />
          </label>
          <label>
            Email:
            <input
              type="text"
              name="email"
              defaultValue={sell.email || ''}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2"
              readOnly={isRequired}
              onChange={(e) => setUpdatedSeller({ ...updatedSeller, email: e.target.value })}
            />
          </label>
          <label>
            Mobile number:
            <input
              type="text"
              name="mobileNumber"
              defaultValue={sell.mobileNumber || ''}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-2"
              readOnly={isRequired}
              onChange={(e) => setUpdatedSeller({ ...updatedSeller, mobileNumber: e.target.value })}
            />
          </label>
        </div>
        <div className="flex justify-between mt-6">
          <button className="bg-black text-white p-2 rounded" onClick={handleButtonClick}>Edit</button>
          <button className="bg-black text-white p-2 rounded" onClick={handleButtonClickk}>Save</button>
          <button className="bg-black text-white p-2 rounded" onClick={handleRedirect}>Product</button>
        </div>

        <button className='p-2 bg-black text-white mt-4' onClick={handlePress}>View My Products</button>
        
        {/* Product List */}
        <div className="grid w-fit mx-auto">
          <h2 className="text-xl mb-4">Available Products</h2>
          {products.map((product, index) => (
            !product.archive && (<ProductContainerForSeller key={index} product={product} />)
          ))}
        </div>

        {/* Sales Chart */}
        {showChart && products.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl text-center">Sales Data</h3>
            <Bar data={getSalesData()} options={{ responsive: true }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProfile;
