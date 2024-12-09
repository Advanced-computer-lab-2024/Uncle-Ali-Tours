import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaShareAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTouristStore } from '../store/tourist.js';
import QuantitySelector from './QuantitySelector.jsx';
import Button from '../components/Button';
import { Card, CardContent, CardFooter } from '../components/Card';
import avatar from "/avatar.png";

function TransportationActivityContainer({ activity }) {
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [email, setEmail] = useState("");
  const [isChoosingShareOption, setIsChoosingShareOption] = useState(false); // State to manage sharing options modal
  const navigate = useNavigate();
  const { updateBookings, unBook, tourist } = useTouristStore();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleShare = async () => {
    const link = `${window.location.origin}/transportationActivityDetail/${activity._id}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!");
  };

  const handleShareViaMail = async () => {
    setIsSharing(true);
    const link = `${window.location.origin}/transportationActivityDetail/${activity._id}`;
    try {
      const response = await fetch('/api/share/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: user.userName, link, email }),
      });

      const { success, message } = await response.json();
      if (success) {
        toast.success(message);
        setIsModalOpen(false);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error("Failed to share via email.");
    } finally {
      setIsSharing(false);
    }
  };

  const handleBookClick = () => {
    navigate(`/payment/tActivity/${activity._id}`, { state: { quantity } });
  };

  const handleShareOption = (option) => {
    if (option === "link") {
      handleShare();
    } else if (option === "email") {
      setIsModalOpen(true);
    }
    setIsChoosingShareOption(false); // Close the options modal after selection
  };

  return (
    <Card className="w-full max-w-[700px] mx-auto mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-12 items-center justify-center w-auto max-w-[650px] mx-auto">
          <div className="w-full flex items-center justify-center">
            <div className="aspect-square overflow-hidden transform scale-110 ml-12 mt-12">
              <img
                src={avatar}
                alt="Activity"
                className="w-[75%] h-[75%] object-cover cursor-pointer"
              />
            </div>
          </div>

          <div className="w-full md:w-2/3 flex flex-col items-center justify-center text-center">
            <div>
              <h2 className="font-bold mb-2">{activity.name}</h2>
              <p className="mb-2">Date: {new Date(activity.date).toLocaleDateString()}</p>
              <p className="mb-2">Time: {activity.time}</p>
              <p className="mb-2">Pickup: {activity.pickUpLocation}</p>
              <p className="mb-2">Dropoff: {activity.dropOfLocation}</p>
              <p className="mb-2">Price: ${activity.price}</p>
              <p className="mb-2">Booking Open: {activity.bookingOpen ? "Yes" : "No"}</p>
              <p className="mb-2">Creator: {activity.creator}</p>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <Button variant="outline" onClick={() => setIsChoosingShareOption(true)}>
                <FaShareAlt className="text-blue-500" />
              </Button>
              <QuantitySelector onChange={setQuantity} maxValue={100} />
              <Button variant="outline" onClick={handleBookClick}>
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      

      {isChoosingShareOption && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-xl mb-4">Choose Share Option</h3>
            <div className="flex flex-col gap-4">
              <Button variant="outline" onClick={() => handleShareOption("link")}>
                Copy Link
              </Button>
              <Button variant="outline" onClick={() => handleShareOption("email")}>
                Share via Email
              </Button>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="link" onClick={() => setIsChoosingShareOption(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-xl mb-4">Share Activity via Email</h3>
            <label className="block mb-4">
              To:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                placeholder="Recipient's email"
              />
            </label>
            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleShareViaMail}>
                {isSharing ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default TransportationActivityContainer;
