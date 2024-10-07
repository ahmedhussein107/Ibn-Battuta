import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CreateProductPage from "./pages/Product/CreateProductPage";
import UpdateProductPage from "./pages/Product/UpdateProductPage";
import TourGuideProfilePage from "./pages/TourGuide/TourGuideProfilePage";
import UpdateCategory from "./pages/Category/UpdateCategory";
import CreateCategory from "./pages/Category/CreateCategory";
import GetAllCategories from "./pages/Category/GetAllCategories";
import UpdateTag from "./pages/Tag/UpdateTag";
import CreateTag from "./pages/Tag/CreateTag";
import GetAllTags from "./pages/Tag/GetAllTags";
import GovernorLandmarks from "./pages/Governor/GovernorLandmarks";
import TourGuideItineraries from "./pages/TourGuide/TourGuideItineraries";
import TourGuideCustomActivities from "./pages/TourGuide/TourGuideCustomActivities";
import AdvertiserActivities from "./pages/Advertiser/AdvertiserActivities";
import SellerProfilePage from "./pages/Seller/SellerProfilePage";
import AdvertiserProfilePage from "./pages/Advertiser/AdvertiserProfilePage";
import CreateActivityPage from "./pages/Activity/CreateActivityPage";
import UpdateActivityPage from "./pages/Activity/UpdateActivityPage";
import FilterLandmarks from "./pages/Landmarks/FilterLandmarks";
import NavBar from "./components/NavBar";
import TouristProfilePage from "./pages/Tourist/TouristProfilePage";
import SignUpPage from "./pages/Tourist/SignUpPage";
import AllSignUpPage from "./pages/AllSignUpPage";
import ViewProductsPage from "./pages/Product/ViewProductsPage";
import UpcomingActivities from "./pages/Activity/UpcomingActivities";

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
        <Route path="/category/:id" element={<UpdateCategory />} />
        <Route path="/category-create" element={<CreateCategory />} />
        <Route path="/category-all" element={<GetAllCategories />} />
        <Route path="/tag/:id" element={<UpdateTag />} />
        <Route path="/tag-create" element={<CreateTag />} />
        <Route path="/tag-all" element={<GetAllTags />} />
        <Route path="/landmark-governor" element={<GovernorLandmarks />} />
        <Route path="/itinerary" element={<TourGuideItineraries />} />
        <Route
          path="/itinerary-customAvtivity"
          element={<TourGuideCustomActivities />}
        />
        <Route path="/activity" element={<AdvertiserActivities />} />
        <Route path="/advertiser" element={<AdvertiserProfilePage />} />
        <Route path="/create-activity" element={<CreateActivityPage />} />
        <Route path="/update-activity" element={<UpdateActivityPage />} />
        <Route path="/filter-landmarks" element={<FilterLandmarks />} />
        <Route path="/tourist" element={<TouristProfilePage />} />
        <Route path="/seller" element={<SellerProfilePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/allsignup" element={<AllSignUpPage />} />
        <Route path="/view-products" element={<ViewProductsPage />} />
        <Route path="/activities" element={<UpcomingActivities />} />
      </Routes>
    </Router>
  );
}

export default App;
