import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHotelStore } from "../store/hotel";
import { useUserStore } from "../store/user";
import { Modal } from "react-bootstrap";
import { IoClose } from "react-icons/io5";
import Button from "../components/Button";
import { Card, CardContent } from "../components/Card";

function BookedHotels() {
  const { user } = useUserStore();
  const { getBookedHotels, userBookedHotels } = useHotelStore();
  const [showPreview, setShowPreview] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  useEffect(() => {
    getBookedHotels(user.userName);
  }, [user.userName]);

  const handleHotelClick = (hotel) => {
    setSelectedHotel(hotel);
    setShowPreview(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
        <Link to="/hotelBooking">
  <Button
    variant="outline"
    className="mb-6" // Adds spacing below the button
  >
    Book New Hotel
  </Button>
</Link>
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 sm:p-10">
            <h1 className="text-3xl font-bold text-white">
             Your Booked Hotels 
            </h1>
          </div>
      {userBookedHotels.length === 0 ? (
        <p className="mt-6 text-gray-700">No booked hotels</p>
      ) : (
        <div className="flex flex-col gap-6 mt-6">
          {userBookedHotels.map((hotel) => (
            <Card
              key={hotel.data[0].id}
              className="p-4 cursor-pointer"
              onClick={() => handleHotelClick(hotel)}
            >
              <CardContent>
                <div className="flex flex-col">
                  <h2 className="font-bold text-lg">{hotel.name}</h2>
                  <p className="mb-2">
                    Price: {hotel.data[0].price.total} {hotel.data[0].price.currency}
                  </p>
                  <p>Check-in: {hotel.data[0].checkInDate}</p>
                  <p>Check-out: {hotel.data[0].checkOutDate}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        centered
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        <div className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPreview(false)}
          >
            <IoClose size={24} />
          </button>
          {selectedHotel && (
            <>
              <h2 className="text-xl font-semibold mb-2">{selectedHotel.name}</h2>
              <p>
                Price: {selectedHotel.data[0].price.total} {selectedHotel.data[0].price.currency}
              </p>
              <p>Check-in: {selectedHotel.data[0].checkInDate}</p>
              <p>Check-out: {selectedHotel.data[0].checkOutDate}</p>
              <p>Room Type: {selectedHotel.data[0].room.type}</p>
            </>
          )}
        </div>
      </Modal>

      
    </div>
  );
}

export default BookedHotels;
