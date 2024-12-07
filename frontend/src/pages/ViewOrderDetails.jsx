import React, { useEffect, useState } from "react";
import { useOrderStore } from "../store/order";
import { useParams, useNavigate } from "react-router-dom";
import ProductContainerForSeller from "../components/ProductContainerForSeller";
import { FiLoader, FiPackage, FiCalendar, FiCreditCard, FiMapPin } from "react-icons/fi";
import Dialog, { dialog } from '../components/Dialog.jsx';
import toast from 'react-hot-toast';

function ViewOrderDetails() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { currentOrder, getOrderById, getCurrentOrders ,cancelOrder} = useOrderStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCurrentOrder, setIsCurrentOrder] = useState(false);
  const { showDialog } = dialog();

  const handleCancelClick = () => {
    showDialog();
  };
  const cancel = async () => {
    const { success, message } = await cancelOrder(currentOrder._id);
    success ? toast.success(message) : toast.error(message);
    
  };

  useEffect(() => {
    if (!id) {
      navigate("/"); // Redirect if no ID is provided
    } else {
      getOrderById(id); // Fetch the specific order by ID
    }
    const checkIfCurrentOrder = async () => {
      const response = await getCurrentOrders(user.userName);
      if (response.success) {
        const currentOrders = response.data;
        setIsCurrentOrder(currentOrders.some((order) => order._id === id));
      }
    };

    checkIfCurrentOrder();
  }, [id, getOrderById, getCurrentOrders, navigate, user.userName]);

  if (!currentOrder) {
    return <FiLoader size={50} className="animate-spin mx-auto mt-[49vh]" />;
  }

  // Ensure currentOrder.products is defined and an array
  const products = currentOrder.products || [];
  const displayTotal = currentOrder.total
    ? (currentOrder.total * user.currencyRate).toFixed(2)
    : "0.00";
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-pink-800 text-white p-6">
          <h1 className="text-3xl font-bold text-white">Order Details</h1>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <InfoCard icon={<FiCalendar />} title="Order Date" value={new Date(currentOrder.createdAt).toLocaleDateString()} />
            <InfoCard icon={<FiPackage />} title="Order ID" value={currentOrder._id} />
            <InfoCard icon={<FiCreditCard />} title="Total" value={`${displayTotal} ${user.chosenCurrency}`} />
            <InfoCard icon={<FiPackage />} title="Number of Items" value={products.length} />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Products</h2>
            <div className="space-y-4">
              {products.length > 0 ? (
                products.map((productItem) => (
                  <div key={productItem._id} className="w-full md:w-[50%] lg:w-[60%] mx-auto mb-6">
                    <ProductContainerForSeller
                      product={{
                        ...productItem.productId,
                        Available_quantity: productItem.quantity,
                      }}
                    />
                  </div>
                ))
              ) : (
                <p className="text-center text-xl text-gray-500">No products found in this order.</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Payment Information</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="flex items-center">
                  <FiCreditCard className="mr-2" />
                  <span className="font-medium">Payment Method:</span>
                  <span className="ml-2">{currentOrder.paymentMethod}</span>
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="flex items-center">
                  <FiMapPin className="mr-2" />
                  <span>{currentOrder.deliveryAddress}</span>
                </p>
              </div>
            </div>
          </div>
          <Dialog
            msg={"Are you sure you want to cancel this order"}
            accept={cancel}
            reject={() => console.log("Deletion canceled")}
            acceptButtonText='Yes'
            rejectButtonText='No'
          />
          {/* Cancel Order Button */}
          {isCurrentOrder && (
            <div className="text-center mt-8">
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                onClick={handleCancelClick}
              >
                Cancel Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="text-lg font-semibold ml-2">{title}</h3>
      </div>
      <p className="text-xl">{value}</p>
    </div>
  );
}

export default ViewOrderDetails;
