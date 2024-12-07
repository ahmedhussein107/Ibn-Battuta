import Signin from "../pages/Signin/Signin";
import SignUpPage from "../pages/Signup/SignUpPage";
import SelectYourRole from "../pages/Signup/SelectYourRole";

const authRoutes = [
    { path: "/signin", element: <Signin /> },
    { path: "/signup", element: <SignUpPage /> },
    { path: "/select-your-role", element: <SelectYourRole /> },
];
export default authRoutes;
