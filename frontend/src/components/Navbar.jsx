import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSellerStore } from '../store/seller';
import Settings from './Settings';
import { IoMenu } from "react-icons/io5";
import { MdHome } from "react-icons/md";
import SideMenu from './SideMenu';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { sell } = useSellerStore();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  return (
    <div>
      <nav className="flex rounded-lg justify-between items-center mx-[1.5vh] mt-[1.5vh] h-16 bg-[#161821f0] text-lg relative shadow-sm font-mono" role="navigation">
        <Link to="/" className="pl-8 tracking-widest">UAT</Link>
        <div className="w-[30vw] flex content-center justify-end mr-8 items-center">
          {!!user && (user?.type === 'tourist' ? (
            <Link to="/touristProfile" className="p-4">
              <MdHome size="25" />
            </Link>
          ) : (
            <Link to="/" className="p-4">Dashboard</Link>
          ))}
          {user?.type === 'seller' && sell?.verified && (
            <Link to="/product" className="p-4">Products</Link>
          )}
          <Settings />
          <button
            onClick={toggleSideMenu}
            className="ml-4 p-2 focus:outline-none"
            aria-label={isSideMenuOpen ? "Close menu" : "Open menu"}
          >
            <IoMenu size="25" />
          </button>
        </div>
      </nav>

      {/* Render the SideMenu component only when isSideMenuOpen is true */}
      {isSideMenuOpen && (
        <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />
      )}
    </div>
  );
}

export default Navbar;
