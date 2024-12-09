import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useActivityStore } from '../store/activity';
import { useItineraryStore } from '../store/itinerary';
import { usePaymentStore } from '../store/payment';
import { useTouristStore } from '../store/tourist';
import { useTransportationActivityStore } from '../store/transportationActivity';
import { useUserStore } from '../store/user';
import axios from 'axios';
function PaymentPage() {
  const location = useLocation();
  const { bookedHotel, bookedFlight } = location.state || {};
  const { quantity } = location.state || 1;
  const { type, id } = useParams();
  const [itemList, setItemList] = useState(null);
  const [price, setPrice] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('creditCard');
  const [orderData, setOrderData] = useState(null);

  const { currentItinerary, getItineraryById } = useItineraryStore();
  const { currentActivity, getActivityById } = useActivityStore();
  const { getTransportationActivityById, transportationActivity } = useTransportationActivityStore();
  const { items, setSelectedItems, currency, setCurrency, createCheckoutSession , CheckoutUsingWallet } = usePaymentStore();
  const { user } = useUserStore();
  const { tourist , checkoutList } = useTouristStore();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const userName = user.userName;
  const handlePromoCodeChange = (e) => {
    setPromoCode(e.target.value);
  };

  const applyPromoCode = async () => {
    try {
        const res = await fetch('/api/promo/applyPromo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userName, promoCode }) // Fix: Correctly structure the JSON body
        });

        const result = await res.json();

        if (result.success) {
            setDiscount(result.data.discount);
            setPrice(price*(1-result.data.discount/100));
            alert(`Promo code applied! You get a ${result.data.discount}% discount.`);
        } else {
            alert(result.message || 'Invalid promo code');
        }
    } catch (error) {
        console.error('Error applying promo code:', error);
        alert('Error applying promo code');
    }
};

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
            setPrice(currentItinerary.price*quantity * user.currencyRate);
            console.log(currentItinerary);
            console.log(currentItinerary.price);
    }
    // Add logic to set item and price for 'activity' and 'product' if needed
    if (type === 'activity') {
            console.log("activity currentActivity", currentActivity);
            setItemList(currentActivity);
            setPrice(currentActivity.price*quantity * user.currencyRate);
            console.log(currentActivity);
            console.log(currentActivity.price);
    }
    if (type === 'tActivity') {
            console.log("tActivity transportationActivity", transportationActivity);
            setItemList(transportationActivity);
            setPrice(transportationActivity?.price*quantity * user.currencyRate);
            console.log(transportationActivity);
            console.log(transportationActivity?.price);
    
  }if (type === 'hotel') {
      console.log("bookedHotel", bookedHotel);
            setItemList(bookedHotel);
            setPrice(Number(bookedHotel.data.price.total * user.currencyRate));
            console.log(bookedHotel.data.price.total);
    }

    if (type === 'flight') {
      console.log("bookedFlight", bookedFlight);
            setItemList(bookedFlight);
            setPrice(bookedFlight.data.price.raw * user.currencyRate);
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

      const orderDataProducts = checkoutList.map((product) => ({
        productId: product.productId._id,
        quantity: product.quantity,
      }));
      setOrderData({
        creator: user.userName,
        products: orderDataProducts,
        deliveryAddress:"l7d ma n3mel el deliveryAddress",
        paymentMethod: selectedPaymentMethod,
        total: price,
      });
    }

  }
  , [currentItinerary, currentActivity,transportationActivity,itemList , user.chosenCurrency , quantity]);

  useEffect(() => {
    console.log("itemList last useEffect: ", itemList);
    if (itemList) {
      console.log("itemList before calling setselected: ", itemList);
      setSelectedItems(itemList, type , quantity);
    }
    console.log("items: ", items);
  }
  , [itemList]);


  const handlePayment = () => {
    console.log('Processing payment...', orderData);
    sessionStorage.setItem('orderData', JSON.stringify(orderData));

    if (selectedPaymentMethod === 'creditCard') {
      createCheckoutSession(items, user.currencyRate, currency, type);
    } else if (selectedPaymentMethod === 'wallet') {
      CheckoutUsingWallet(items, user.userName , type);
      console.log('Processing payment using wallet...');
    } else if (selectedPaymentMethod === 'cashOnDelivery') {
      navigate(`/success/${type}`);
      console.log('Cash on Delivery selected...');
    }
  };

  if (itemList == null || price == null) {
    return <div>Loading...</div>;
  }
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10 mb-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Payment Page</h1>

      {items.map((item, index) => (
        <div key={index} className="mb-4 border-b pb-2">
          <p className="text-lg font-semibold">Item: {item.itemData.name}</p>
          <p className="text-gray-700">
            Price: {(item.itemData.price * user.currencyRate).toFixed(2)} {user.chosenCurrency}
          </p>
        </div>
      ))}

      <h2 className="text-2xl font-bold mt-6 mb-4">Total Price: {(price).toFixed(2)} {user.chosenCurrency}</h2>

      <div className="mb-6">
        <input
          type="text"
          value={promoCode}
          onChange={handlePromoCodeChange}
          placeholder="Enter promo code"
          className="w-full p-2 border rounded-md mb-2"
        />
        <button onClick={applyPromoCode} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Apply Promo Code
        </button>
        <p className="mt-2 text-green-500">Discount: {discount}%</p>
      </div>

      <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
      <div className="space-y-2 mb-6">
        <label className="block">
          <input
            type="radio"
            value="creditCard"
            checked={selectedPaymentMethod === 'creditCard'}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          />
          Credit Card
        </label>
        <label className="block">
          <input
            type="radio"
            value="wallet"
            checked={selectedPaymentMethod === 'wallet'}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          />
          Wallet
        </label>
        {type === 'product' && (
          <label className="block">
            <input
              type="radio"
              value="cashOnDelivery"
              checked={selectedPaymentMethod === 'cashOnDelivery'}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            />
            Cash on Delivery
          </label>
        )}
      </div>

      <button
        onClick={handlePayment}
        className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-lg font-semibold"
      >
        Proceed to Payment
      </button>
    </div>
  );
}

export default PaymentPage;
