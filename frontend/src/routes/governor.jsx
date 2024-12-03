import GovernorLandmarks from "../pages/Governor/GovernorLandmarks";
import CreateLandmarkPage from "../pages/Landmark/CreateLandmarkPage";
import GovernorProfilePage from "../pages/Governor/GovernorProfilePage";
import GovernorHome from "../pages/TourGuide/TourGuideHome";
const governorRoutes = [
    { path: "/governor", element: <GovernorHome /> },

    {
        path: "/governor/profile",
        element: <GovernorProfilePage />,
    },
    {
        path: "governor/landmarks",
        element: <GovernorLandmarks />,
    },
    // doesn't exist
    { path: "governor/create-landmark", element: <CreateLandmarkPage /> },
];
export default governorRoutes;
