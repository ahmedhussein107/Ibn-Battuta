// App.js
import React, { useState } from "react";
import MapComponent from "../components/MapComponent";
import { MapWrapper } from "../components/MapWrapper";
const map = ({ setMarkerPosition, defaultPosition,  customStyles}) => {
    const [marker, setMarker] = useState(null);

    const handleMapClick = (position) => {
        setMarker(position);
        setMarkerPosition(position);
    };
    console.log(defaultPosition);
    return (
        <div>
            <MapWrapper>
                <MapComponent markerPosition={marker || marker} onMapClick={handleMapClick} customStyles={customStyles} />
            </MapWrapper>
        </div>
    );
};

export default map;
