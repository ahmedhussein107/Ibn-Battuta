import Signin from "../pages/Signin/Signin";
import SignUpPage from "../pages/Signup/SignUpPage";
import SelectYourRole from "../pages/Signup/SelectYourRole";
import ForgotYourPassword from "../pages/Signin/ForgotYourPassword.jsx";

const authRoutes = [
    { path: "/signin", element: <Signin /> },
    { path: "/signup", element: <SignUpPage /> },
    { path: "/select-your-role", element: <SelectYourRole /> },
    { path: "/forgot-your-password", element: <ForgotYourPassword /> },
];
export default authRoutes;
