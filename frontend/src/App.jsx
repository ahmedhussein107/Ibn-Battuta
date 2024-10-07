import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CreateProductPage from "./pages/Product/CreateProductPage";
import UpdateProductPage from "./pages/Product/UpdateProductPage";
import TourGuideProfilePage from "./pages/TourGuide/TourGuideProfilePage";
import NavBar from "./components/NavBar";
import TouristProfilePage from "./pages/Tourist/TouristProfilePage";
import SignUpPage from "./pages/Tourist/SignUpPage";
import Itineraries from "./pages/Itinerary/Itineraries";
import AllSignUpPage from "./pages/AllSignUpPage";
import Map from "./pages/map";
function App() {
    return <Map />;
}

export default App;
