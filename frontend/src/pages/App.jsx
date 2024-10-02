import React from "react";
import Navbar from "../components/Navbar";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import { Route, Routes } from "react-router-dom";
import ActivityCategoryPage from "./ActivityCategoryPage";
import ViewAttractions from "./ViewAttractions";

function App() {
  return (
    <div className="rounded-lg shadow-lg text-center text-[#1e1e2e] min-h-[calc(100vh-6vh)] mt-[3vh] w-[calc(100vw-6vh)] ml-[3vh] border-2 backdrop-blur-xl text-gray-500 font-black bg-[rgba(255,255,255,0.6)] ">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/view" element={<ViewAttractions />} />
        <Route path="/ActivityCategory" element={<ActivityCategoryPage />} />
      </Routes>
    </div>
  );
}

export default App;
