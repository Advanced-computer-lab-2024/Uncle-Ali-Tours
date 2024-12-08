import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFlightStore } from "../store/flight";
import { useUserStore } from "../store/user";
import { Modal } from "react-bootstrap";
import { IoClose } from "react-icons/io5";
import Button from "../components/Button";
import { Card, CardContent, CardFooter } from "../components/Card";

function BookedFlights() {
  const { user } = useUserStore();
  const { getBookedFlights, userBookedFlights } = useFlightStore();
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);

  useEffect(() => {
    getBookedFlights(user.userName);
  }, [user.userName]);

  const handleFlightClick = (flight) => {
    setSelectedFlight(flight);
    setShowPreview(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Link to="/flightBooking">
        <Button variant="outline" className="mb-4">Book New Flight</Button>
      </Link>

      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 sm:p-10">
            <h1 className="text-3xl font-bold text-white">
             Your Booked Flights 
            </h1>
          </div>

      {userBookedFlights.length === 0 ? (
        <p>No booked flights</p>
      ) : (
        <div className="flex flex-col gap-6"> {/* Changed grid to flex with column layout */}
          {userBookedFlights.map((flight) => (
            <Card key={flight._id} className="p-4 cursor-pointer" onClick={() => handleFlightClick(flight)}>
              <CardContent>
                <div className="flex flex-col">
                  <h2 className="font-bold text-lg">{flight.data[0].legs[0].origin.city} to {flight.data[0].legs[0].destination.city}</h2>
                  <p className="mb-2">Price: {flight.data[0].price.raw * user.currencyRate} {user.chosenCurrency}</p>
                  <p>Departure: {flight.data[0].legs[0].departure}</p>
                  <p>Arrival: {flight.data[0].legs[0].arrival}</p>
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
          {selectedFlight && (
            <>
              <h2 className="text-xl font-semibold mb-2">
                {selectedFlight.data[0].legs[0].origin.city} to {selectedFlight.data[0].legs[0].destination.city}
              </h2>
              <p>Price: {selectedFlight.data[0].price.raw * user.currencyRate} {user.chosenCurrency}</p>
              <p>Departure: {selectedFlight.data[0].legs[0].departure}</p>
              <p>Arrival: {selectedFlight.data[0].legs[0].arrival}</p>
              <p>Origin: {selectedFlight.data[0].legs[0].origin.city}, {selectedFlight.data[0].legs[0].origin.country}</p>
              <p>Destination: {selectedFlight.data[0].legs[0].destination.city}, {selectedFlight.data[0].legs[0].destination.country}</p>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default BookedFlights;
