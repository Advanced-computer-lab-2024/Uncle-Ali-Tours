import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useOrderStore } from "../store/order";
import { usePaymentStore } from "../store/payment";
import { useTouristStore } from "../store/tourist";
import { useUserStore } from "../store/user";


function SuccessfulPayment() {
    const { type } = useParams();
    const [items, setItems] = useState([]);
    const { user } = useUserStore();
    const { handleSuccessfulPaymentForTourist } = usePaymentStore();
    const { removeAllProductsCart } = useTouristStore();
    const { createOrder } = useOrderStore();

    useEffect(() => {
        const paymentItems = JSON.parse(sessionStorage.getItem("paymentItems"));
        console.log("Payment Items from Session Storage:", paymentItems); // Log the session storage data
        if (items) {
            setItems(paymentItems);
        }
        }, []);

        useEffect(() => {
            if (items.length > 0) {
                handleSuccessfulPaymentForTourist(user.userName, items, type);
                if (type === "product") {
                    
                    removeAllProductsCart(user.userName);

                    const orderData = JSON.parse(sessionStorage.getItem("orderData"));
                    createOrder(orderData);
                }
            }
        }, [items, type, user.userName, handleSuccessfulPaymentForTourist]); // Dependencies to ensure it runs when items are updated
        

        return (
            <div className="max-w-3xl mx-auto p-6 mt-10 mb-10 bg-white shadow-md rounded-lg text-center">
              <h1 className="text-3xl font-bold mb-4 text-green-600">Payment Successful</h1>
              <p className="text-lg mb-6">Your payment has been processed successfully!</p>
              <p className="text-gray-700 font-medium mb-6">Order Type: <span className="text-blue-600">{type}</span></p>
        
              {/* Display the items */}
              {items.length > 0 ? (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                      <h2 className="text-xl font-semibold mb-2">{item.itemData.name}</h2>
                      <p className="text-gray-700">Quantity: <span className="font-medium">{item.quantity}</span></p>
                      <p className="text-gray-700">Price: <span className="font-medium">${Number(item.itemData.price).toFixed(2)}</span></p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-red-500">No items to display.</p>
              )}
            </div>
          );
        }
        
        export default SuccessfulPayment;