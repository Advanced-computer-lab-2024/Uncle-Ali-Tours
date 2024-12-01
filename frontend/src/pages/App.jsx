import React, { useEffect } from 'react';
import { FiLoader } from 'react-icons/fi';
import { Route, Routes } from "react-router-dom";
import BookMark from '../components/BookMark';
import EditProduct from "../components/EditProduct.jsx";
import Navbar from "../components/Navbar";
import { useAdvertiserstore } from "../store/advertiser";
import { useSellerStore } from "../store/seller";
import { useGuideStore } from "../store/tourGuide";
import { useTouristStore } from "../store/tourist";
import { useUserStore } from "../store/user";
import ActivityCategory from "./ActivityCategory";
import ActivityDetail from "./ActivityDetail";
import ActivityPage from "./ActivityPage";
import AdminActivitiesPage from './AdminActivitiesPage';
import AdminDashboard from "./AdminDashboardPage";
import AdminItineraryPage from './AdminItineraryPage';
import AdvertiserProfile from "./AdvertiserProfilePage";
import BookedFlights from "./BookedFlights";
import BookedHotels from "./BookedHotels";
import ChangeCurrency from "./ChangeCurrency";
import ChangePassword from "./ChangePassword";
import Complaints from "./Complaints";
import CreateActivity from "./CreateActivity";
import CreateItinerary from "./CreateItinerary";
import CreateTransportationActivity from "./CreateTransportationActivity.jsx";
import FileComplaint from "./FileComplaint";
import FlightBookingPage from "./FlightBookingPage";
import HomePage from "./HomePage";
import HotelBookingPage from "./HotelBookingPage";
import ItineraryDetail from "./ItineraryDetail";
import ItineraryPage from "./ItineraryPage";
import LoginPage from "./LoginPage";
import MuseumsPage from "./MuseumsPage";
import Notification from './Notification.jsx';
import PaymentPage from "./PaymentPage";
import PreferenceTag from "./PreferenceTag";
import Productpage from "./Productpage";
import RegisterPage from "./RegisterPage";
import Security from './Security.jsx';
import SellerProfilePage from "./SellerProfilePage";
import TourGuideProfilePage from "./TourGuideProfilePage";
import TourGuideReviews from "./TourGuideReviews";
import TouristProfile from './TouristProfile';
import TouristViewActivities from "./TouristViewActivities";
import TouristViewItineraries from "./TouristViewItineraries";
import TransportationActivityDetail from "./TransportationActivityDetail";
import TransportationActivityPage from './TransportationActivityPage.jsx';
import UpdateActivity from "./UpdateActivity";
import UpdateItinerary from "./UpdateItinerary";
import ViewActivities from "./ViewActivities";
import ViewAttractions from "./ViewAttractions";
import ViewDeleteRequests from "./ViewDeleteRequests";
import ViewItineraries from "./ViewItineraries";
import ViewPastActivities from './ViewPastActivities.jsx';
import ViewPastItineraries from './ViewPastItineraries.jsx';
import ViewProducts from "./ViewProducts";
import ViewReviews from "./ViewReviews";
import CartPage from "./CartPage.jsx";
import ViewUpcomingItineraries from './ViewUpcomingItineraries.jsx';
import ViewUpcomingActivities from './ViewUpcomingActivities.jsx';
import ViewTransportationActivity from './ViewTransportationActivity.jsx';
import WishlistPage from "./WishlistPage";
import AddAddressPage from './AddAddressPage.jsx';
import CheckoutPage from './CheckOutPage.jsx';


import ViewMyComplaints from './ViewMyComplaints.jsx';

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
    <div className="rounded-lg shadow-lg text-center text-white min-h-[calc(100vh-3.5vh)] mt-[1vh] w-[calc(100vw-2.51vh)] ml-[1vh] border-2 border-[#23263400] backdrop-blur-xl  font-black bg-[#090711c2] overflow-x-hidden">
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
						<Route path="/notifications" element={<Notification />} />
        <Route path="/createItinerary" element={<CreateItinerary />} />
        <Route path="/sellerProfile" element={<SellerProfilePage />} />
        <Route path="/advertiserProfile" element={<AdvertiserProfile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/product" element={<Productpage />} />
        <Route path="/TouristProfile" element={<TouristProfile />} />
        <Route path="/AddAddressPage" element={<AddAddressPage/>} />
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
        <Route path="/ViewTransportationActivity" element={<ViewTransportationActivity/>}/>
        <Route path="/complaints" element={<Complaints/>}/>
        <Route path="/viewDeleteRequests" element={<ViewDeleteRequests/>}/>
        <Route path="/bookmarks" element={<BookMark userName={user.userName} />} />
        <Route path="/checkoutPage" element={<CheckoutPage />} />
            

        <Route path="/itineraryDetail/:id" element={<ItineraryDetail/>}/>
        <Route path="/activityDetail/:id" element={<ActivityDetail/>}/>
        <Route path="/transportationActivityDetail/:id" element={<TransportationActivityDetail/>}/>

        <Route path="/CreateTransportationActivity" element={<CreateTransportationActivity/>}/>
        <Route path="/viewReviews" element={<ViewReviews />} />
        <Route path="/TransportationActivityPage" element={<TransportationActivityPage />} />
        <Route path="/tourguidereviews" element={<TourGuideReviews/>} />
        <Route path="/touristviewitineraries" element={<TouristViewItineraries/>} />
        <Route path="/touristviewactivities" element={<TouristViewActivities/>} />
        <Route path="/updateActivity" element={<UpdateActivity/>} />
        <Route path="/adminItineraryPage" element={<AdminItineraryPage/>} />
        <Route path="/adminActivitiesPage" element={<AdminActivitiesPage/>} />
        <Route path="/upcomingItineraries" element={<ViewUpcomingItineraries/>} />
        <Route path="/pastItineraries" element={<ViewPastItineraries/>} />
        <Route path="/upcomingActivities" element={<ViewUpcomingActivities/>} />
        <Route path="/pastActivities" element={<ViewPastActivities/>} />
        <Route path="/viewMyComplaints" element={<ViewMyComplaints/>} />

        <Route path="/product/edit/:id" element={<EditProduct />} />

        <Route path="/wishlist" element={<WishlistPage user={user}/>}/> 
         <Route path="/Cart" element={<CartPage user={user}/>} />
        <Route path="/wishlist" element={<WishlistPage user={user}/>} />
        <Route path="/payment/:type/:id" element={<PaymentPage />} />
      </Routes>
      :
      <FiLoader size={50} className="mx-auto mt-[49vh] animate-spin" />
      }
    </div>
   
    </div>
  );
}

export default App;
