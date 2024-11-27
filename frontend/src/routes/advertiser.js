import CreateActivityPage from "../pages/Activity/CreateActivityPage";
import UpdateActivityPage from "../pages/Activity/UpdateActivityPage";
import MyActivity from "../pages/Advertiser/MyActivity";

const advertiserRoutes = [
    { path: "/advertiser/create-activity", element: <CreateActivityPage /> },
    { path: "/advertiser/update-activity", element: <UpdateActivityPage /> },
    { path: "/advertiser/assigned", element: <MyActivity /> },
];

export default advertiserRoutes;
