import "./App.css";
import "./index.css";

import {
    BrowserRouter as Router,
    Route,
    Routes,
    Outlet,
    Navigate,
} from "react-router-dom";

import ViewProductPage from "./pages/Product/ViewProductPage";
import Test from "./components/Test.jsx";
import { HeaderProvider } from "./components/Header/HeaderContext";
import { FunctionProvider } from "./contexts/FunctionContext.jsx";
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

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./hooks/currencyHooks.js";

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
        <QueryClientProvider client={queryClient}>
            <HeaderProvider>
                <FunctionProvider>
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

                                <Route path="/test" element={<Test />} />

                                {/* Default route */}
                                <Route path="*" element={<Navigate to="/signin" />} />
                            </Route>
                        </Routes>
                    </Router>
                </FunctionProvider>
            </HeaderProvider>
        </QueryClientProvider>
    );
}

export default App;
