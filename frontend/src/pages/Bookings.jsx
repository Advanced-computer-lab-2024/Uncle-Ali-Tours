// components/pages/BookingsPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(response.data);
      } catch (error) {
        console.error('Failed to load bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <h1>Your Bookings</h1>
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <div key={booking._id}>
            <h3>{booking.itineraryId.name}</h3>
            <p>Booked on: {new Date(booking.bookingDate).toLocaleDateString()}</p>
          </div>
        ))
      ) : (
        <p>You have no bookings.</p>
      )}
    </div>
  );
};

export default BookingsPage;
