import React, { useState } from 'react';
import toast from 'react-hot-toast';

function Promo() {
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');

  const addPromo = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/promo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
        discount: discount,
      }),
    });

    const { success, message } = await res.json();

    if (success) {
      toast.success(message);
      setCode('');
      setDiscount('');
    } else {
      toast.error(message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800">Add Promo Code</h3>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <form className="grid gap-4" onSubmit={addPromo}>
          <input
            type="text"
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
            placeholder="Enter Promo Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <input
            type="number"
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
            placeholder="Enter Discount (%)"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
          <button
            type="submit"
            className="w-full py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition duration-300"
          >
            Add Promo
          </button>
        </form>
      </div>
    </div>
  );
}

export default Promo;
