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
<<<<<<< HEAD
            <h1>Select Location</h1>
            <MapComponent markerPosition={marker} onMapClick={handleMapClick} />
=======
            <MapComponent
                apiKey="AIzaSyC_zN08IM5_NV1yi_gVMJfmLigewujCn8w"
                markerPosition={marker}
                onMapClick={handleMapClick}
            />
>>>>>>> f3392822da9d06fd319386be44c09cf62408ffaf
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
