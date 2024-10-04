import React from "react";
import Navbar from "../components/Navbar";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import { Route, Routes } from "react-router-dom";
import ActivityCategoryPage from "./ActivityCategoryPage";
import ViewAttractions from "./ViewAttractions";
import PreferenceTag from "./PreferenceTag";
import ViewActivities from "./ViewActivities";
import ViewIteneraries from "./viewIteneraries";
import ViewProducts from "./ViewProducts";
import ItineraryPage from "./ItineraryPage";
import CreateItinerary from "./CreateItinerary";
function App() {
  return (
    <div className="rounded-lg shadow-lg text-center text-[#1e1e2e] min-h-[calc(100vh-2vh)] mt-[1vh] w-[calc(100vw-2vh)] ml-[1vh] border-2 border-[#23263400] backdrop-blur-xl text-white font-black bg-[#161821f0] ">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/viewAttractions" element={<ViewAttractions />} />
        <Route path="/viewActivities" element={<ViewActivities />} />
        <Route path="/viewIteneraries" element={<ViewIteneraries />} />
        <Route path="/preferenceTag" element={<PreferenceTag />} />  
        <Route path="/viewProducts" element={<ViewProducts />} />
        <Route path="/activityCategory" element={<ActivityCategoryPage />} />
        <Route path="/itineraryPage" element={<ItineraryPage />} />
        <Route path="/createItinerary" element={<CreateItinerary />} />
        
      </Routes>
    </div>
  );
}

export default App;