import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CreateProductPage from "./pages/Product/CreateProductPage";
import UpdateProductPage from "./pages/Product/UpdateProductPage";
import TourGuideProfilePage from "./pages/TourGuide/TourGuideProfilePage";
import SellerProfilePage from "./pages/Seller/SellerProfilePage";
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
				<Route path="/seller" element={<SellerProfilePage />} />
			</Routes>
		</Router>
	);
}

export default App;
