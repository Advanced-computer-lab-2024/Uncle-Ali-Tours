import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useFlightStore } from "../store/flight";
import { useTouristStore } from "../store/tourist";
import { useUserStore } from "../store/user";

function BookedFlights() {
    const { user } = useUserStore();
    const {  getBookedFlights , userBookedFlights , deleteBookedFlight } = useFlightStore();
    const { handleUnBook } = useTouristStore();

    const handleUnBookClick = async (id,flightID) => {
        try {
          const response = await handleUnBook(user.userName,flightID,1);
            console.log('id:',id);
            await deleteBookedFlight(id);
            toast.success(response.message, { className: "text-white bg-gray-800" });
         
        } catch (error) {
          console.error('Error unbooking flight:', error.message);
          toast.error('Error unbooking flight', { className: "text-white bg-gray-800" });
        }
      };

    useEffect(() => {
        getBookedFlights(user.userName);
    }
    ,[userBookedFlights]);

    const handleClick = () => {
        console.log('Getting booked flights for user:', user.userName);
        console.log('userBookedFlights  before:',userBookedFlights);

        getBookedFlights(user.userName);
        console.log('userBookedFlights:',userBookedFlights);
    }

    return (
        <div>
            <Link to ='/flightBooking'> <button className='bg-black text-white m-6 p-2 rounded' >book new flight</button></Link>
        <h1>Booked Flights</h1>
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
            {userBookedFlights.length === 0 && <p>No booked flights</p>}
        {userBookedFlights.map((flight) => (
            <div key={flight._id} className='m-4 p-4 border-2 border-black rounded-lg'>
                <p>Flight Price: {flight.data[0].price.raw*user.currencyRate} {user.chosenCurrency}</p>
                <p>Flight Departure Date: {flight.data[0].legs[0].departure}</p>
                <p>Flight Arrival Date: {flight.data[0].legs[0].arrival}</p>
                <p>Flight Origin: {flight.data[0].legs[0].origin.city } , {flight.data[0].legs[0].origin.country}</p>
                <p>Flight Destination: {flight.data[0].legs[0].destination.city} , {flight.data[0].legs[0].destination.country}</p>
                <button onClick={() => handleUnBookClick(flight._id,flight.data[0].id)} className='bg-black text-white m-6 p-2 rounded' >Cancel Booking</button>
            </div>
        ))}

        </div>
    );
    }
export default BookedFlights;