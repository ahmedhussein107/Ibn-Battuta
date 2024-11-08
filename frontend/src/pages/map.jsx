// App.js
import React, { useState } from "react";
import MapComponent from "../components/MapComponent";

const map = ({ setMarkerPosition }) => {
    const [marker, setMarker] = useState(null);

    const handleMapClick = (position) => {
        setMarker(position);
        setMarkerPosition(position);
    };

    return (
        <div>
            <h1>Select Location</h1>
            <MapComponent markerPosition={marker} onMapClick={handleMapClick} />
            {/* {markerPosition && (
                // <div>
                //     <h2>Selected Location</h2>
                //     <p>Latitude: {markerPosition.lat}</p>
                //     <p>Longitude: {markerPosition.lng}</p>
                // </div>
            )} */}
        </div>
    );
};

export default map;
