import HomePage from "../pages/HomePage/HomePage";
import AboutPage from "../pages/AboutPage";
import TermsAndConditions from "../pages/Privacy/TermsAndConditions";
import Shop from "../pages/Product/Shop";
import Landmarks from "../pages/Landmark/Landmarks";
import Activities from "../pages/Activity/Activities";
import ActivityDetails from "../pages/Activity/ActivityDetails";
import Itineraries from "../pages/Itinerary/Itineraries";
import ItineraryDetails from "../pages/Itinerary/ItineraryDetails";
import Demo from "../pages/Demo.jsx";
import TourGuideProfilePage from "../pages/TourGuide/TourGuideProfilePage.jsx";

const publicRoutes = [
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    { path: "/privacy", element: <TermsAndConditions /> },
    { path: "/shop", element: <Shop /> },
    { path: "/landmarks", element: <Landmarks /> },
    { path: "/activities", element: <Activities /> },
    { path: "/activity-details/:activityId", element: <ActivityDetails /> },
    { path: "/itineraries", element: <Itineraries /> },
    { path: "/itinerary-details/:itineraryId", element: <ItineraryDetails /> },
    { path: "/tourguide/profile/:username", element: <TourGuideProfilePage /> },
    { path: "/demo", element: <Demo /> },
];
export default publicRoutes;
