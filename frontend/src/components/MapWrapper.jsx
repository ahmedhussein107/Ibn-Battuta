import React from "react";
import { useLoadScript } from "@react-google-maps/api";
export const MapWrapper = ({ children }) => {
    const rr = import.meta.env.VITE_MAP_API_KEY;
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: rr,
    });

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading maps...</div>;
    }

    return <>{children}</>;
};
