import React, { useState } from "react";
import LocationIcon from "@mui/icons-material/LocationOn";
import DateIcon from "@mui/icons-material/Today";
import TagsIcon from "@mui/icons-material/LocalOffer";
import Button from "./Button";
import GenericCard from "./GenericCard";
import TitleAndButtons from "./TitleAndButtons";
import TruncatedText from "./TruncatedText";
import { Rating } from "@mui/material";
import LandmarkTimes from "./LandmarkTimes";

const iconSize = "0.85rem";

const CardLandmark = ({ landmark, width, height, firstLineButtons }) => {
    const image = landmark.pictures[0];
    const line1 = (
        <div style={{ fontSize: "1.3rem" }}>
            <TitleAndButtons title={landmark.name} buttons={firstLineButtons} />
        </div>
    );
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

    const openingHours = <LandmarkTimes />;

    const card = (
        <GenericCard
            image={image}
            aboveLine={[line1, line2]}
            bottomLeft={[description, ratings]}
            bottomRight={[
                bookingAvaliable,
                availableSeats,
                originalPrice,
                currentPrice,
                editButton,
            ]}
            width={width}
            height={height}
        />
    );
    return card;
};

export default CardLandmark;
