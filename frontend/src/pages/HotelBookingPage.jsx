import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotelStore } from '../store/hotel';
import { useUserStore } from '../store/user';
import Button from '../components/Button'; // Custom Button component to unify styles

function HotelBookingPage() {
    const [cityName, setCityName] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [bookedHotel, setBookedHotel] = useState({ data: {}, creator: '' });
    const [loading, setLoading] = useState(false);
    const [viewingOffers, setViewingOffers] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const { user } = useUserStore();
    const { cityCode, searchCity, getHotelListByCity, hotels, getHotelOffers, offers, addBookedHotels } = useHotelStore();
    const navigate = useNavigate();

    const handleSearch = async () => {
        setLoading(true);
        await searchCity(cityName);
        await getHotelListByCity(cityCode);
        setLoading(false);
    };

    const handleViewOffers = async (hotel) => {
        setLoading(true);
        await getHotelOffers(hotel.hotelId, checkInDate, checkOutDate);
        setSelectedHotel(hotel);
        setViewingOffers(true);
        setLoading(false);
    };

    const handleAddBookHotel = async (hotelName, data) => {
        setBookedHotel((prevBookedHotel) => ({
            ...prevBookedHotel,
            data: data,
            creator: user.userName,
            name: hotelName,
        }));
    }

    const handlePayHotel = async () => {
        try {
            navigate(`/payment/hotel/${bookedHotel.data.id}`, { state: { bookedHotel: bookedHotel } });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div className="flex flex-col items-center py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Hotel Booking</h1>

            {!viewingOffers && (
                <div className="max-w-xl w-full px-4 py-6 bg-white shadow-lg rounded-lg">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Enter city"
                            value={cityName}
                            onChange={(e) => setCityName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                        />
                        <input
                            type="date"
                            placeholder="Check-in date"
                            value={checkInDate}
                            onChange={(e) => setCheckInDate(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                        />
                        <input
                            type="date"
                            placeholder="Check-out date"
                            value={checkOutDate}
                            onChange={(e) => setCheckOutDate(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                        />
                        <Button
                            onClick={handleSearch}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg mb-4 hover:bg-blue-700 transition duration-300"
                        >
                            Search
                        </Button>
                    </div>
                </div>
            )}

            {loading && <p className="text-lg text-gray-600">Loading...</p>}

            {!viewingOffers && hotels.length > 0 && (
                <div className="w-full px-4 py-6 bg-white shadow-lg rounded-lg mt-6">
                    <h2 className="text-2xl font-semibold mb-4">Available Hotels</h2>
                    {hotels.map((hotel) => (
                        <div key={hotel.hotelId} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
                            <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                            <Button
                                onClick={() => handleViewOffers(hotel)}
                                className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                            >
                                View Offers
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {viewingOffers && (
                <div className="w-full px-4 py-6 bg-white shadow-lg rounded-lg">
                    <Button
                        onClick={() => setViewingOffers(false)}
                        className="py-2 px-4 bg-red-600 text-white rounded-lg mb-6 hover:bg-red-700 transition duration-300"
                    >
                        Back to Hotels
                    </Button>
                    <h2 className="text-2xl font-semibold mb-4">Offers for {selectedHotel.name}</h2>
                    {offers && offers.length > 0 ? (
                        offers.map((offer) => (
                            <div key={offer.id} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
                                <h3 className="text-xl font-semibold mb-2">Offer ID: {offer.id}</h3>
                                <p className="mb-2">Price: {offer.price.total} {offer.price.currency}</p>
                                <p className="mb-2">Room Type: {offer.room.type}</p>
                                <p className="mb-2">Check-in: {offer.checkInDate}</p>
                                <p className="mb-2">Check-out: {offer.checkOutDate}</p>
                                <div className="flex space-x-2 mt-4">
                                    <Button
                                        onClick={() => handleAddBookHotel(selectedHotel.name, offer)}
                                        className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                                    >
                                        Book Offer
                                    </Button>
                                    <Button
                                        onClick={handlePayHotel}
                                        className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                                    >
                                        Checkout
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-lg text-gray-600">No offers available for this hotel.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default HotelBookingPage;

