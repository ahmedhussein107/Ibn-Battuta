import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Ahmed from "./components/CreateCustomActivityPopup.jsx";
import TravelBuzz from "./pages/HomePage/TravelBuzz.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
