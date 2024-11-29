import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "38vh",
    margin: "auto",
};

// Default center position
const centerr = {
    lat: 31.072116833659926, // Default latitude (Cairo for example)
    lng: 32.24977622243277, // Default longitude
};

// Default marker position (same as center for example)
const defaultMarkerPosition = {
    lat: 31.6, // Default latitude
    lng: 32.9, // Default longitude
};

const MapComponent = ({
    markerPosition = defaultMarkerPosition,
    onMapClick,
    customStyles,
}) => {
    const styles = customStyles ? { ...containerStyle, ...customStyles } : containerStyle;

    return (
        <GoogleMap
            mapContainerStyle={styles}
            center={centerr}
            zoom={7}
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
