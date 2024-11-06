import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import LandmarkPage from "./pages/Landmark/LandmarkPage";
import CreateActivityPage from "./pages/Activity/CreateActivityPage";
import UpdateActivityPage from "./pages/Activity/UpdateActivityPage";
import FilterLandmarks from "./pages/Landmarks/FilterLandmarks";
import AddNewUser from "./pages/Admin/AddNewUser";
import UserManagement from "./pages/Admin/UserManagement";
import ViewProductsPage from "./pages/Product/ViewProductsPage";
import ViewProductPage from "./pages/Product/ViewProductPage";
import Activities from "./pages/Activity/Activities";
import FilterItineraries from "./pages/Itinerary/FilterItineraries";
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
import Itineraries from "./pages/Itinerary/Itineraries";
import Landmarks from "./pages/Landmark/Landmarks";
import Inventory from "./pages/Seller/Inventory";

function App() {
    function handelClick() {
        console.log("Button clicked");
    }
    return (
        <Router>
            <Routes>
                {/* signin and signup pages */}
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/select-your-role" element={<SelectYourRole />} />
                {/* home pages for each role */}
                <Route path="/admin" element={<AdminHome />} />
                <Route path="/advertiser" element={<AdvertiserHome />} />
                <Route path="/tourguide" element={<TourGuideHome />} />
                <Route path="/seller" element={<SellerHome />} />

                <Route path="/governor" element={<GovernorHome />} />
                {/* Home page for Tourist and Guest */}
                <Route path="/" element={<HomePage />} />

                {/* other pages */}
                <Route path="/activities" element={<Activities />} />
                <Route path="/itineraries" element={<Itineraries />} />
                <Route path="/landmarks" element={<Landmarks />} />

                <Route path="/about" element={<AboutPage />} />
                <Route path="/create-product" element={<CreateProductPage />} />
                <Route path="/add-new-user" element={<AddNewUser />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route
                    path="/update-product/:productId"
                    element={<UpdateProductPage />}
                />
                <Route path="/products/:productId" element={<ViewProductPage />} />
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
                <Route path="/advertiser/assigned" element={<MyActivity />} />
                <Route path="/tourguide/assigned" element={<MyItinenrary />} />
                <Route path="/seller/inventory" element={<Inventory />} />

                <Route path="/create-activity" element={<CreateActivityPage />} />
                <Route path="/update-activity" element={<UpdateActivityPage />} />
                <Route path="/filter-landmarks" element={<FilterLandmarks />} />
                <Route path="/view-products" element={<ViewProductsPage />} />

                <Route path="/landmark/landmark/" element={<LandmarkPage />} />
                <Route path="/create-itinerary" element={<CreateItineraryPage />} />
                <Route path="/filter-itineraries" element={<FilterItineraries />} />
                <Route path="/create-landmark" element={<CreateLandmarkPage />} />
            </Routes>
        </Router>
    );
}

export default App;
