import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import LandmarkTimes from "./components/LandmarkTimes.jsx";
import ItineraryTimeline from "./components/ItineraryTimline.jsx";
import CreateItineraryPage from "./pages/Itinerary/CreateItineraryPage.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <CreateItineraryPage />
    </StrictMode>
);
