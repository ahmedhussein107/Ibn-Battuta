import React from "react";
import usePageHeader from "../../components/Header/UseHeaderPage";
import backgroundImage from "../../assets/images/flightsBackgroundImage.png";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import TripDetails from "../../components/Flights/TripDetails";
import FlightJourney from "../../components/Flights/FlightJourney";

const FlightDetails = () => {
    usePageHeader(null, null);

    const airlines = {
        PR: "Philippine Airlines",
        LX: "Swiss International Air Lines",
        // Add more carrier codes and names as needed
    };

    const flightData = {
        type: "flight-offer",
        id: "30",
        source: "GDS",
        instantTicketingRequired: false,
        nonHomogeneous: false,
        oneWay: false,
        isUpsellOffer: false,
        lastTicketingDate: "2024-11-13",
        lastTicketingDateTime: "2024-11-13",
        numberOfBookableSeats: 9,
        itineraries: [
            {
                duration: "PT40H",
                segments: [
                    {
                        departure: {
                            iataCode: "CAI",
                            terminal: "3",
                            at: "2024-11-30T18:25:00",
                        },
                        arrival: {
                            iataCode: "ZRH",
                            at: "2024-11-30T21:35:00",
                        },
                        carrierCode: "LX",
                        number: "239",
                        aircraft: {
                            code: "321",
                        },
                        operating: {
                            carrierCode: "LX",
                        },
                        duration: "PT4H10M",
                        id: "1",
                        numberOfStops: 1,
                        blacklistedInEU: false,
                    },
                    {
                        departure: {
                            iataCode: "ZRH",
                            at: "2024-11-30T23:00:00",
                        },
                        arrival: {
                            iataCode: "ORD",
                            at: "2024-12-01T04:25:00",
                        },
                        carrierCode: "LX",
                        number: "189",
                        aircraft: {
                            code: "777",
                        },
                        operating: {
                            carrierCode: "LX",
                        },
                        duration: "PT10H25M",
                        id: "2",
                        numberOfStops: 1,
                        blacklistedInEU: false,
                    },
                ],
            },
            {
                duration: "PT30H50M",
                segments: [
                    {
                        departure: {
                            iataCode: "ORD",
                            at: "2024-12-19T13:00:00",
                        },
                        arrival: {
                            iataCode: "ZRH",
                            terminal: "2",
                            at: "2024-12-19T22:00:00",
                        },
                        carrierCode: "LX",
                        number: "189",
                        aircraft: {
                            code: "777",
                        },
                        operating: {
                            carrierCode: "LX",
                        },
                        duration: "PT9H0M",
                        id: "94",
                        numberOfStops: 1,
                        blacklistedInEU: false,
                    },
                    {
                        departure: {
                            iataCode: "ZRH",
                            at: "2024-12-20T00:30:00",
                        },
                        arrival: {
                            iataCode: "CAI",
                            terminal: "3",
                            at: "2024-12-20T03:10:00",
                        },
                        carrierCode: "LX",
                        number: "239",
                        aircraft: {
                            code: "321",
                        },
                        operating: {
                            carrierCode: "LX",
                        },
                        duration: "PT4H10M",
                        id: "95",
                        numberOfStops: 1,
                        blacklistedInEU: false,
                    },
                ],
            },
        ],
        price: {
            currency: "EGP",
            total: "34714.00",
            base: "6172.00",
            fees: [
                {
                    amount: "0.00",
                    type: "SUPPLIER",
                },
                {
                    amount: "0.00",
                    type: "TICKETING",
                },
            ],
            grandTotal: "34714.00",
            additionalServices: [
                {
                    amount: "10643.00",
                    type: "CHECKED_BAGS",
                },
            ],
        },
        pricingOptions: {
            fareType: ["PUBLISHED"],
            includedCheckedBagsOnly: true,
        },
        validatingAirlineCodes: ["LX"],
        travelerPricings: [
            {
                travelerId: "1",
                fareOption: "STANDARD",
                travelerType: "ADULT",
                price: {
                    currency: "EGP",
                    total: "34714.00",
                    base: "6172.00",
                },
                fareDetailsBySegment: [
                    {
                        segmentId: "1",
                        cabin: "ECONOMY",
                        fareBasis: "KNCEG",
                        brandedFare: "ECOSAVER",
                        brandedFareLabel: "ECONOMY SAVER",
                        class: "K",
                        includedCheckedBags: {
                            quantity: 1,
                        },
                        amenities: [
                            {
                                description: "EXTRA LEGROOM SEAT RESERVATION",
                                isChargeable: true,
                                amenityType: "PRE_RESERVED_SEAT",
                                amenityProvider: {
                                    name: "BrandedFare",
                                },
                            },
                        ],
                    },
                    {
                        segmentId: "2",
                        cabin: "ECONOMY",
                        fareBasis: "KNCEG",
                        brandedFare: "ECOSAVER",
                        brandedFareLabel: "ECONOMY SAVER",
                        class: "K",
                        includedCheckedBags: {
                            quantity: 1,
                        },
                        amenities: [
                            {
                                description: "EXTRA LEGROOM SEAT RESERVATION",
                                isChargeable: true,
                                amenityType: "PRE_RESERVED_SEAT",
                                amenityProvider: {
                                    name: "BrandedFare",
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    };

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

    return (
        <div style={{ width: "100vw", position: "absolute", top: "0", left: "0" }}>
            <div
                style={{
                    width: "100vw",
                    height: "30vh",
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            ></div>

            <div style={{ position: "fixed", top: 0, left: "9%" }}>
                <NavBar />
            </div>

            <div
                style={{
                    width: "50.5vw",
                    backgroundColor: "#E9E6DC",
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
                        backgroundColor: "#E9E6DC",
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
                    backgroundColor: "#E9E6DC",
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
                        Total Price: {flightData.price.total} {flightData.price.currency}
                    </span>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default FlightDetails;
