import AdvertiserHome from "../pages/Advertiser/AdvertiserHome";
import CreateActivityPage from "../pages/Activity/CreateActivityPage";
import UpdateActivityPage from "../pages/Activity/UpdateActivityPage";
import MyActivity from "../pages/Advertiser/MyActivity";
import AdvertiserProfilePage from "../pages/Advertiser/AdvertiserProfilePage";
import Analytics from "../pages/Analytics/Analytics";
const advertiserRoutes = [
    { path: "/advertiser", element: <AdvertiserHome /> },
    {
        path: "/advertiser/profile",
        element: <AdvertiserProfilePage />,
    },
    { path: "/advertiser/create-activity", element: <CreateActivityPage /> },
    { path: "/advertiser/update-activity", element: <UpdateActivityPage /> },
    { path: "/advertiser/assigned", element: <MyActivity /> },
    { path: "/advertiser/analytics", element: <Analytics /> },
];

export default advertiserRoutes;
