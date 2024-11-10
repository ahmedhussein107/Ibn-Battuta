import React from "react";
import { useLoadScript } from "@react-google-maps/api";
export const MapWrapper = ({ children }) => {
    const rr = "AIzaSyC_zN08IM5_NV1yi_gVMJfmLigewujCn8w";
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
