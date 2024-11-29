import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useActivityStore } from '../store/activity';
import { useItineraryStore } from '../store/itinerary';
import { usePaymentStore } from '../store/payment';
import { useUserStore } from '../store/user';

function PaymentPage() {
  const location = useLocation();
  const { bookedHotel , bookedFlight} = location.state;
  const { type, id } = useParams();
  const [itemList, setItemList] = useState(null);
  const [price, setPrice] = useState(0);

  const { currentItinerary , getItineraryById } = useItineraryStore();
  const { currentActivity, getActivityById } = useActivityStore();
  const { items ,setSelectedItems ,currency ,setCurrency , createCheckoutSession } = usePaymentStore();
  const { user } = useUserStore();

  useEffect(() => {
    console.log(type, id);
    console.log("bookedHotel: " ,bookedHotel);
    const fetchItemDetails = async () => {
      try {
        switch (type) {
          case 'itinerary':
            await getItineraryById(id);
            break;
          // Add cases for 'activity' and 'product' if needed
          case 'activity':
            await getActivityById(id);
            break;

          default:
            throw new Error('Invalid type');
        }
      } catch (error) {
        console.error('Error fetching item details:', error);
      }
    };

    if (type === 'hotel') {
      console.log("bookedHotel", bookedHotel);
            setItemList(bookedHotel);
            setPrice(bookedHotel.data.price.total);
            console.log(bookedHotel.data.price.total);
    }

    if (type === 'flight') {
      console.log("bookedFlight", bookedFlight);
            setItemList(bookedFlight);
            setPrice(bookedFlight.data.price.raw);
            console.log(bookedFlight.data.price.raw);
    }

    fetchItemDetails();

    setCurrency(user.chosenCurrency);
  }, [type, id , user.chosenCurrency]);

  useEffect(() => {
    console.log("itemlist: ", itemList);
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
    
  }
  , [currentItinerary, currentActivity,itemList]);

  useEffect(() => {
    console.log("itemList last useEffect: ", itemList);
    if (itemList) {
      console.log("itemList before calling setselected: ", itemList);
      setSelectedItems(itemList, type);
    }
    console.log("items: ", items);
  }
  , [itemList]);


  if (!itemList) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Payment Page</h1>
      <p>Item: {itemList.name}</p>
      <p>Price: {(price * user.currencyRate).toFixed(2)} {user.chosenCurrency}</p>
      <button onClick={() => createCheckoutSession(items, user.currencyRate, currency)}>Pay</button>
    </div>
  );
}

export default PaymentPage;