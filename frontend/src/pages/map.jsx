// App.js
import React, { useState } from "react";
import MapComponent from "../components/MapComponent";

const map = () => {
    const [markerPosition, setMarkerPosition] = useState(null);

    const handleMapClick = (position) => {
        setMarkerPosition(position);
    };

    return (
        <div>
            <h1>Select Location</h1>
            <MapComponent
                apiKey="AIzaSyC_zN08IM5_NV1yi_gVMJfmLigewujCn8w"
                markerPosition={markerPosition}
                onMapClick={handleMapClick}
            />
            {markerPosition && (
                <div>
                    <h2>Selected Location</h2>
                    <p>Latitude: {markerPosition.lat}</p>
                    <p>Longitude: {markerPosition.lng}</p>
                </div>
            )}
        </div>
    );
};

export default map;
