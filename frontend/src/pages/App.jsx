import React, { useEffect } from 'react';
import sun from "../images/sun.png";
import umbrella from "../images/umbrella.png";
import pyramid from "../images/pyramid.png";
import plane from "../images/plane.png";
import { FaSun } from "react-icons/fa6";
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
import EditProfile from "./EditProfile";
import ActivityCategory from "./ActivityCategory";
import ActivityDetail from "./ActivityDetail";
import ActivityPage from "./ActivityPage";
import AdminActivitiesPage from './AdminActivitiesPage';
import AdminDashboard from "./AdminDashboardPage";
import AdminItineraryPage from './AdminItineraryPage';
import AdvertiserProfile from "./AdvertiserProfilePage";
import BookedFlights from "./BookedFlights";
import BookedHotels from "./BookedHotels";
import CancelledPaymentPage from './CancelledPayment';
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
import SuccessfulPaymentPage from './SuccessfulPayment';
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
import ViewOrderDetails from './ViewOrderDetails.jsx';
//import CheckoutPage from './CheckOutPage.jsx';
import TourGuideSalesReport from './TourGuideSalesReport.jsx';
import TourGuideTouristReport from './TourGuideTouristReport.jsx';
import SellerSalesReport from './SellerSalesReport.jsx';
import { Toaster } from 'react-hot-toast';

import ViewMyComplaints from './ViewMyComplaints.jsx';
import ViewMyOrders from './ViewMyOrders.jsx';
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
    <div className="text-center relative  font-black h-[100vh] overflow-x-hidden">
				<div className="absolute translate-x-[-50%] translate-y-[-50%] text-yellow-400 top-0 left-0">
					<img src={sun} alt="sun" className="w-32 h-32 animate-spin-slow" />
				</div>
					<img src={umbrella} alt="umbrella" className="w-10 h-10 z-[1] fixed bottom-0 right-0 rotate-[-30deg] translate-y-[13px] translate-x-[-150px]" />
					<img src={plane} alt="plane" className="w-8 h-8 z-[1] z-[-1] absolute top-0 right-36 rotate-[30deg] translate-y-[-10px] translate-x-[-400px]" />
					<img src={pyramid} alt="pyramid" className="w-10 h-10 z-[1] fixed bottom-0 left-2 translate-y-[8px]" />
					<img src={pyramid} alt="pyramid" className="w-8 h-8 z-[1] fixed bottom-0 left-6 translate-y-[7px]" />
					<img src={pyramid} alt="pyramid" className="w-6 h-6 z-[1] fixed bottom-0 left-10 translate-y-[7px]" />
      <Navbar />
      <Toaster />
      {!loading ? 
      <Routes>
        <Route path="/security" element={<Security />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
				<Route path="/editProfile" element={<EditProfile />} />
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
			 {/* <Route path="/checkoutPage" element={<CheckoutPage />} /> */}
        <Route path="/tourGuideTouristReport" element={<TourGuideTouristReport />} /> 
        <Route path="/tourGuideSalesReport" element={<TourGuideSalesReport />} />
        <Route path="/sellerSalesReport" element={<SellerSalesReport />} />
						
        <Route path="/itineraryDetail/:id" element={<ItineraryDetail/>}/>
        <Route path="/activityDetail/:id" element={<ActivityDetail/>}/>
        <Route path="/transportationActivityDetail/:id" element={<TransportationActivityDetail/>}/>
        <Route path="/orderDetails/:id" element={<ViewOrderDetails/>}/>

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
        <Route path="/viewMyOrders" element={<ViewMyOrders/>} />

        <Route path="/product/edit/:id" element={<EditProduct />} />

        <Route path="/wishlist" element={<WishlistPage user={user}/>}/> 
         <Route path="/Cart" element={<CartPage user={user}/>} />
        <Route path="/wishlist" element={<WishlistPage user={user}/>} />
        <Route path="/payment/:type/:id" element={<PaymentPage />} />
        <Route path="/cancel/:type" element={<CancelledPaymentPage/>} />
        <Route path="/success/:type" element={<SuccessfulPaymentPage/>} />
      </Routes>
      :
      <FiLoader size={50} className="mx-auto mt-[49vh] animate-spin" />
      }
    </div>
   
    </div>
  );
}

export default App;
