import React from "react";
import LocationIcon from "@mui/icons-material/LocationOn";
import TagsIcon from "@mui/icons-material/LocalOffer";
import GenericCard from "./GenericCard";
import TitleAndButtons from "./TitleAndButtons";
import TruncatedText from "./TruncatedText";
import LandmarkTimes from "./LandmarkTimes";
import convert from "../api/convert";
import Cookies from "js-cookie";
import { CircularProgress } from "@mui/material";
import { useCurrencyConverter } from "../hooks/currencyHooks";
const iconSize = "0.85rem";

const CardLandmark = ({ landmark, width, height, firstLineButtons = [] }) => {
    const image = landmark.pictures[0];
    const line1 = (
        <div style={{ fontSize: "1.3rem" }}>
            <TitleAndButtons title={landmark.name} buttons={firstLineButtons} />
        </div>
    );
    const currency = Cookies.get("currency") || "EGP";
    const { isLoading, formatPrice } = useCurrencyConverter(currency);
    if (isLoading) {
        return <CircularProgress />;
    }
    const line2 = (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                fontSize: "0.9rem",
                gap: "2vw",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5vw" }}>
                <LocationIcon style={{ fontSize: iconSize }} />
                <span>{landmark.location}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5vw" }}>
                <TagsIcon style={{ fontSize: iconSize }} />
                <span>{landmark.tags.join(", ")}</span>
            </div>
        </div>
    );

    const description = (
        <TruncatedText
            text={landmark.description || ""}
            width={"100%"}
            height={"80%"}
            fontSize={"2vh"}
        />
    );

    const openingHours = <LandmarkTimes times={landmark.openingHours} />;

    const ticketPrices = (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                fontSize: "1rem",
                fontWeight: "bold",
            }}
        >
            {Object.keys(landmark.ticketPrices).map((key) => (
                <div key={key}>
                    {key.toString().charAt(0).toUpperCase() + key.toString().slice(1)}:{" "}
                    {formatPrice(landmark.ticketPrices[key])}
                </div>
            ))}
        </div>
    );

    const card = (
        <GenericCard
            image={image}
            aboveLine={[line1, line2]}
            bottomLeft={[description, openingHours]}
            bottomRight={[ticketPrices]}
            width={width}
            height={height}
        />
    );
    return card;
};

export default CardLandmark;
