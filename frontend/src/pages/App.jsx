import React, { useEffect } from 'react';
import { Link, Route, Routes } from "react-router-dom";
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
import ViewTransportationActivity from "./TransportationActivity";
import TransportationActivityDetail from "./TransportationActivityDetail";
import UpdateActivity from "./UpdateActivity";
import UpdateItinerary from "./UpdateItinerary";
import ViewActivities from "./ViewActivities";
import ViewAttractions from "./ViewAttractions";
import ViewDeleteRequests from "./ViewDeleteRequests";
import ViewItineraries from "./ViewItineraries";
import ViewProducts from "./ViewProducts";
import ViewReviews from "./ViewReviews";





function App() {
  const {  setUser } = useUserStore();
  const { getGuide } = useGuideStore();
  const { getSeller } = useSellerStore();
  const { getTourist } = useTouristStore();
  const { getAdvertiser } = useAdvertiserstore();
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
  },[]);



  return (
    <div>
    <div className="rounded-lg shadow-lg text-center text-[#1e1e2e] min-h-[calc(100vh-2vh)] mt-[1vh] w-[calc(100vw-2vh)] ml-[1vh] border-2 border-[#23263400] backdrop-blur-xl text-white font-black bg-[#161821f0] ">
      <Navbar />
      <Routes>
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

        <Route path="/viewReviews" element={<ViewReviews />} />
        <Route path="/transportationActivity" element={<ViewTransportationActivity />} />
        <Route path="/tourguidereviews" element={<TourGuideReviews/>} />
        <Route path="/touristviewitineraries" element={<TouristViewItineraries/>} />
        <Route path="/touristviewactivities" element={<TouristViewActivities/>} />
        <Route path="/updateActivity" element={<UpdateActivity/>} />
      </Routes>
    </div>
    <div className="mx-auto w-fit">
        <Link to='/changePassword' className="mx-auto">
          changePassword
        </Link>
      </div>
    </div>
  );
}

export default App;
