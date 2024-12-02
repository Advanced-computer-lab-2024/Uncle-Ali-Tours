import React from 'react';
import { useParams } from 'react-router-dom';

function CancelledPayment() {
    const { type } = useParams();
   const handleClick = async ()=> {
        window.location.href = "/touristProfile";
    }
  return (
    <div>
      <h1>Payment Cancelled</h1>
      <p>Your payment has been cancelled.</p>
      <p>{type}</p>
      <button onClick={() => handleClick()}>back to profile</button>
    </div>
  );
}

export default CancelledPayment;