import HomePage from "../pages/Tourist/HomePage";
import AllActivities from "../pages/Admin/AllActivities";
import ComplaintList from "../components/Complaint/ComplaintList";
import ViewSingleComplaint from "../components/Complaint/ViewSingleComplaint";
import Shop from "../pages/Product/Shop";
import Bookings from "../pages/Tourist/Bookings";
import Orders from "../pages/Tourist/Orders";

const touristRoutes = [
    { path: "/tourist", element: <HomePage /> },
    { path: "/tourist/activities", element: <AllActivities /> },
    { path: "/tourist/complaints", element: <ComplaintList /> },
    {
        path: "/tourist/complaint/:complaintId",
        element: <ViewSingleComplaint />,
    },
    { path: "/tourist/shop", element: <Shop /> },
    { path: "/tourist/bookings", element: <Bookings /> },
    { path: "/tourist/orders", element: <Orders /> },
];
