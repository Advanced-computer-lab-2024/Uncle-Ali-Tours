import React, { useState } from "react";
import axios from "axios";

const BookTicketButton = ({ userId, itemId, itemType, price }) => {
  const [isBooking, setIsBooking] = useState(false);

  const handleBooking = async () => {
    try {
      setIsBooking(true);
      const response = await axios.post("/api/bookings", {
        userId,
        itemId,
        itemType,
        price,
      });
      console.log("Booking confirmed:", response.data.booking);
      alert("Booking confirmed!");
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <button onClick={handleBooking} disabled={isBooking}>
      {isBooking ? "Booking..." : "Book Ticket"}
    </button>
  );
};

export default BookTicketButton;
