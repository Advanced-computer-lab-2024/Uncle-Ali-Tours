import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TouristPromos from '../components/TouristPromos.jsx';
import { useActivityStore } from '../store/activity';
import { useItineraryStore } from '../store/itinerary';
import { usePaymentStore } from '../store/payment';
import { useTouristStore } from '../store/tourist';
import { useTransportationActivityStore } from '../store/transportationActivity';
import { useUserStore } from '../store/user';
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
  , [currentItinerary, currentActivity,transportationActivity,itemList , user.chosenCurrency , quantity , selectedPaymentMethod]);

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
      sessionStorage.setItem("paymentItems", JSON.stringify(items));
      navigate(`/success/${type}`);
      console.log('Cash on Delivery selected...');
    }
  };

  if (itemList == null || price == null) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 sm:p-10">
            <h1 className="text-3xl font-bold text-white">Payment Page</h1>
          </div>
          
          <div className="p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                {items.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg shadow">
                    <p className="text-lg font-semibold text-gray-800">{item.itemData.name}</p>
                    <p className="text-gray-600">
                      Price: {(item.itemData.price * user.currencyRate).toFixed(2)} {user.chosenCurrency}
                    </p>
                  </div>
                ))}

                <div className="bg-orange-100 p-4 rounded-lg shadow">
                  <h2 className="text-2xl font-semibold text-orange-800 mb-2">
                    Total Price: {price.toFixed(2)} {user.chosenCurrency}
                  </h2>
                  <p className="text-orange-600">Discount: {discount}%</p>
                  {selectedPaymentMethod === 'wallet' && (
          <div>
          <p className="text-orange-600">Price: {(price).toFixed(2)} {user.chosenCurrency}</p>
          <p className="text-orange-600">Remaining Balance: {((tourist.myWallet *  user.currencyRate) - price).toFixed(2)} {user.chosenCurrency}</p>
          </div>
          )}
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={handlePromoCodeChange}
                    placeholder="Enter promo code"
                    className="w-full p-2 border rounded-md"
                  />
                  <button 
                    onClick={applyPromoCode} 
                    className="w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
                  >
                    Apply Promo Code
                  </button>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">Select Payment Method</h2>
                  {['creditCard', 'wallet', ...(type === 'product' ? ['cashOnDelivery'] : [])].map((method) => (
                    <label key={method} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value={method}
                        checked={selectedPaymentMethod === method}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-gray-700 capitalize">{method.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </label>
                  ))}
                </div>

                <button
                  onClick={handlePayment}
                  className="w-full bg-green-500 text-white px-4 py-3 rounded-md hover:bg-green-600 transition-colors text-lg font-semibold"
                >
                  Proceed to Payment
                </button>
              </div>

              <div>
                <TouristPromos userName={user.userName} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;