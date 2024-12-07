import CreateProductPage from "../pages/Product/CreateProductPage";
import UpdateProductPage from "../pages/Product/UpdateProductPage";
import Inventory from "../pages/Seller/Inventory";
import SellerHome from "../pages/Seller/SellerHome";
import SellerProfilePage from "../pages/Seller/SellerProfilePage";
const sellerRoutes = [
    { path: "/seller", element: <SellerHome /> },

    {
        path: "/seller/profile",
        element: <SellerProfilePage />,
    },
    { path: "/seller/inventory", element: <Inventory /> },

    { path: "/seller/create-product", element: <CreateProductPage /> },
    { path: "/seller/update-product/:productId", element: <UpdateProductPage /> },
];
export default sellerRoutes;
