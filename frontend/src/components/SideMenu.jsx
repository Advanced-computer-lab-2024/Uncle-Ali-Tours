import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import { FaAngleDown, FaCheck } from "react-icons/fa";
import { useTagStore } from "../store/tag";
import { useTouristStore } from "../store/tourist";
import { toast } from "react-hot-toast";
import AddAddressPage from "../pages/AddAddressPage";
const SideMenu = ({ isOpen, onClose }) => {
  const { updateTourist } = useTouristStore();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [preferences, setPreferences] = useState([]);
  const { tags, getTags } = useTagStore();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    getTags();
    if (user.myPreferences && user.myPreferences.length > 0) {
      setPreferences(user.myPreferences);
    }
  }, [getTags, user]);

  const menuItemsTourist = [
    {
      title: "Book",
      subItems: [
        { name: "Itinerary", path: "/touristviewitineraries" },
        { name: "Activity", path: "/touristviewActivities" },
        { name: "Transportation", path: "/ViewTransportationActivity" },
        { name: "Flight", path: "/bookedFlights" },
        { name: "Hotel", path: "/bookedHotels" },
      ],
    },
    {
      title: "Products",
      subItems: [
        { name: "Purchase Products", path: "/viewProducts" },
        { name: "My Wishlist", path: "/wishlist" },
        { name: "My Cart", path: "/cart" },
        { name: "My Orders", path: "/orders" },
      ],
    },
    {
      title: "My Bookings",
      subItems: [
        { name: "Upcoming Itineraries", path: "/upcomingItineraries" },
        { name: "Upcoming Activities", path: "/upcomingActivities" },
      ],
    },
    {
      title: "History",
      subItems: [
        { name: "Past Itineraries", path: "/pastItineraries" },
        { name: "Past Activities", path: "/pastActivities" },
      ],
    },
    {
      title: "Complaints",
      subItems: [
        { name: "New Complaint", path: "/fileComplaint" },
        { name: "My Complaints", path: "/viewMyComplaints" },
      ],
    },
    {
      title: "Delivery Addresses", // New section
      subItems: [
        { name: "Add New Address", path: "/AddAddressPage" }, 
      
      ],
    },
  ];
  const menuItemsTourGuide = [
    {
      title: "Itinerary",
      subItems: [
        { name: "View Itineraries", path: "/itineraryPage" },
      ],
    },
    {
      title: "Reports",
      subItems: [
        { name: "Tourists Report", path: "/TourGuideTouristReport" },
        { name: "Sales Report", path: "/TourGuideSalesReport" },

      ],
    },
    
 
  ];
  const menuItemsSeller = [
    {
      title: "Products",
      subItems: [
        { name: "View Products", path: "/product" },
      ],
    },
    {
      title: "Reports",
      subItems: [
        { name: "Sales Report", path: "/SellerSalesReport" },

      ],
    },
    
 
  ];
  const menuItemsAdmin = [
    {
      title: "Tags & Categories",
      subItems: [
        { name: "Preference Tags", path: "/preferenceTag" },
        { name: "Activity Categories", path: "/activityCategory" },
      ],
    },
    {
      title: "Itenirary & Activities",
      subItems: [
        { name: "Itinerary", path: "/AdminItineraryPage" },
        { name: "Activities", path: "/AdminActivitiesPage" },
      ],
    },
    {
      title: "Products",
      subItems: [
        { name: "Products", path: "/product" },
      ],
    },
    {
      title: "Users Settings",
      subItems: [
        { name: "Complaints", path: "/complaints" },
        { name: "View Delete Requests", path: "/viewDeleteRequests" },

      ],
    },
  ];

  const toggleMenu = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handlePreferenceToggle = async (tagName) => {
    const updatedPreferences = preferences.includes(tagName)
      ? preferences.filter((pref) => pref !== tagName)
      : [...preferences, tagName];

    setPreferences(updatedPreferences);

    const { success, message } = await updateTourist(user.userName, { myPreferences: updatedPreferences });
    if (success) {
      toast.success('Preferences updated successfully!', { className: 'text-white bg-gray-800' });
    } else {
      toast.error(message, { className: 'text-white bg-gray-800' });
    }
  };

  return (
    <div
      className={`fixed top-0 rounded-lg left-0 h-[100vh] mr-[0.8vw] w-64 bg-white text-white transform ${isOpen ? "translate-x-0" : "translate-x-[calc(-100%-0.8vw)]"} transition-transform duration-300 ease-in-out z-50 overflow-y-auto`}
    >
      <button onClick={onClose} className="absolute hover:text-red-500 transition-colors top-4 right-4 text-black">
        <IoCloseSharp size="25" />
      </button>
      <nav className="mt-16">
        {(user.type === "tourist" ? menuItemsTourist : user.type==="admin"? menuItemsAdmin : user.type==="seller"? menuItemsSeller : menuItemsTourGuide).map((item, index) => (
          <div key={index} className={`mb-4 w-[90%] mx-auto ${expandedIndex === index ? "" : ""}`}>
            <h2
              onClick={() => toggleMenu(index)}
              className={`${expandedIndex === index ? "" : ""} text-black text-lg transition-colors w-full duration-500 mx-auto py-2 rounded font-bold mb-2 px-4 cursor-pointer hover:bg-[#C6EBC5]/70 flex justify-between items-center`}
            >
              {item.title}
              <FaAngleDown className={`transition-transform duration-500 ${expandedIndex === index ? "rotate-180" : ""}`} />
            </h2>
            <ul className={`transition-all bg-[#FEFDED] duration-500 ${expandedIndex === index ? "h-[20vh]" : "h-[0px]"} overflow-hidden`}>
              {item.subItems.map((subItem, subIndex) => (
                <li key={subIndex}>
                  <Link
                    to={subItem.path}
                    className={`hover:text-[#FA7070] text-black transition-all duration-500 ${expandedIndex === index ? "h-[3ch]  px-4 py-1 my-2 text-sm" : "h-[0px] text-[0px]"} block mx-auto rounded`}
                    onClick={onClose}
                  >
                    {subItem.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Render "My Preferences" section only for tourists */}
        {user.type === "tourist" && (
          <div className={`mb-4 w-[90%] mx-auto ${expandedIndex === (user.type === "tourist" ? menuItemsTourist.length : menuItemsAdmin.length) ? "bg-gray-900" : ""}`}>
            <h2
              onClick={() => toggleMenu(user.type === "tourist" ? menuItemsTourist.length : menuItemsAdmin.length)}
              className={`${expandedIndex === (user.type === "tourist" ? menuItemsTourist.length : menuItemsAdmin.length) ? "text-red-200" : ""} text-lg transition-colors w-full duration-500 mx-auto py-2 rounded font-bold mb-2 px-4 cursor-pointer hover:bg-gray-700 flex justify-between items-center`}
            >
              My Preferences
              <FaAngleDown className={`transition-transform duration-500 ${expandedIndex === (user.type === "tourist" ? menuItemsTourist.length : menuItemsAdmin.length) ? "rotate-180" : ""}`} />
            </h2>
            <ul className={`transition-all duration-500 ${expandedIndex === (user.type === "tourist" ? menuItemsTourist.length : menuItemsAdmin.length) ? "h-[20vh]" : "h-[0px]"} overflow-hidden`}>
              {tags && tags.length > 0 ? (
                tags.map((tag) => (
                  <li key={tag._id || tag.name}>
                    <button
                      onClick={() => handlePreferenceToggle(tag.name)}
                      className={`hover:text-[#C6EBC5] transition-all duration-500 ${expandedIndex === (user.type === "tourist" ? menuItemsTourist.length : menuItemsAdmin.length) ? "h-[3ch] hover:bg-gray-700 px-4 py-1 my-2 text-sm" : "h-[0px] text-[0px]"} block mx-auto rounded w-full text-left flex items-center justify-between`}
                    >
                      {tag.name}
                      {preferences.includes(tag.name) && <FaCheck className="text-green-500" />}
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-1 text-sm">Loading preferences...</li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default SideMenu;
