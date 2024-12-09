import HomePage from "../pages/HomePage/HomePage";
import AllActivities from "../pages/Admin/AllActivities";
import ComplaintList from "../components/Complaint/ComplaintList";
import ViewSingleComplaint from "../components/Complaint/ViewSingleComplaint";
import Bookings from "../pages/Tourist/Bookings";
import Orders from "../pages/Tourist/Orders";
import HotelList from "../components/Hotels/HotelList";
import ShowOfferDetails from "../components/Hotels/ShowOfferDetails";
import TouristProfilePage from "../pages/Tourist/TouristProfilePage";
import Flights from "../pages/Flights/Flights";
import FlightBookingDetails from "../pages/Flights/FlightBookingDetails";
import Bookmarks from "../pages/Tourist/Bookmarks";
import Payment from "../pages/Payment/Payment.jsx";
import Checkout from "../pages/Product/CheckoutPage.jsx";
import Cart from "../pages/Product/Cart.jsx";
import OrderDetails from "../pages/Tourist/OrderDetails.jsx";
import Demo from "../pages/Demo.jsx";
const touristRoutes = [
    { path: "/tourist", element: <HomePage /> },
    { path: "/tourist/demo", element: <Demo /> },
    {
        path: "/tourist/profile",
        element: <TouristProfilePage />,
    },
    { path: "/tourist/activities", element: <AllActivities /> },
    { path: "/tourist/complaints", element: <ComplaintList /> },
    {
        path: "/tourist/complaint/:complaintId",
        element: <ViewSingleComplaint />,
    },
    { path: "/tourist/bookings", element: <Bookings /> },
    { path: "/tourist/orders", element: <Orders /> },
    { path: "/tourist/hotel/offers", element: <HotelList /> },
    {
        path: "tourist/hotel/offer-details/:id",
        element: <ShowOfferDetails />,
    },
    { path: "tourist/flight/offers", element: <Flights /> },
    {
        path: "tourist/flight/flight-booking-details",
        element: <FlightBookingDetails />,
    },
    { path: "tourist/bookmarks", element: <Bookmarks /> },
    { path: "tourist/cart", element: <Cart /> },
    { path: "tourist/checkout", element: <Checkout /> },
    { path: "tourist/payment", element: <Payment /> },
    { path: "tourist/order-details/:id", element: <OrderDetails /> },
];

export default touristRoutes;
