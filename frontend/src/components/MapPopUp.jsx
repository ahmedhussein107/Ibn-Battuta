import React, { useState } from "react";
import PopUp from "./PopUpsGeneric/PopUp";
import Map from "../pages/map";
import CustomButton from "./Button";

import reverseGeocode from "../api/map";

const MapPopUp = ({ popUpOpen, setPopUpOpen, mapFunction }) => {
    const [locationlongitude, setLocationlongitude] = useState(0);
    const [locationlatitude, setLocationlatitude] = useState(0);
    const handleSubmit = async () => {
        try {
            const locationString = await reverseGeocode(
                locationlatitude,
                locationlongitude
            );
            mapFunction({
                latitude: locationlatitude,
                longitude: locationlongitude,
                location: locationString === ", " ? "Unknown Location" : locationString,
            });
            setPopUpOpen(false);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <PopUp
            isOpen={popUpOpen}
            setIsOpen={setPopUpOpen}
            headerText={"please pin a location"}
            containsActionButton={false}
            containsFooter={false}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2vh",
                }}
            >
                <div
                    style={{
                        width: "90%",
                        height: "130%",
                        display: "flex",
                        marginLeft: "2.5vh",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "2vh",
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            padding: "2vh",
                            height: "50%",
                            borderRadius: "1vh",
                            border: "0.1vh solid #fff",
                            backgroundColor: "#FAF4F4",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                overflow: "hidden",
                                borderRadius: "1vh",
                            }}
                        >
                            <Map
                                style={{ width: "100%", height: "100%" }}
                                setMarkerPosition={(position) => {
                                    setLocationlongitude(position.lng);
                                    setLocationlatitude(position.lat);
                                }}
                            />
                        </div>
                    </div>
                    <CustomButton
                        stylingMode="always-dark"
                        text="Done"
                        handleClick={handleSubmit}
                    />
                </div>
            </div>
        </PopUp>
    );
};

export default MapPopUp;
