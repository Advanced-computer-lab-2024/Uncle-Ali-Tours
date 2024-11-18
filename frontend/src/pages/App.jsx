import React, { useEffect } from 'react';
import { Link, Route, Routes } from "react-router-dom";
import { FiLoader } from 'react-icons/fi';
import Navbar from "../components/Navbar";
import { useAdvertiserstore } from "../store/advertiser";
import { useSellerStore } from "../store/seller";
import { useGuideStore } from "../store/tourGuide";
import { useTouristStore } from "../store/tourist";
import { useUserStore } from "../store/user";
import ActivityCategory from "./ActivityCategory";
import ActivityDetail from "./ActivityDetail";
import ActivityPage from "./ActivityPage";
import AdminDashboard from "./AdminDashboardPage";
import AdvertiserProfile from "./AdvertiserProfilePage";
import BookedFlights from "./BookedFlights";
import BookedHotels from "./BookedHotels";
import ChangeCurrency from "./ChangeCurrency";
import ChangePassword from "./ChangePassword";
import Complaints from "./Complaints";
import CreateActivity from "./CreateActivity";
import CreateItinerary from "./CreateItinerary";
import FileComplaint from "./FileComplaint";
import FlightBookingPage from "./FlightBookingPage";
import HomePage from "./HomePage";
import HotelBookingPage from "./HotelBookingPage";
import ItineraryDetail from "./ItineraryDetail";
import ItineraryPage from "./ItineraryPage";
import LoginPage from "./LoginPage";
import MuseumsPage from "./MuseumsPage";
import PreferenceTag from "./PreferenceTag";
import Productpage from "./Productpage";
import RegisterPage from "./RegisterPage";
import SellerProfilePage from "./SellerProfilePage";
import TourGuideProfilePage from "./TourGuideProfilePage";
import TourGuideReviews from "./TourGuideReviews";
import TouristProfile from './TouristProfile';
import TouristViewActivities from "./TouristViewActivities";
import TouristViewItineraries from "./TouristViewItineraries";
import TransportationActivityDetail from "./TransportationActivityDetail";
import UpdateActivity from "./UpdateActivity";
import UpdateItinerary from "./UpdateItinerary";
import ViewActivities from "./ViewActivities";
import ViewAttractions from "./ViewAttractions";
import ViewDeleteRequests from "./ViewDeleteRequests";
import ViewItineraries from "./ViewItineraries";
import ViewProducts from "./ViewProducts";
import ViewReviews from "./ViewReviews";
import AdminItineraryPage from './AdminItineraryPage';
import AdminActivitiesPage from './AdminActivitiesPage';
import CreateTransportationActivity from "./CreateTransportationActivity.jsx";
import ViewTransportationActivity from './ViewTransportationActivity.jsx';
import Security from './Security.jsx';
import EditProduct from "../components/EditProduct.jsx";




function App() {
  const {  user, setUser } = useUserStore();
  const { getGuide } = useGuideStore();
  const { getSeller } = useSellerStore();
  const { tourist, getTourist } = useTouristStore();
  const { getAdvertiser } = useAdvertiserstore();
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setLoading(true);
      setUser(user);
      // console.log(user);
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
          console.log("ss")
          getTourist({userName : user.userName},{});
          break;
        case "admin":
          break;
        case "governor":
          break;
      
        default:
          break;
      }
    }
    setLoading(false);
  },[]);





  return (
    <div >
    <div className="rounded-lg shadow-lg text-center text-[#1e1e2e] min-h-[calc(100vh-3.5vh)] mt-[1vh] w-[calc(100vw-2.51vh)] ml-[1vh] border-2 border-[#23263400] backdrop-blur-xl text-white font-black bg-[#161821f0] ">
      <Navbar />
      {!loading ? 
      <Routes>
        <Route path="/security" element={<Security />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
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
        <Route path="/attraction" element={<MuseumsPage/>}/>
        <Route path="/changePassword" element={<ChangePassword/>}/>
        <Route path="/fileComplaint" element={<FileComplaint/>}/>
        <Route path="/updateItinerary" element={<UpdateItinerary />} />
        <Route path="/TourGuideProfilePage" element={<TourGuideProfilePage/>}/>
        <Route path="/activityPage" element={<ActivityPage/>}/>
        <Route path="/createActivity" element={<CreateActivity/>}/>
        <Route path="/changeCurrency" element={<ChangeCurrency/>}/>
        <Route path="/hotelBooking" element={<HotelBookingPage/>}/>
        <Route path="/flightBooking" element={<FlightBookingPage/>}/>
        <Route path="/bookedFlights" element={<BookedFlights/>}/>
        <Route path="/bookedHotels" element={<BookedHotels/>}/>
    
        <Route path="/complaints" element={<Complaints/>}/>
        <Route path="/viewDeleteRequests" element={<ViewDeleteRequests/>}/>

        <Route path="/itineraryDetail/:id" element={<ItineraryDetail/>}/>
        <Route path="/activityDetail/:id" element={<ActivityDetail/>}/>
        <Route path="/transportationActivityDetail/:id" element={<TransportationActivityDetail/>}/>

        <Route path="/CreateTransportationActivity" element={<CreateTransportationActivity/>}/>
        <Route path="/viewReviews" element={<ViewReviews />} />
        <Route path="/transportationActivity" element={<ViewTransportationActivity />} />
        <Route path="/tourguidereviews" element={<TourGuideReviews/>} />
        <Route path="/touristviewitineraries" element={<TouristViewItineraries/>} />
        <Route path="/touristviewactivities" element={<TouristViewActivities/>} />
        <Route path="/updateActivity" element={<UpdateActivity/>} />
        <Route path="/adminItineraryPage" element={<AdminItineraryPage/>} />
        <Route path="/adminActivitiesPage" element={<AdminActivitiesPage/>} />

        <Route path="/product/edit/:id" element={<EditProduct />} />

      </Routes>
      :
      <FiLoader size={50} className="mx-auto mt-[49vh] animate-spin" />
      }
    </div>
   
    </div>
  );
}

export default App;
