import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
const map_api_key = import.meta.env.VITE_MAP_API_KEY;

const containerStyle = {
    width: "100%",
    height: "38vh",
    margin: "auto",
};

const center = {
    lat: 30.0444, // Default latitude (Cairo for example)
    lng: 31.2357, // Default longitude
};

const MapComponent = ({ markerPosition, onMapClick, customStyles }) => {
    return (
        <GoogleMap
            mapContainerStyle={{ containerStyle, ...customStyles }}
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
