import React, { useEffect, useState } from "react";

import LocationAdder from "../LocationAdder";
import MapPopUp from "../MapPopUp";

const Step2 = () => {
    const [pickupLocation, setPickupLocation] = useState({
        latitude: 0,
        longitude: 0,
        location: "",
    });

    const [dropOffLocation, setDropOffLocation] = useState({
        latitude: 0,
        longitude: 0,
        location: "",
    });

    const [isMapOpen, setIsMapOpen] = useState(false);
    const [mapFunction, setMapFunction] = useState(null);

    useEffect(() => {
        if (mapFunction) setIsMapOpen(true);
    }, [mapFunction]);

    return (
        <>
            {isMapOpen && (
                <MapPopUp
                    popUpOpen={isMapOpen}
                    setPopUpOpen={setIsMapOpen}
                    mapFunction={mapFunction}
                />
            )}

            <LocationAdder
                title="Pickup Location"
                styles={{ width: "25%" }}
                location={pickupLocation}
                setLocation={setPickupLocation}
                setMapFunction={setMapFunction}
            />

            <LocationAdder
                title="Drop off Location"
                styles={{ width: "25%" }}
                location={dropOffLocation}
                setLocation={setDropOffLocation}
                setMapFunction={setMapFunction}
            />
        </>
    );
};

export default Step2;
