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
import FilterLandmarks from "./pages/Governor/FilterLandmarks";
import GovernorLandmarks from "./pages/Governor/GovernorLandmarks";
import TourGuideItineraries from "./pages/TourGuide/TourGuideItineraries";
import TourGuideCustomActivities from "./pages/TourGuide/TourGuideCustomActivities";
import AdvertiserActivities from "./pages/Advertiser/AdvertiserActivities";
import NavBar from "./components/NavBar";

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
        <Route path="/landmark" element={<FilterLandmarks />} />
        <Route path="/landmark-governor" element={<GovernorLandmarks />} />
        <Route path="/itinerary" element={<TourGuideItineraries />} />
        <Route
          path="/itinerary-customAvtivity"
          element={<TourGuideCustomActivities />}
        />
        <Route path="/activity" element={<AdvertiserActivities />} />
      </Routes>
    </Router>
  );
}

export default App;
