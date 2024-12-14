import AdminHome from "../pages/Admin/AdminHome";
import UserManagement from "../pages/Admin/UserManagement";
import ViewTags from "../pages/Admin/ViewTags";
import AllActivities from "../pages/Admin/AllActivities";
import ComplaintList from "../components/Complaint/ComplaintList";
import ViewSingleComplaint from "../components/Complaint/ViewSingleComplaint";
import Shop from "../pages/Product/Shop";
import CreateProductPage from "../pages/Product/CreateProductPage";
import AddNewUser from "../pages/Admin/AddNewUser";
import ViewCategories from "../pages/Admin/ViewCategories";
import AllItineraries from "../pages/Admin/AllItineraries";
import UpdateProductPage from "../pages/Product/UpdateProductPage";
import Inventory from "../pages/Seller/Inventory";
import AdminProfilePage from "../pages/Admin/AdminProfilePage";
import Analytics from "../pages/Analytics/Analytics";
import EditProductPage from "../pages/Product/EditProduct";
import AdminPromoCode from "../pages/Admin/AdminPromoCode";

const adminRoutes = [
    { path: "/admin", element: <Analytics /> },
    {
        path: "/admin/profile",
        element: <AdminProfilePage />,
    },
    {
        path: "/admin/promocode",
        element: <AdminPromoCode />,
    },
    { path: "/admin/tags", element: <ViewTags /> },
    { path: "/admin/categories", element: <ViewCategories /> },
    { path: "/admin/itineraries", element: <AllItineraries /> },
    { path: "/admin/activities", element: <AllActivities /> },
    { path: "/admin/complaints", element: <ComplaintList /> },
    {
        path: "/admin/complaint/:complaintId",
        element: <ViewSingleComplaint />,
    },
    { path: "/admin/inventory", element: <Inventory /> },
    { path: "/admin/shop/update-product/:productId", element: <UpdateProductPage /> },
    { path: "/admin/create-product", element: <CreateProductPage /> },
    { path: "/admin/edit-product/:productId", element: <EditProductPage /> },
    { path: "/admin/users", element: <UserManagement /> },

    {
        path: "admin/users/pending",
        element: <UserManagement isAll={false} />,
    },
    { path: "/admin/users/new", element: <AddNewUser /> },
    // { path: "/admin/analytics", element: <Analytics /> },
];

export default adminRoutes;
