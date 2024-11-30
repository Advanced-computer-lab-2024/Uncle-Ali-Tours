import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSellerStore } from "../store/seller";
import { useGuideStore} from "../store/tourGuide"
import { useAdvertiserstore} from "../store/advertiser"
import Settings from "./Settings";
import { IoMenu } from "react-icons/io5";
import { MdHome } from "react-icons/md";
import { FaBell } from "react-icons/fa";
import SideMenu from "./SideMenu";
import { useTouristStore } from "../store/tourist";
function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
	const { tourist } = useTouristStore();
  const { sell } = useSellerStore();
  const { advertiser } = useAdvertiserstore()
  const { guide } = useGuideStore()

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

	

  return (
    <div>
      <nav
        className="flex rounded-lg justify-between items-center mx-[1.5vh] mt-[1.5vh] h-16 bg-[#161821f0] text-lg relative shadow-sm font-mono"
        role="navigation"
      >
        <Link to="/" className="pl-8 tracking-widest">
          UAT
        </Link>
        <div className="w-[30vw] flex content-center justify-end mr-8 items-center">
          <Link to="/" className="mx-2">
            <MdHome size="25" />
          </Link>
          {user?.type === "seller" && sell?.verified && (
            <Link to="/product" className="mx-2">
              Products
            </Link>
          )}
{!!user.userName &&
					<Link to="/notifications" className="mx-2 relative">
							{	 {...tourist, ...guide, ...advertiser}?.notifications?.filter((n)=> !n.read).length > 0 &&
						<span className="absolute top-0 right-0 rounded-full bg-blue-500 text-white w-[9px] h-[9px]">&nbsp;</span>
						}
						<FaBell size="20" />
					</Link>
					}
          <Settings />
          {user?.type === "tourist" && (
            <button
              onClick={toggleSideMenu}
              className="mx-2 focus:outline-none"
              aria-label={isSideMenuOpen ? "Close menu" : "Open menu"}
            >
              <IoMenu size="25" className="mx-2"/>
            </button>
          )}
           {user?.type === "admin" && (
            <button
              onClick={toggleSideMenu}
              className="mx-2 focus:outline-none"
              aria-label={isSideMenuOpen ? "Close menu" : "Open menu"}
            >
              <IoMenu size="25" className="mx-2"/>
            </button>
          )}
        </div>
      </nav>

      {/* Render the SideMenu component only when isSideMenuOpen is true */}
				<div>
        <SideMenu
          isOpen={isSideMenuOpen}
          onClose={() => setIsSideMenuOpen(false)}
        />
				</div>
    </div>
  );
}

export default Navbar;
