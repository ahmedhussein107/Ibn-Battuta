import {
    BrowserRouter as Router,
    Route,
    Routes,
    Outlet,
    Navigate,
} from "react-router-dom";
import "./App.css";
import LandmarkPage from "./pages/Landmark/LandmarkPage";
import ViewProductPage from "./pages/Product/ViewProductPage";
import { HeaderProvider } from "./components/Header/HeaderContext";
import Header from "./components/Header/Header";
import NavBar from "./components/NavBar.jsx";
import Cookies from "js-cookie";
import adminRoutes from "./routes/admin.jsx";
import authRoutes from "./routes/auth.jsx";
import advertiserRoutes from "./routes/advertiser.jsx";
import governorRoutes from "./routes/governor.jsx";
import sellerRoutes from "./routes/seller.jsx";
import tourguideRoutes from "./routes/tourguide.jsx";
import touristRoutes from "./routes/tourist.jsx";
import publicRoutes from "./routes/public.jsx";

const returnUserRoutes = (routesList, userType) => {
    return (
        <>
            {(!userType || Cookies.get("userType") === userType) &&
                routesList.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                ))}
        </>
    );
};
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
                    {returnUserRoutes(authRoutes)}

                    <Route element={<LayoutWithNav />}>
                        {returnUserRoutes(publicRoutes)}
                        {returnUserRoutes(adminRoutes, "Admin")}
                        {returnUserRoutes(advertiserRoutes, "Advertiser")}
                        {returnUserRoutes(governorRoutes, "Governor")}
                        {returnUserRoutes(sellerRoutes, "Seller")}
                        {returnUserRoutes(tourguideRoutes, "TourGuide")}
                        {returnUserRoutes(touristRoutes, "Tourist")}

                        <Route
                            path="/products/:productId"
                            element={<ViewProductPage />}
                        />

                        {/* doesn't exist */}
                        <Route path="/landmark/landmark/" element={<LandmarkPage />} />

                        {/* Default route */}
                        <Route path="*" element={<Navigate to="/signin" />} />
                    </Route>
                </Routes>
            </Router>
        </HeaderProvider>
    );
}

export default App;
