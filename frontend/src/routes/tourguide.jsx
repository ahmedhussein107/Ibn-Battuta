import MyItinenrary from "../pages/TourGuide/MyItinenrary";
import CreateItineraryPage from "../pages/Itinerary/CreateItineraryPage";
import TourGuideProfilePage from "../pages/TourGuide/TourGuideProfilePage";
import TourGuideHome from "../pages/TourGuide/TourGuideHome";
import ChooseActivity from "../pages/Itinerary/ChooseActivity";
import Analytics from "../pages/Analytics/Analytics";
const tourguideRoutes = [
    { path: "/tourguide", element: <TourGuideHome /> },

    {
        path: "/tourguide/profile",
        element: <TourGuideProfilePage />,
    },
    { path: "/tourguide/assigned", element: <MyItinenrary /> },
    {
        path: "/tourguide/create-itinerary",
        element: <CreateItineraryPage />,
    },
    { path: "/tourguide/choose-activity", element: <ChooseActivity /> },
    { path: "/tourguide/analytics", element: <Analytics /> },
];
export default tourguideRoutes;
