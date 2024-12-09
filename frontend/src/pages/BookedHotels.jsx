import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useHotelStore } from "../store/hotel";
import { useTouristStore } from "../store/tourist";
import { useUserStore } from "../store/user";

function BookedHotels() {
    const { user } = useUserStore();
    const {  getBookedHotels , userBookedHotels , deleteBookedHotel} = useHotelStore();
    const { handleUnBook } = useTouristStore();

    const handleUnBookClick = async (id,hotelID) => {
        try {
          const response = await handleUnBook(user.userName,hotelID,1);
            console.log('id:',id);
            await deleteBookedHotel(id);
            toast.success(response.message, { className: "text-white bg-gray-800" });
         
        } catch (error) {
          console.error('Error unbooking hotel:', error.message);
          toast.error('Error unbooking hotel', { className: "text-white bg-gray-800" });
        }
      };

    useEffect(() => {
        getBookedHotels(user.userName);
        console.log('userBookedHotels:',userBookedHotels);
        console.log('user:',user);
    }
    ,[userBookedHotels]);

    const handleClick = () => {
        console.log('Getting booked hotel offers for user:', user.userName);
        console.log('userBookedHotels  before:',userBookedHotels);

        getBookedHotels(user.userName);
        console.log('userBookedHotels:',userBookedHotels);
    }

    return (
        <div>
        <Link to ='/hotelBooking'> <button className='bg-black text-white m-6 p-2 rounded' >book new hotel</button></Link>
        <h1>Booked Hotel Offers</h1>
        <button
                onClick={handleClick}
                style={{
                padding: '10px',
                color: 'white',
                backgroundColor: 'blue',
                border: 'none',
                borderRadius: '4px',
                }}
            >
                View
            </button>
        {userBookedHotels.length === 0 && <p>No booked hotels</p>}
    {userBookedHotels.map((hotel) => (
        <div key={hotel.data.id} className='m-4 p-4 border-2 border-black rounded-lg'>
            <p>Hotel: {hotel.name}</p>
            <p>Hotel Offer ID: {hotel.data[0].id}</p>
            <p>Price: {hotel.data[0].price.total} {hotel.data[0].price.currency}</p>
            <p>Check In Date: {hotel.data[0].checkInDate}</p>
            <p>Check Out Date: {hotel.data[0].checkOutDate}</p>
            <p>Room Type: {hotel.data[0].room.type}</p>
            <button onClick={() => handleUnBookClick(hotel._id,hotel.data[0].id)} className='bg-black text-white m-6 p-2 rounded' >Cancel Booking</button>
        </div>
    ))}
        </div>
    );
    }
export default BookedHotels;