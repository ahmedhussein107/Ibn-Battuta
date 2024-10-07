import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CreateProductPage from "./pages/Product/CreateProductPage";
import UpdateProductPage from "./pages/Product/UpdateProductPage";
import TourGuideProfilePage from "./pages/TourGuide/TourGuideProfilePage";
import SellerProfilePage from "./pages/Seller/SellerProfilePage";
import AdvertiserProfilePage from "./pages/Advertiser/AdvertiserProfilePage";
import CreateActivityPage from "./pages/Activity/CreateActivityPage";
import UpdateActivityPage from "./pages/Activity/UpdateActivityPage";
import FilterLandmarks from "./pages/Landmarks/FilterLandmarks";
import NavBar from "./components/NavBar";
import TouristProfilePage from "./pages/Tourist/TouristProfilePage";
import SignUpPage from "./pages/Tourist/SignUpPage";
import AllSignUpPage from "./pages/AllSignUpPage";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/create-product" element={<CreateProductPage />} />
        <Route
          path="/update-product/:productId"
          element={<UpdateProductPage />}
        />
        <Route path="/tourguide" element={<TourGuideProfilePage />} />
        <Route path="/advertiser" element={<AdvertiserProfilePage />} />
        <Route path="/create-activity" element={<CreateActivityPage />} />
        <Route path="/update-activity" element={<UpdateActivityPage />} />
        <Route path="/filter-landmarks" element={<FilterLandmarks />} />
        <Route path="/tourist" element={<TouristProfilePage />} />
        <Route path="/seller" element={<SellerProfilePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/allsignup" element={<AllSignUpPage />} />
      </Routes>
    </Router>
  );
}

export default App;
