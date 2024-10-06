import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CreateProductPage from "./pages/Product/CreateProductPage";
import UpdateProductPage from "./pages/Product/UpdateProductPage";
import TourGuideProfilePage from "./pages/TourGuide/TourGuideProfilePage";
import LandmarkPage from "./pages/Landmark/LandmarkPage";
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
            </Routes>
        </Router>
    );
}

export default App;
