import React, { useState } from 'react';
import { useHotelStore } from '../store/hotel';
import { useUserStore } from '../store/user';

function HotelBookingPage() {
  const [cityName, setcityName] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [bookedHotel, setBookedHotel] = useState({data : {}, creator : ''});
  const [loading, setLoading] = useState(false);
  const [viewingOffers, setViewingOffers] = useState(false);
  const { user } = useUserStore();
const {cityCode,searchCity ,getHotelListByCity ,hotels ,getHotelOffers ,offers ,addBookedHotels } = useHotelStore();
  
const handleSearch = async () => {
    setLoading(true);
    console.log('Searching for city:', cityName);
     await searchCity(cityName);
    console.log('cityCode:',cityCode);
     await getHotelListByCity(cityCode);
     console.log('hotels:',hotels);
    setLoading(false);
  };

  const handleViewOffers = async (hotelId ,checkInDate ,checkOutDate) => {
    setLoading(true);
    console.log('Viewing offers for hotel:', hotelId);
    await getHotelOffers(hotelId ,checkInDate ,checkOutDate);
    console.log('offers:',offers);
    setViewingOffers(true);
    setLoading(false);
  };

  const handleAddBookHotel = async (data) => {
    console.log('Adding hotel:', data);
    setBookedHotel((prevBookedHotel) => ({
      ...prevBookedHotel,
      data: data,
      creator: user.userName,
    }));
  }

  const handlePayHotel = async () => {
    await addBookedHotels(bookedHotel);
    console.log('bookedHotel data:',bookedHotel.data);
    console.log('bookedHotel:',bookedHotel);
  }

  return (
    <div>
      <h1>Hotel Booking Page</h1>
      {!viewingOffers && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <input
            type="text"
            placeholder="Enter city"
            value={cityName}
            onChange={(e) => setcityName(e.target.value)}
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
            placeholder="Enter check-in date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
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
            placeholder="Enter check-out date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            style={{
              width: '70%',
              padding: '10px',
              marginRight: '10px',
              color: 'black',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <button onClick={handleSearch}  style={{
              padding: '10px 20px',
              backgroundColor: '#007BFF',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            >
            Search
          </button>
        </div>
      )}
      {loading && <p>Loading...</p>}
      {!viewingOffers && hotels.length > 0 && (
        <div>
          {hotels.map((hotel) => (
            <div key={hotel.hotelId} style={{
              backgroundColor: 'grey',
              padding: '20px',
              margin: '10px 0',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
            >
              <p style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 'bold' }}>{hotel.name}</p>
              <button onClick={() => handleViewOffers(hotel.hotelId, checkInDate, checkOutDate)} style={{
                  padding: '10px 20px',
                  backgroundColor: '#28A745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                >
                View Offers
              </button>
            </div>
          ))}
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
            Back to Hotels
          </button>
          {offers && offers.length>0 ? (
            <div>
              {offers.map((offer) => (
                <div key={offer.id}  style={{
                  backgroundColor: 'grey',
                  padding: '20px',
                  margin: '10px 0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
                >
                  <p style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Offer ID: {offer.id}</p>
                  <p style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Price: {offer.price.total} {offer.price.currency}</p>
                  <p style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Room Type: {offer.room.type}</p>
                  <p style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Check-in: {offer.checkInDate}</p>
                  <p style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Check-out: {offer.checkOutDate}</p>
                  <button onClick={() => handleAddBookHotel(offer)}  style={{
                    padding: '10px 20px',
                    backgroundColor: '#28A745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    }}
                    >
                    Book Offer
                </button>
                <button onClick={() => handlePayHotel()}  style={{
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
                </div>
              ))}
            </div>
          ) : (
            <p>No offers available for this hotel.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default HotelBookingPage;