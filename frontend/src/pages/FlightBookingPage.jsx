import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlightStore } from '../store/flight';
import { useUserStore } from '../store/user';

function FlightBookingPage() {
    const [originCity, setOriginCity] = useState('');
    const [destinationCity, setDestinationCity] = useState('');
    const [flightDate, setDate] = useState('');
    const [flightCabinClass, setCabinClass] = useState('');
    const [flightAdults, setAdults] = useState('');
    const [flightChildrens, setChildrens] = useState('');
    const [loading, setLoading] = useState(false);
    const [viewingOffers, setViewingOffers] = useState(false);
    const [bookedFlight, setBookedFlight] = useState({data : {}, creator : ''});
    const { originSkyId,originEntityId,destinationSkyId,destinationEntityId,  flights, getOrigin, getDestination, getFlightList , addBookedFlights} = useFlightStore();
    const { user } = useUserStore();
    const cabinClassOptions = ['economy' , 'business' , 'first'];
    const navigate = useNavigate();

    const handleSearch = async () => {
        setLoading(true);
        console.log('Searching for origin:', originCity);
        await getOrigin(originCity);
        console.log('originSkyId:',originSkyId);
        console.log('originEntityId:',originEntityId);
        console.log('Searching for destination:', destinationCity);
        await getDestination(destinationCity);
        console.log('destinationSkyId:',destinationSkyId);
        console.log('destinationEntityId:',destinationEntityId);
        setLoading(false);
    };
    
    const handleViewOffers = async () => {
        setLoading(true);
        console.log('Viewing offers for flight:', originSkyId,originEntityId,destinationSkyId,destinationEntityId,flightDate,flightCabinClass,flightAdults,flightChildrens);
        await getFlightList(originSkyId,originEntityId,destinationSkyId,destinationEntityId,flightDate,flightCabinClass,flightAdults,flightChildrens);
        console.log('flights:',flights);
        setViewingOffers(true);
        setLoading(false);
    }

    const handleCabinClassChange = (e) => {
        setCabinClass(e.target.value);
    }

    const handleAddBookFlight = async (data) => {
        console.log('Adding flight:', data);
        setBookedFlight((prevBookedFlight) => ({
            ...prevBookedFlight,
            data: data,
            creator: user.userName,
        }));
    }

    const handlePayFlight = async () => {
        try{
            navigate(`/payment/flight/${bookedFlight.data.id}` , { state: { bookedFlight : bookedFlight } });
          }
          catch(error){
            console.error('Error:', error);
          }
        //---- will call this in the success of payment later
        // await addBookedFlights(bookedFlight);
        // console.log('bookedFlight data:',bookedFlight.data);
        // console.log('bookedFlight:',bookedFlight);
    }
    
    return (
        <div>
        <h1>Flight Booking Page</h1>
        {!viewingOffers && (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <input
                type="text"
                placeholder="Enter origin city"
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                style={{
                width: '70%',
                padding: '10px',
                marginRight: '10px',
                color: 'black',
                border: '1px solid #ccc',
                borderRadius: '4px',
                }}
            />
            <input
                type="text"
                placeholder="Enter destination city"
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                style={{
                width: '70%',
                padding: '10px',
                marginRight: '10px',
                color: 'black',
                border: '1px solid #ccc',
                borderRadius: '4px',
                }}
            />
            <button
                onClick={handleSearch}
                style={{
                padding: '10px',
                color: 'white',
                backgroundColor: 'blue',
                border: 'none',
                borderRadius: '4px',
                }}
            >
                Search
            </button>
            <input
                type="text"
                placeholder="Enter travel date"
                value={flightDate}
                onChange={(e) => setDate(e.target.value)}
                style={{
                width: '70%',
                padding: '10px',
                marginRight: '10px',
                color: 'black',
                border: '1px solid #ccc',
                borderRadius: '4px',
                }}
            />
            <p></p>
            <label >Choose Class:</label>
            <select
                id="cabinClass-select"
                value={flightCabinClass}
                onChange={handleCabinClassChange}
                className="p-2 border rounded text-black"
                
            >
                {cabinClassOptions.map((cabinClass) => (
                    <option key={cabinClass} value={cabinClass} >
                        {cabinClass}
                    </option>
                ))}
            </select>
            <input
                type="text"
                placeholder="Enter adults number"
                value={flightAdults}
                onChange={(e) => setAdults(e.target.value)}
                style={{
                width: '70%',
                padding: '10px',
                marginRight: '10px',
                color: 'black',
                border: '1px solid #ccc',
                borderRadius: '4px',
                }}
            />
            <input
                type="text"
                placeholder="Enter childrens number"
                value={flightChildrens}
                onChange={(e) => setChildrens(e.target.value)}
                style={{
                width: '70%',
                padding: '10px',
                marginRight: '10px',
                color: 'black',
                border: '1px solid #ccc',
                borderRadius: '4px',
                }}
            />
            <button
                onClick={handleViewOffers}
                style={{
                padding: '10px',
                color: 'white',
                backgroundColor: 'blue',
                border: 'none',
                borderRadius: '4px',
                }}
            >
                View Offers
            </button>
            </div>
        )}
        {viewingOffers && (
            <div>
                <button onClick={() => setViewingOffers(false)}  style={{
              padding: '10px 20px',
              backgroundColor: '#DC3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '20px',
            }}
            >
            Back to Search
          </button>
          {flights && flights.length>0 ? (
          <div>
            <h2>Flight Offers</h2>
            {flights.map((flight) => (
                <div key={flight.id} style={{
                    backgroundColor: 'grey',
                    padding: '20px',
                    margin: '10px 0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                  >
                <h3>price : {flight.price.raw*user.currencyRate} {user.chosenCurrency}</h3>
                <button onClick={() => handleAddBookFlight(flight)}  style={{
                    padding: '10px 20px',
                    backgroundColor: '#28A745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    }}
                    >
                    Book Flight
                </button>
                <button onClick={() => handlePayFlight()}  style={{
                    padding: '10px 20px',
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    }}
                    >
                    pay
                </button>
                {flight.legs[0].segments && flight.legs[0].segments.length>0 ? (
                flight.legs[0].segments.map((segment) => (
                    <div key={segment.id} style={{
                        backgroundColor: 'grey',
                        padding: '20px',
                        margin: '10px 0',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                    >
                    <p>from: {segment.origin.country} , {segment.origin.name} Airport</p>
                    <p>to: {segment.destination.country} , {segment.destination.name} Airport</p>
                    <p>Departure: {segment.departure}</p>
                    <p>Arrival: {segment.arrival}</p>
                    <p>Duration: {segment.durationInMinutes} minutes</p>
                    </div>
                
                ))
                ) : (
                    <p>No segments available</p>
                )}
                
                </div>
            ))}
            </div>
        ) : (
            <p>No flights available</p>
        )}
            </div>
        )}
        </div>
    );
}

export default FlightBookingPage;