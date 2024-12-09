import MyItineraries from "../pages/TourGuide/TourGuideItineraries";
import CreateItineraryPage from "../pages/TourGuide/CreateItineraryPage";
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
    { path: "/tourguide/assigned", element: <MyItineraries /> },
    {
        path: "/tourguide/create-itinerary",
        element: <CreateItineraryPage />,
    },
    {
        path: "/tourguide/edit-itinerary/:itineraryId",
        element: <CreateItineraryPage isEdit={true} />,
    },
    { path: "/tourguide/choose-activity", element: <ChooseActivity /> },
    { path: "/tourguide/analytics", element: <Analytics /> },
];
export default tourguideRoutes;
