import React from "react";
import TripDetails from "./TripDetails";
import FlightJourney from "./FlightJourney";

import { CircularProgress } from "@mui/material";
import { useCurrencyConverter } from "../../hooks/currencyHooks";
import Cookies from "js-cookie";

const FlightDetails = ({ flightData, airlines }) => {
    const countTravellers = (travelerPricings) => {
        let adults = 0;
        let child = 0;
        let ans = "";
        for (let i = 0; i < travelerPricings.length; i++) {
            if (travelerPricings[i].travelerType === "ADULT") {
                adults++;
            }
            if (travelerPricings[i].travelerType === "CHILD") {
                child++;
            }
        }
        if (adults > 1) ans += adults + " adults";
        else ans += adults + " adult";
        if (child > 1) {
            ans += ", " + child + " children";
        } else if (child === 1) {
            ans += ", " + child + " child";
        }
        return ans;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-UK", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };
    const formatDuration = (duration) => {
        let days = "";
        let hours = "";
        let minutes = "";
        let curr = "";
        for (let i = 0; i < duration.length; i++) {
            if (duration[i] === "D") {
                days = curr;
                curr = "";
            } else if (duration[i] === "H") {
                hours = curr;
                curr = "";
            } else if (duration[i] === "M") {
                minutes = curr;
                curr = "";
            } else if (duration[i] - "0" >= 0 && duration[i] - "0" <= 9) {
                curr += duration[i];
            }
        }
        if (!days) days = "0";
        if (!hours) hours = "0";
        if (minutes.length === 1) minutes = "0" + minutes;
        return parseInt(hours) + parseInt(days) * 24 + "h " + minutes;
    };

    const outboundItinerary = flightData.itineraries[0];
    const returnItinerary = flightData.itineraries[1] || null;

    const outboundDepartureDate = formatDate(outboundItinerary.segments[0].departure.at);
    const outboundArrivalDate = formatDate(
        outboundItinerary.segments[outboundItinerary.segments.length - 1].arrival.at
    );

    const returnDepartureDate = returnItinerary
        ? formatDate(returnItinerary.segments[0].departure.at)
        : null;
    const returnArrivalDate = returnItinerary
        ? formatDate(
              returnItinerary.segments[returnItinerary.segments.length - 1].arrival.at
          )
        : null;

    const currency = Cookies.get("currency") || "EGP";
    const { formatPrice, isLoading } = useCurrencyConverter(currency);

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <div>
            <div
                style={{
                    width: "50.5vw",
                    backgroundColor: "#F7F7F7",
                    margin: "3vh auto",
                    padding: "2vh",
                    borderRadius: "1vw",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    position: "relative",
                    zIndex: -1,
                    display: "flex",
                    alignItems: "flex-start",
                }}
            >
                <div style={{ flex: 1 }}>
                    <div style={{ position: "absolute", top: "1vh", left: "2vh" }}>
                        <span style={{ fontWeight: "bold", color: "#333" }}>
                            Outbound
                        </span>
                        <span
                            style={{
                                color: "#757575",
                                marginLeft: "0.2vw",
                                fontWeight: "normal",
                            }}
                        >
                            {outboundDepartureDate}
                        </span>
                    </div>

                    <div style={{ marginTop: "3vh" }}>
                        <TripDetails flight={outboundItinerary} airlines={airlines} />
                    </div>

                    <hr
                        style={{
                            border: "0",
                            height: "0.2vh",
                            backgroundColor: "#BFBBBB",
                            margin: "5vh 0",
                            width: "100%",
                        }}
                    />

                    <FlightJourney
                        flight={outboundItinerary}
                        airlineName={airlines[outboundItinerary.segments[0].carrierCode]}
                    />

                    <div style={{ position: "absolute", bottom: "1vh", left: "2vh" }}>
                        <span style={{ fontWeight: "bold", color: "#333" }}>Arrives</span>
                        <span
                            style={{
                                color: "#757575",
                                marginLeft: "0.2vw",
                                marginTop: "0.2vh",
                                fontWeight: "normal",
                            }}
                        >
                            {outboundArrivalDate}
                        </span>
                    </div>
                    <div style={{ position: "absolute", bottom: "1vh", left: "30vh" }}>
                        <span style={{ fontWeight: "bold", color: "#333" }}>
                            | Journey Duration
                        </span>
                        <span
                            style={{
                                color: "#757575",
                                marginLeft: "0.2vw",
                                marginTop: "0.2vh",
                                fontWeight: "normal",
                            }}
                        >
                            {formatDuration(outboundItinerary.duration)}
                        </span>
                    </div>
                </div>
            </div>

            {returnItinerary && (
                <div
                    style={{
                        width: "50.5vw",
                        backgroundColor: "#F7F7F7",
                        margin: "3vh auto",
                        padding: "2vh",
                        borderRadius: "1vw",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                        position: "relative",
                        zIndex: -1,
                        display: "flex",
                        alignItems: "flex-start",
                        marginTop: "6vh",
                    }}
                >
                    <div style={{ flex: 1 }}>
                        <div style={{ position: "absolute", top: "1vh", left: "2vh" }}>
                            <span style={{ fontWeight: "bold", color: "#333" }}>
                                Return
                            </span>
                            <span
                                style={{
                                    color: "#757575",
                                    marginLeft: "0.2vw",
                                    fontWeight: "normal",
                                }}
                            >
                                {returnDepartureDate}
                            </span>
                        </div>

                        <div style={{ marginTop: "3vh" }}>
                            <TripDetails flight={returnItinerary} airlines={airlines} />
                        </div>

                        <hr
                            style={{
                                border: "0",
                                height: "0.2vh",
                                backgroundColor: "#BFBBBB",
                                margin: "5vh 0",
                                width: "100%",
                            }}
                        />

                        <FlightJourney
                            flight={returnItinerary}
                            airlineName={
                                airlines[returnItinerary.segments[0].carrierCode]
                            }
                        />

                        <div style={{ position: "absolute", bottom: "1vh", left: "2vh" }}>
                            <span style={{ fontWeight: "bold", color: "#333" }}>
                                Arrives
                            </span>
                            <span
                                style={{
                                    color: "#757575",
                                    marginLeft: "0.2vw",
                                    marginTop: "0.2vh",
                                    fontWeight: "normal",
                                }}
                            >
                                {returnArrivalDate}
                            </span>
                        </div>
                        <div
                            style={{ position: "absolute", bottom: "1vh", left: "30vh" }}
                        >
                            <span style={{ fontWeight: "bold", color: "#333" }}>
                                | Journey Duration
                            </span>
                            <span
                                style={{
                                    color: "#757575",
                                    marginLeft: "0.2vw",
                                    marginTop: "0.2vh",
                                    fontWeight: "normal",
                                }}
                            >
                                {formatDuration(returnItinerary.duration)}
                            </span>
                        </div>
                    </div>
                </div>
            )}
            <div
                style={{
                    width: "50.5vw",
                    backgroundColor: "#F7F7F7",
                    margin: "3vh auto",
                    padding: "2vh",
                    borderRadius: "1vw",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    position: "relative",
                    zIndex: -1,
                    display: "flex",
                    justifyContent: "space-between", // Align to the right
                    alignItems: "center", // Vertically center the content
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <span
                        style={{
                            fontSize: "16px",
                            color: "#333",
                            fontWeight: "700",
                        }}
                    >
                        Travellers: {countTravellers(flightData.travelerPricings)}
                    </span>
                </div>
                <div style={{ textAlign: "center" }}>
                    <span
                        style={{
                            fontSize: "16px",
                            color: "#333",
                            fontWeight: "700",
                        }}
                    >
                        Total Price: {formatPrice(flightData.price.total)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default FlightDetails;
