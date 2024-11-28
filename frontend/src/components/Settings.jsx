import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useUserStore } from "../store/user";
import { FaGear } from "react-icons/fa6";
import Currency from "./Currency";

const Settings = () => {
  return (
    <div className="flex h-fit my-auto justify-center z-50">
      <FlyoutLink FlyoutContent={SettingsContent}>
        <FaGear size={22} className="my-auto mx-2 hover:animate-spin" />
      </FlyoutLink>
    </div>
  );
};

const FlyoutLink = ({ children, href, FlyoutContent }) => {
  const [open, setOpen] = useState(false);

  const showFlyout = FlyoutContent && open;

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative w-fit h-fit"
    >
      <a href={href} className="relative text-white">
        {children}
        <span
          style={{
            transform: showFlyout ? "scaleX(1)" : "scaleX(0)",
          }}
          className="absolute -bottom-2 -left-3 -right-0 h-1 origin-left scale-x-0 rounded-full bg-white transition-transform duration-300 ease-out"
        />
      </a>
      <AnimatePresence>
        {showFlyout && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            style={{ translateX: "-50%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute left-1/2 top-12 bg-white text-black"
          >
            <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
            <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" />
            <FlyoutContent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SettingsContent = () => {
  const { logout } = useUserStore();
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handelLog = () => {
    if (!!user) {
      logout();
      navigate("/");
    } else navigate("/login");
  };

  return (
    <div className="w-fit bg-white p-6 shadow-xl">
      <div className=" space-y-3">
        {!!user && (
          <a className="block hover:cursor-pointer text-sm hover:underline">
            <Currency />
          </a>
        )}
        {!!user && (
          <Link
            to={"/security"}
            className={`block hover:cursor-pointer text-sm hover:underline `}
          >
            Account
          </Link>
        )}
        <a
          onClick={handelLog}
          className={`block hover:cursor-pointer text-sm hover:underline ${
            !!user ? "text-red-500" : "text-green-500"
          }`}
        >
          {!!user ? "LogOut" : "LogIn"}
        </a>
      </div>
    </div>
  );
};

export default Settings;
