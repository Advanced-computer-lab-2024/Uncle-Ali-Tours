import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useHotelStore } from "../store/hotel";
import { useUserStore } from "../store/user";

function BookedHotels() {
    const { user } = useUserStore();
    const {  getBookedHotels , userBookedHotels } = useHotelStore();

    useEffect(() => {
        getBookedHotels(user.userName);
        console.log('userBookedHotels:',userBookedHotels);
        console.log('user:',user);
    }
    ,[]);

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
            <p>Hotel Offer ID: {hotel.data[0].id}</p>
            <p>Price: {hotel.data[0].price.total} {hotel.data[0].price.currency}</p>
            <p>Check In Date: {hotel.data[0].checkInDate}</p>
            <p>Check Out Date: {hotel.data[0].checkOutDate}</p>
            <p>Room Type: {hotel.data[0].room.type}</p>
        </div>
    ))}
        </div>
    );
    }
export default BookedHotels;