import React, { useState } from "react";
import LocationIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import TagsIcon from "@mui/icons-material/LocalOffer";
import Button from "./Button";
import GenericCard from "./GenericCard";
import TitleAndButtons from "./TitleAndButtons";
import TruncatedText from "./TruncatedText";
import { Rating } from "@mui/material";

const CardItinerary = ({ itinerary, width, height, firstLineButtons, bottomButtons }) => {
    const image = itinerary.picture;
    const line1 = <TitleAndButtons title={itinerary.name} buttons={firstLineButtons} />;
    const line2 = (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                gap: "3vw",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5vw" }}>
                <LocationIcon style={{ fontSize: "2vh" }} />
                <span>{itinerary.location}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5vw" }}>
                <LanguageIcon style={{ fontSize: "2vh" }} />
                <span>{itinerary.language}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5vw" }}>
                <TagsIcon style={{ fontSize: "2vh" }} />
                <span>{itinerary.tags.join(", ")}</span>
            </div>
        </div>
    );

    const description = (
        <TruncatedText
            text={itinerary.description}
            width={"100%"}
            height={"40%"}
            fontSize={"2vh"}
        />
    );
    const accessibility = (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                width: "90%",
                fontSize: "2vh",
            }}
        >
            <p>Accessibility: </p>
            <p
                style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    marginLeft: "1vw",
                }}
            >
                {itinerary.accessibility.join(", ")}
            </p>
        </div>
    );
    const rating = Math.floor(itinerary.rating);
    const ratings = (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <Rating name="read-only" value={rating} readOnly />
            <p style={{ marginLeft: "5%", marginTop: "0%" }}>
                {itinerary.ratings.length}
            </p>
        </div>
    );
    const bookingAvaliable = (
        <div style={{ marginBottom: "0%", fontSize: "2vh" }}>
            {itinerary.isActivated ? (
                <p style={{ color: "green", marginTop: "0%" }}>Booking Available</p>
            ) : (
                <p style={{ color: "red", marginTop: "0%" }}>Booking not Available</p>
            )}
        </div>
    );
    const price = (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                fontWeight: "bold",
            }}
        >
            <p>USD</p>
            <p style={{ marginLeft: "5%" }}>{itinerary.price}</p>
        </div>
    );

    const buttons = (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
            }}
        >
            {bottomButtons.map(({ text, type, width, onClick, styles }) => (
                <Button
                    text={text}
                    stylingMode={type}
                    width={width}
                    handleClick={onClick}
                    customStyle={styles}
                />
            ))}
        </div>
    );

    const card = (
        <GenericCard
            image={image}
            aboveLine={[line1, line2]}
            bottomLeft={[description, accessibility, ratings]}
            bottomRight={[bookingAvaliable, price, buttons]}
            width={width}
            height={height}
        />
    );
    return card;
};

export default CardItinerary;
