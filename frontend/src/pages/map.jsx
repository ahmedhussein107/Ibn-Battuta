// App.js
import React, { useState } from "react";
import MapComponent from "../components/MapComponent";

const map = ({ setMarkerPosition, defaultPosition, customStyles}) => {
    const [marker, setMarker] = useState(null);

    const handleMapClick = (position) => {
        setMarker(position);
        setMarkerPosition(position);
    };
    console.log(defaultPosition);
    return (
        <div>
            <MapComponent
                apiKey="AIzaSyC_zN08IM5_NV1yi_gVMJfmLigewujCn8w"
                markerPosition={defaultPosition || marker}
                onMapClick={handleMapClick}
                customStyles={customStyles}
            />
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
