import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useActivityStore } from '../store/activity';
import { useItineraryStore } from '../store/itinerary';
import { usePaymentStore } from '../store/payment';
import { useTouristStore } from '../store/tourist';
import { useTransportationActivityStore } from '../store/transportationActivity';
import { useUserStore } from '../store/user';

function PaymentPage() {
  const location = useLocation();
  const { bookedHotel, bookedFlight } = location.state || {};
  const { type, id } = useParams();
  const [itemList, setItemList] = useState(null);
  const [price, setPrice] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('creditCard'); // Default method

  const { currentItinerary, getItineraryById } = useItineraryStore();
  const { currentActivity, getActivityById } = useActivityStore();
  const { getTransportationActivityById, transportationActivity } = useTransportationActivityStore();
  const { items, setSelectedItems, currency, setCurrency, createCheckoutSession , CheckoutUsingWallet} = usePaymentStore();
  const { user } = useUserStore();
  const { tourist , checkoutList } = useTouristStore();

  useEffect(() => {
    console.log(type, id);
    console.log("products checkoutList", checkoutList);
    const fetchItemDetails = async () => {
      try {
        switch (type) {
          case 'itinerary':
            await getItineraryById(id);
            break;
          case 'activity':
            await getActivityById(id);
            break;
          case 'tActivity':
            await getTransportationActivityById(id);
            break;
          default:
            throw new Error('Invalid type');
        }
      } catch (error) {
        console.error('Error fetching item details:', error);
      }
    };

    fetchItemDetails();

    setCurrency(user.chosenCurrency);

  }, [type, id , user.chosenCurrency]);

  useEffect(() => {
    if (type === 'itinerary') {
      console.log("itinerary currentItinerary", currentItinerary);
      setItemList(currentItinerary);
            setPrice(currentItinerary.price);
            console.log(currentItinerary);
            console.log(currentItinerary.price);
    }
    // Add logic to set item and price for 'activity' and 'product' if needed
    if (type === 'activity') {
            console.log("activity currentActivity", currentActivity);
            setItemList(currentActivity);
            setPrice(currentActivity.price);
            console.log(currentActivity);
            console.log(currentActivity.price);
    }
    if (type === 'tActivity') {
            console.log("tActivity transportationActivity", transportationActivity);
            setItemList(transportationActivity);
            setPrice(transportationActivity?.price);
            console.log(transportationActivity);
            console.log(transportationActivity?.price);
    
  }if (type === 'hotel') {
      console.log("bookedHotel", bookedHotel);
            setItemList(bookedHotel);
            setPrice(Number(bookedHotel.data.price.total));
            console.log(bookedHotel.data.price.total);
    }

    if (type === 'flight') {
      console.log("bookedFlight", bookedFlight);
            setItemList(bookedFlight);
            setPrice(bookedFlight.data.price.raw);
            console.log(bookedFlight.data.price.raw);
    }

    if (type === 'product') {
      console.log("product checkoutList", checkoutList);
      setItemList(checkoutList);
      let totalPrice = 0;
      checkoutList.forEach((product) => {
        totalPrice += product.productId.price * product.quantity * user.currencyRate;
      });
      setPrice(totalPrice);
    }

  }
  , [currentItinerary, currentActivity,transportationActivity,itemList , user.chosenCurrency]);

  useEffect(() => {
    console.log("itemList last useEffect: ", itemList);
    if (itemList) {
      console.log("itemList before calling setselected: ", itemList);
      setSelectedItems(itemList, type);
    }
    console.log("items: ", items);
  }
  , [itemList]);



  const handlePayment = () => {
    if (selectedPaymentMethod === 'creditCard') {
      createCheckoutSession(items, user.currencyRate, currency, type);
    } else if (selectedPaymentMethod === 'wallet') {
      CheckoutUsingWallet(items, user.userName , type);
      console.log('Processing payment using wallet...');
    } else if (selectedPaymentMethod === 'cashOnDelivery') {
      // Logic for Cash on Delivery
      console.log('Cash on Delivery selected...');
    }
  };

  if (itemList == null || price == null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Payment Page</h1>
      {items.map((item, index) => (
        <div key={index}>
          <p>Item: {item.itemData.name}</p>
          <p>
            Price: {(item.itemData.price * user.currencyRate).toFixed(2)} {user.chosenCurrency}
          </p>
        </div>
      ))}
      <h2>Total price: {(price).toFixed(0)} {user.chosenCurrency}</h2>

      {/* Payment Method Selection */}
      <h2>Select Payment Method</h2>
      <div>
        <label>
          <input
            type="radio"
            value="creditCard"
            checked={selectedPaymentMethod === 'creditCard'}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          />
          Credit Card
        </label>
        <label>
          <input
            type="radio"
            value="wallet"
            checked={selectedPaymentMethod === 'wallet'}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          />
          Wallet
        </label>
        <label>
          <input
            type="radio"
            value="cashOnDelivery"
            checked={selectedPaymentMethod === 'cashOnDelivery'}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          />
          Cash on Delivery
        </label>
      </div>

      {/* Conditional Rendering for Payment Method */}
      {selectedPaymentMethod === 'creditCard' && (
        <div>
          <p>Pay securely using your credit card.</p>
          <button onClick={handlePayment}>Pay</button>
        </div>
      )}
      {selectedPaymentMethod === 'wallet' && (
        <div>
          <p>Pay using your wallet balance.</p>
          <p>Wallet Balance:{(tourist.myWallet *  user.currencyRate)} {user.chosenCurrency}</p>
          <p>Price: {(price).toFixed(2)} {user.chosenCurrency}</p>
          <p>Remaining Balance: {((tourist.myWallet *  user.currencyRate) - price).toFixed(2)} {user.chosenCurrency}</p>
          <p>Do you want to proceed with the payment?</p>
          <button onClick={handlePayment}>Pay</button>
        </div>
      )}
      {selectedPaymentMethod === 'cashOnDelivery' && (
        <div>
          <p>Pay in cash upon delivery.</p>
          <button onClick={handlePayment}>Confirm Order</button>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;
