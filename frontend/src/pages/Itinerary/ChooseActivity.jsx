import React, { useState } from "react";
import i1 from "../../assets/images/iti.png";
import i2 from "../../assets/images/i2.png";
import Footer from "../../components/Footer";
import TimeLine from "../../components/TimelineN";
import { useLocation } from "react-router-dom";
const ChooseActivity = () => {
    const location = useLocation();
    const {
        name,
        language,
        description,
        date,
        time,
        pickupLocationlatitude,
        pickupLocationlongitude,
        dropOffLocationlatitude,
        dropOffLocationlongitude,
        tags,
        accessibilityTypes,
        price,
    } = location.state;

    console.log(
        name,
        language,
        description,
        date,
        time,
        pickupLocationlatitude,
        pickupLocationlongitude,
        dropOffLocationlatitude,
        dropOffLocationlongitude,
        tags,
        accessibilityTypes,
        price
    );
    return (
        <div
            style={{
                position: "absolute",
                left: 0,
                top: 0,
                backgroundColor: "#fff5e6",
                minHeight: "115vh",
                width: "100vw",
            }}
        >
            <div>
                <img
                    src={i1}
                    style={{
                        width: "100vw",
                        height: "35vh",
                        pointerEvents: "none",
                        zIndex: -1,
                    }}
                />
                <img
                    src={i2}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "35vh",
                        pointerEvents: "none",
                        zIndex: 0,
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        top: "18vh",
                        left: "38vw",
                        fontSize: "3.2vh",
                        fontWeight: "bold",
                        color: "White",
                        pointerEvents: "none",
                    }}
                >
                    Create A New Itinerary
                </div>
            </div>
            <div style={{ marginLeft: "10vw" }}>
                <TimeLine />
            </div>
            <Footer />
        </div>
    );
};

export default ChooseActivity;
