import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa";

const SideMenu = ({ isOpen, onClose }) => {
  const [expandedIndex, setExpandedIndex] = useState(null); // Track the expanded menu
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const menuItems = [
    {
      title: "Book",
      subItems: [
        { name: "Itinerary", path: "/viewItineraries" },
        { name: "Activity", path: "/viewActivities" },
        { name: "Transportation", path: "/transportationActivity" },
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
  ];

  const toggleMenu = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div
      className={`fixed top-[7vh] rounded-lg right-0 h-[60vh] mr-[0.8vw] w-64 bg-[#161821f0] text-white transform ${
        isOpen ? "translate-x-0" : "translate-x-[calc(100%+0.8vw)]"
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-white">
        <IoCloseSharp size="25" />
      </button>
      <nav className="mt-16">
        {user.type === "tourist" &&
          menuItems.map((item, index) => (
            <div key={index} className={`mb-4 w-[90%] mx-auto ${expandedIndex === true ? "bg-gray-900" : ""}`}>
              <h2
                onClick={() => toggleMenu(index)}
                className={`${expandedIndex === index ? "text-red-200" : ""} text-xl transition-colors w-full duration-500 mx-auto py-2 rounded font-bold mb-2 px-4 cursor-pointer hover:bg-gray-700`}
              >
                {item.title}
                <span className="float-right my-auto h-fit">
                  <FaAngleDown className={`transition-transform duration-500 ${expandedIndex === index ? "rotate-180" : ""}`} />
                </span>
              </h2>
                <ul className={`transition-all duration-500 ${expandedIndex === index ? "h-[15vh]" : "h-[0px]"}`}>
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        to={subItem.path}
                        className={`hover:text-blue-200 transition-all duration-500 ${expandedIndex === index ? "h-[3ch] hover:bg-gray-700 px-4 py-1 my-2" : "h-[0px] text-[0px]"} block mx-auto rounded`}
                        onClick={onClose}
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
            </div>
          ))}
      </nav>
    </div>
  );
};

export default SideMenu;
