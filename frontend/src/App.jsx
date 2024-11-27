import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CreateProductPage from "./pages/Product/CreateProductPage";
import UpdateProductPage from "./pages/Product/UpdateProductPage";
import GovernorLandmarks from "./pages/Governor/GovernorLandmarks";
import LandmarkPage from "./pages/Landmark/LandmarkPage";
import CreateActivityPage from "./pages/Activity/CreateActivityPage";
import UpdateActivityPage from "./pages/Activity/UpdateActivityPage";
import AddNewUser from "./pages/Admin/AddNewUser";
import UserManagement from "./pages/Admin/UserManagement";
import ViewProductsPage from "./pages/Product/ViewProductsPage";
import ViewProductPage from "./pages/Product/ViewProductPage";
import CreateItineraryPage from "./pages/Itinerary/CreateItineraryPage";
import CreateLandmarkPage from "./pages/Landmark/CreateLandmarkPage";
import MyActivity from "./pages/Advertiser/MyActivity";
import MyItinenrary from "./pages/TourGuide/MyItinenrary";
import SignUpPage from "./pages/Signup/SignUpPage";
import SelectYourRole from "./pages/Signup/SelectYourRole";
import Signin from "./pages/Signin/Signin";
import AdminHome from "./pages/Admin/AdminHome";
import AdvertiserHome from "./pages/Advertiser/AdvertiserHome";
import TourGuideHome from "./pages/TourGuide/TourGuideHome";
import SellerHome from "./pages/Seller/SellerHome";
import GovernorHome from "./pages/Governor/GovernorHome";
import ComplaintList from "./components/Complaint/ComplaintList";
import ViewSingleComplaint from "./components/Complaint/ViewSingleComplaint";
import Activities from "./pages/Activity/Activities";
import Itineraries from "./pages/Itinerary/Itineraries";
import Landmarks from "./pages/Landmark/Landmarks";
import Inventory from "./pages/Seller/Inventory";
import ViewTags from "./pages/Admin/ViewTags";
import ViewCategories from "./pages/Admin/ViewCategories";
import { HeaderProvider } from "./components/Header/HeaderContext";
import Header from "./components/Header/Header";
import ItineraryDetails from "./pages/Itinerary/ItineraryDetails";
import PopUp from "./components/PopUpsGeneric/PopUp";
import ChooseActivity from "./pages/Itinerary/ChooseActivity.jsx";
import ActivityDetails from "./pages/Activity/ActivityDetails.jsx";
import AllActivities from "./pages/Admin/AllActivities";
import AllItineraries from "./pages/Admin/AllItineraries";
import Shop from "./pages/Product/Shop.jsx";
import Bookings from "./pages/Tourist/Bookings.jsx";
import NavBar from "./components/NavBar.jsx";
import ShowOfferDetails from "./components/Hotels/ShowOfferDetails.jsx";
import HotelList from "./components/Hotels/HotelList.jsx";
import Orders from "./pages/Tourist/Orders.jsx";
import AdminProfilePage from "./pages/Admin/AdminProfilePage";
import AdvertiserProfilePage from "./pages/Advertiser/AdvertiserProfilePage";
import GovernorProfilePage from "./pages/Governor/GovernorProfilePage";
import SellerProfilePage from "./pages/Seller/SellerProfilePage";
import TouristProfilePage from "./pages/Tourist/TouristProfilePage";
import TourGuideProfilePage from "./pages/TourGuide/TourGuideProfilePage";
import TermsAndConditions from "./pages/Privacy/TermsAndConditions";
import Flights from "./pages/Flights/Flights";
import FlightBookingDetails from "./pages/Flights/FlightBookingDetails";

const LayoutWithNav = () => (
    <>
        <NavBar />
        <Outlet /> {/* This renders the nested routes */}
    </>
);

function App() {
    return (
        <HeaderProvider>
            <Router>
                <Header />

                <Routes>
                    <Route element={<LayoutWithNav />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/activities" element={<Activities />} />
                        <Route
                            path="/activity-details/:activityId"
                            element={<ActivityDetails />}
                        />
                        <Route path="/itineraries" element={<Itineraries />} />
                        <Route
                            path="/itinerary-details/:itineraryId"
                            element={<ItineraryDetails />}
                        />

                        {/* home pages for each role */}
                        <Route path="/advertiser" element={<AdvertiserHome />} />
                        <Route path="/tourguide" element={<TourGuideHome />} />
                        <Route path="/tourguide" element={<TourGuideProfilePage />} />
                        <Route path="/seller" element={<SellerHome />} />
                        <Route path="/governor" element={<GovernorHome />} />

                        {/* other pages */}

                        <Route path="/landmarks" element={<Landmarks />} />

                        <Route
                            path="/products/:productId"
                            element={<ViewProductPage />}
                        />

                        <Route path="/view-products" element={<ViewProductsPage />} />
                        <Route path="/choose-activity" element={<ChooseActivity />} />

                        <Route path="/landmark/landmark/" element={<LandmarkPage />} />
                        <Route
                            path="/create-itinerary"
                            element={<CreateItineraryPage />}
                        />
                        <Route path="/create-landmark" element={<CreateLandmarkPage />} />

                        <Route path="/hotel/offers" element={<HotelList />} />
                        <Route
                            path="/hotel/offer-details/:id"
                            element={<ShowOfferDetails />}
                        />
                        <Route path="/admin-profile" element={<AdminProfilePage />} />
                        <Route
                            path="/advertiser-profile"
                            element={<AdvertiserProfilePage />}
                        />
                        <Route
                            path="/governor-profile"
                            element={<GovernorProfilePage />}
                        />
                        <Route path="/seller-profile" element={<SellerProfilePage />} />
                        <Route
                            path="/tourguide-profile"
                            element={<TourGuideProfilePage />}
                        />
                        <Route path="/tourist-profile" element={<TouristProfilePage />} />
                        <Route path="/privacy" element={<TermsAndConditions />} />
                        <Route path="/flights" element={<Flights />} />
                        <Route
                            path="/flight-booking-details"
                            element={<FlightBookingDetails />}
                        />
                    </Route>
                </Routes>
            </Router>
        </HeaderProvider>
    );
}

export default App;
