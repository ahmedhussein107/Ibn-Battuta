import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "38vh",
    margin: "auto",
};

const center = {
    lat: 30.0444, // Default latitude (Cairo)
    lng: 31.2357, // Default longitude
};

const MapComponent = ({ markerPosition, onMapClick }) => {
    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={markerPosition || center}
            zoom={10}
            onClick={(event) =>
                onMapClick({
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                })
            }
        >
            {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>
    );
};

export default MapComponent;
