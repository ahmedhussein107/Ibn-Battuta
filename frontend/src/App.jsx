import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CreateProductPage from "./pages/Product/CreateProductPage";
import UpdateProductPage from "./pages/Product/UpdateProductPage";
import TourGuideProfilePage from "./pages/TourGuide/TourGuideProfilePage";
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
import TestShopLayout from "./components/Shop/Shop";

function App() {
	return (
		<HeaderProvider>
			<Router>
				<Header />
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/test" element={<PopUp />} />
					<Route path="/complaints" element={<ComplaintList />} />
					<Route path="/shop" element={<TestShopLayout />} />
					<Route path="/complaint/:complaintId" element={<ViewSingleComplaint />} />
					{/* signin and signup pages */}
					<Route path="/signup" element={<SignUpPage />} />
					<Route path="/signin" element={<Signin />} />
					<Route path="/select-your-role" element={<SelectYourRole />} />
					{/* home pages for each role */}
					<Route path="/admin" element={<AdminHome />} />
					<Route path="/advertiser" element={<AdvertiserHome />} />
					<Route path="/tourguide" element={<TourGuideHome />} />
					<Route path="/seller" element={<SellerHome />} />

					{/* other pages */}
					<Route path="/activities" element={<Activities />} />
					<Route path="/itineraries" element={<Itineraries />} />
					<Route path="/itinerary-details" element={<ItineraryDetails />} />
					<Route path="/landmarks" element={<Landmarks />} />

					<Route path="/about" element={<AboutPage />} />
					<Route path="/create-product" element={<CreateProductPage />} />
					<Route path="/add-new-user" element={<AddNewUser />} />
					<Route path="admin/users" element={<UserManagement />} />
					<Route path="/update-product/:productId" element={<UpdateProductPage />} />
					<Route path="/products/:productId" element={<ViewProductPage />} />
					<Route path="/tourguide" element={<TourGuideProfilePage />} />
					<Route path="/landmark-governor" element={<GovernorLandmarks />} />
					<Route path="/advertiser/assigned" element={<MyActivity />} />
					<Route path="/tourguide/assigned" element={<MyItinenrary />} />
					<Route path="/inventory" element={<Inventory />} />

					<Route path="/create-activity" element={<CreateActivityPage />} />
					<Route path="/update-activity" element={<UpdateActivityPage />} />
					<Route path="/view-products" element={<ViewProductsPage />} />

					<Route path="/landmark/landmark/" element={<LandmarkPage />} />
					<Route path="/create-itinerary" element={<CreateItineraryPage />} />
					<Route path="/create-landmark" element={<CreateLandmarkPage />} />

					<Route path="/admin/tags" element={<ViewTags />} />
					<Route path="/admin/category" element={<ViewCategories />} />
				</Routes>
			</Router>
		</HeaderProvider>
	);
}

export default App;
