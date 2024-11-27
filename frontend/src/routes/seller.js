import CreateProductPage from "../pages/Product/CreateProductPage";
import UpdateProductPage from "../pages/Product/UpdateProductPage";
import Inventory from "../pages/Seller/Inventory";
const sellerRoutes = [
    { path: "/seller/inventory", element: <Inventory /> },

    { path: "/seller/create-product", element: <CreateProductPage /> },
    { path: "/seller/update-product/:productId", element: <UpdateProductPage /> },
];
export default sellerRoutes;
