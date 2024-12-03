import HomePage from "../pages/HomePage";
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

const touristRoutes = [
    { path: "/tourist", element: <HomePage /> },
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
];

export default touristRoutes;
