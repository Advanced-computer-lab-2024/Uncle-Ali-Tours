import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlightStore } from '../store/flight';
import { useUserStore } from '../store/user';
import Button from '../components/Button'; // Custom Button component to unify styles

function FlightBookingPage() {
    const [originCity, setOriginCity] = useState('');
    const [destinationCity, setDestinationCity] = useState('');
    const [flightDate, setDate] = useState('');
    const [flightCabinClass, setCabinClass] = useState('economy');
    const [flightAdults, setAdults] = useState('1');
    const [flightChildrens, setChildrens] = useState('0');
    const [loading, setLoading] = useState(false);
    const [viewingOffers, setViewingOffers] = useState(false);
    const [bookedFlight, setBookedFlight] = useState({data : {}, creator : ''});
    const { originSkyId, originEntityId, destinationSkyId, destinationEntityId, flights, getOrigin, getDestination, getFlightList, addBookedFlights } = useFlightStore();
    const { user } = useUserStore();
    const cabinClassOptions = ['economy', 'business', 'first'];
    const navigate = useNavigate();

    const handleSearch = async () => {
        setLoading(true);
        await getOrigin(originCity);
        await getDestination(destinationCity);
        setLoading(false);
    };
    
    const handleViewOffers = async () => {
        setLoading(true);
        await getFlightList(originSkyId, originEntityId, destinationSkyId, destinationEntityId, flightDate, flightCabinClass, flightAdults, flightChildrens);
        setViewingOffers(true);
        setLoading(false);
    }

    const handleCabinClassChange = (e) => {
        setCabinClass(e.target.value);
    }

    const handleAddBookFlight = async (data) => {
        setBookedFlight((prevBookedFlight) => ({
            ...prevBookedFlight,
            data: data,
            creator: user.userName,
        }));
    }

    const handlePayFlight = async () => {
        try {
            navigate(`/payment/flight/${bookedFlight.data.id}`, { state: { bookedFlight } });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div className="flex flex-col items-center py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Flight Booking</h1>

            {!viewingOffers && (
                <div className="max-w-xl w-full px-4 py-6 bg-white shadow-lg rounded-lg">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Enter origin city"
                            value={originCity}
                            onChange={(e) => setOriginCity(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                        />
                        <input
                            type="text"
                            placeholder="Enter destination city"
                            value={destinationCity}
                            onChange={(e) => setDestinationCity(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                        />
                        <button
                            onClick={handleSearch}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg mb-4 hover:bg-blue-700 transition duration-300"
                        >
                            Search
                        </button>
                        <input
                            type="date"
                            value={flightDate}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                        />
                        <label htmlFor="cabinClass-select" className="block mb-2 text-gray-700">Choose Cabin Class:</label>
                        <select
                            id="cabinClass-select"
                            value={flightCabinClass}
                            onChange={handleCabinClassChange}
                            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                        >
                            {cabinClassOptions.map((cabinClass) => (
                                <option key={cabinClass} value={cabinClass}>
                                    {cabinClass}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Enter number of adults"
                            value={flightAdults}
                            onChange={(e) => setAdults(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                        />
                        <input
                            type="number"
                            placeholder="Enter number of children"
                            value={flightChildrens}
                            onChange={(e) => setChildrens(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                        />
                        <button
                            onClick={handleViewOffers}
                            className="w-full py-3 bg-orange-600 text-white rounded-lg mb-4 hover:bg-orange-700 transition duration-300"
                        >
                            View Offers
                        </button>
                    </div>
                </div>
            )}

            {viewingOffers && (
                <div className="w-full px-4 py-6 bg-white shadow-lg rounded-lg">
                    <button
                        onClick={() => setViewingOffers(false)}
                        className="py-2 px-4 bg-red-600 text-white rounded-lg mb-6 hover:bg-red-700 transition duration-300"
                    >
                        Back to Search
                    </button>
                    {flights && flights.length > 0 ? (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Flight Offers</h2>
                            {flights.map((flight) => (
                                <div key={flight.id} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
                                    <h3 className="text-xl font-semibold mb-2">
                                        Price: {flight.price.raw * user.currencyRate} {user.chosenCurrency}
                                    </h3>
                                    <button
                                        onClick={() => handleAddBookFlight(flight)}
                                        className="py-2 px-4 bg-green-600 text-white rounded-lg mb-2 hover:bg-green-700 transition duration-300"
                                    >
                                        Book Flight
                                    </button>
                                    <button
                                        onClick={handlePayFlight}
                                        className="py-2 px-4 bg-red-600 text-white rounded-lg mb-2 hover:bg-red-700 transition duration-300"
                                    >
                                        Pay
                                    </button>
                                    {flight.legs[0].segments && flight.legs[0].segments.length > 0 ? (
                                        flight.legs[0].segments.map((segment) => (
                                            <div key={segment.id} className="bg-gray-200 p-4 rounded-lg shadow-sm mb-4">
                                                <p><strong>From:</strong> {segment.origin.country}, {segment.origin.name} Airport</p>
                                                <p><strong>To:</strong> {segment.destination.country}, {segment.destination.name} Airport</p>
                                                <p><strong>Departure:</strong> {segment.departure}</p>
                                                <p><strong>Arrival:</strong> {segment.arrival}</p>
                                                <p><strong>Duration:</strong> {segment.durationInMinutes} minutes</p>
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
