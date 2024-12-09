// ViewMyOrders.jsx
import React, { useState, useEffect } from 'react';
import { useOrderStore } from '../store/order';
import ProductContainerForSeller from '../components/ProductContainerForSeller';
import OrderContainer from '../components/OrderContainer';
function ViewMyOrders() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { getCurrentOrders, getPastOrders } = useOrderStore();
  const [orders, setOrders] = useState([]);
  const [currentButton, setCurrentButton] = useState(false);
  const [curOrder, setCurOrder] = useState({});

  useEffect(() => {
    fetchOrders();
  }, [currentButton]);

  const changeOrder = (order) => {
    setCurOrder(order);
  };

  const fetchOrders = async () => {
    const result = currentButton
      ? await getPastOrders(user.userName)
      : await getCurrentOrders(user.userName);
    
    if (result.success) {
      setOrders(result.data);
    } else {
      console.error("Failed to fetch orders:", result.message);
      setOrders([]);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-b shadow-xl relative from-[#C1BAA1] min-h-[60vh] w-full mx-auto rounded-lg p-6">
      <h1 className='justify-center text-2xl'>My Orders</h1>
      <br/>
      <div className="flex justify-center mb-4">
                <button
                  className={`px-4 py-2 rounded-l-lg ${
                    !currentButton
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setCurrentButton(false)}
                >
                  Current
                </button>
                <button
                  className={`px-4 py-2 rounded-r-lg ${
                    currentButton
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setCurrentButton(true)}
                >
                  Past
                </button>
              </div>
        <div className="mt-24">
          {orders.length > 0 ? (
            orders.map((order) => (
              <OrderContainer 
                key={order._id} 
                order={order} 
                orderChanger={changeOrder}
              />
            ))
          ) : (
            <p className="text-center text-xl text-white">No orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewMyOrders;