import React, { useEffect, useState } from "react";
import Axios from "axios";
import NotificationContainer from "../components/NotificationContainer";
import { useTouristStore } from "../store/tourist";
import { useGuideStore } from "../store/tourGuide";
import { useAdvertiserstore } from "../store/advertiser";
import { FiLoader } from "react-icons/fi";
import { motion } from "framer-motion";

function Notification() {
  const { tourist, getTourist } = useTouristStore();
  const { guide, getGuide } = useGuideStore();
  const { advertiser, getAdvertiser } = useAdvertiserstore();
  const [tempUser, setTempUser] = useState();

  useEffect(() => {
    if (!!tourist?.userName) setTempUser(tourist);
    if (!!guide?.userName) setTempUser(guide);
    if (!!advertiser?.userName) setTempUser(advertiser);
  }, [tourist, guide, advertiser]);

  useEffect(() => {
    const markAsRead = async () => {
      try {
        if (!!tempUser?.userName && tempUser.notifications?.length > 0) {
          await Axios.put(`http://localhost:5000/api/notifications`, {
            userName: tempUser.userName,
          });
          getTourist({ userName: tempUser.userName }, {});
          getGuide({ userName: tempUser.userName }, {});
          getAdvertiser({ userName: tempUser.userName });
        }
      } catch (err) {
        console.error(err);
      }
    };
    markAsRead();
  }, [tempUser, getTourist, getGuide, getAdvertiser]);

  if (!tempUser?.notifications) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FiLoader size={50} className="text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="bg-[url('/path-to-background-image.jpg')] bg-cover bg-center min-h-screen py-10 px-4"
      style={{
        backgroundColor: "rgba(255, 165, 0, 0.1)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="bg-white bg-opacity-95 py-6 px-4 rounded-lg shadow-lg max-w-4xl mx-auto border border-orange-400">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold text-black text-center mb-8"
        >
          Notifications
        </motion.h1>
        {tempUser.notifications.length === 0 ? (
          <p className="text-gray-600 text-center">
            You have no notifications at this time.
          </p>
        ) : (
          tempUser.notifications.map((notification, index) => (
            <NotificationContainer key={index} notification={notification} />
          ))
        )}
      </div>
    </div>
  );
}

export default Notification;
