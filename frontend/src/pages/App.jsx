import React from "react";
import Navbar from "../components/Navbar";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import { Route, Routes } from "react-router-dom";
import ActivityCategory from "./ActivityCategory";
import ViewAttractions from "./ViewAttractions";
import PreferenceTag from "./PreferenceTag";
import ViewActivities from "./ViewActivities";
import ViewItineraries from "./ViewItineraries";
import ViewProducts from "./ViewProducts";
import ItineraryPage from "./ItineraryPage";
import CreateItinerary from "./CreateItinerary";
import SellerProfilePage from "./SellerProfilePage";
import AdvertiserProfile from "./AdvertiserProfilePage";
import UpdateItinerary from "./UpdateItinerary";
import AdminDashboard from "./AdminDashboardPage";
import TourGuideProfilePage from "./TourGuideProfilePage";
import Productpage from "./Productpage";
import TouristProfile from './TouristProfile';
import MuseumsPage from "./MuseumsPage";
import ActivityPage from "./ActivityPage";
import CreateActivity from "./CreateActivity";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/user";
import { useGuideStore } from "../store/tourGuide";
import { useSellerStore } from "../store/seller";
import { useTouristStore } from "../store/tourist";
import { useAdvertiserstore } from "../store/advertiser";
function App() {
  const { logout, setUser } = useUserStore();
  const { getGuide } = useGuideStore();
  const { getSeller } = useSellerStore();
  const { getTourist } = useTouristStore();
  const { getAdvertiser } = useAdvertiserstore();
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setUser(user);
      console.log(user);
      switch (user.type) {
        case "tour guide":
          getGuide({userName : user.userName},{});
          break;
        case "advertiser":
          getAdvertiser({userName : user.userName},{});
          break;
        case "seller":
          getSeller({userName : user.userName},{});
          break;
        case "tourist":
          getTourist({userName : user.userName},{});
          break;
        case "admin":
          break;
      
        default:
          break;
      }
    }
  },[]);


  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
    <div className="rounded-lg shadow-lg text-center text-[#1e1e2e] min-h-[calc(100vh-2vh)] mt-[1vh] w-[calc(100vw-2vh)] ml-[1vh] border-2 border-[#23263400] backdrop-blur-xl text-white font-black bg-[#161821f0] ">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/viewAttractions" element={<ViewAttractions />} />
        <Route path="/viewActivities" element={<ViewActivities />} />
        <Route path="/viewItineraries" element={<ViewItineraries />} />
        <Route path="/preferenceTag" element={<PreferenceTag />} />  
        <Route path="/viewProducts" element={<ViewProducts />} />
        <Route path="/activityCategory" element={<ActivityCategory />} />
        <Route path="/itineraryPage" element={<ItineraryPage />} />
        <Route path="/createItinerary" element={<CreateItinerary />} />
        <Route path="/sellerProfile" element={<SellerProfilePage />} />
        <Route path="/advertiserProfile" element={<AdvertiserProfile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/product" element={<Productpage />} />
        <Route path="/TouristProfile" element={<TouristProfile />} />
        <Route path="/MuseumsPage" element={<MuseumsPage/>}/>

        <Route path="/updateItinerary" element={<UpdateItinerary />} />
        <Route path="/TourGuideProfilePage" element={<TourGuideProfilePage/>}/>
        <Route path="/activityPage" element={<ActivityPage/>}/>
        <Route path="/createActivity" element={<CreateActivity/>}/>
    
      </Routes>
    </div>
    <div className="mx-auto w-fit">
        <button onClick={() => handleLogout()} className="mx-auto">
          LOGOUT
        </button>
      </div>
    </div>
  );
}

export default App;
