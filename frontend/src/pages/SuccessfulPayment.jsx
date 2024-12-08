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
        <div>
            <h1>Payment Successful</h1>
            <p>Your payment has been successful.</p>
            <p>{type}</p>
           {/* Display the items */}
      {items.map((item, index) => (
        <div key={index}>
          <p>{item.itemData.name}</p>
          <p>Quantity: {item.quantity}</p>
            <p>Price: {item.itemData.price}</p>
        </div>
      ))}
        </div>
    );
}

export default SuccessfulPayment;