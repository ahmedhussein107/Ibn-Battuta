// MapComponent.js
import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
    width: "50%",
    height: "300px",
    margin: "auto",
};

const center = {
    lat: 30.0444, // Default latitude (Cairo for example)
    lng: 31.2357, // Default longitude
};

const MapComponent = ({ apiKey, markerPosition, onMapClick }) => {
    return (
        <LoadScript googleMapsApiKey={apiKey}>
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
        </LoadScript>
    );
};

export default MapComponent;
