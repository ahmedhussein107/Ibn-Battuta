import React, { useState } from "react";
import LocationIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import TagsIcon from "@mui/icons-material/LocalOffer";
import Button from "./Button";
import GenericCard from "./GenericCard";
import TitleAndButtons from "./TitleAndButtons";
import {Avatar, Rating} from "@mui/material";
import Cookies from "js-cookie";
import { CircularProgress } from "@mui/material";
import { useCurrencyConverter } from "../hooks/currencyHooks";
import {useNavigate} from "react-router-dom";

const CardItinerary = ({
    itinerary,
    width,
    height,
    firstLineButtons = [],
    bottomButtons = [],
    isEditable = false
}) => {
    const image = itinerary.picture;
    const Line1 = () => (
        <div style={{ fontSize: "1.2rem" }}>
            <TitleAndButtons title={itinerary.name} buttons={firstLineButtons} />
        </div>
    );
    const Line2 = () => (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                gap: "3vw",
                fontSize: "0.9rem",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5vw" }}>
                <LocationIcon style={{ fontSize: "0.8rem" }} />
                <span>{itinerary.location}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5vw" }}>
                <LanguageIcon style={{ fontSize: "0.8rem" }} />
                <span>{itinerary.language}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5vw" }}>
                <TagsIcon style={{ fontSize: "0.8rem" }} />
                <span>{itinerary.tags.join(", ")}</span>
            </div>
        </div>
    );

    const tourGuideName = itinerary.tourguideID.name;
    const tourGuidePic = itinerary.tourguideID.picture;
    const navigate = useNavigate();



    const Line3 = () => {
        const containerStyle = {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "1%",
            gap: "1rem",
            fontSize: "0.8em",
        };

        const clickableStyle = {
            cursor: "pointer",
            transition: "transform 0.2s ease, opacity 0.2s ease",
            ':hover': {
                transform: 'scale(1.05)',
                opacity: 0.8,
            }
        };

        const nameHoverStyle = {
            ...clickableStyle,
            color: 'inherit',
            ':hover': {
                ...clickableStyle[':hover'],
                color: 'blue',
            }
        };

        const onTourGuideClick = () => {
            navigate(`/tourguide/profile/${itinerary.tourguideID.username}`);
        };

        return (
            <div style={containerStyle}>
                <Avatar
                    alt={tourGuideName}
                    src={tourGuidePic}
                    sx={{
                        width: "1.4em",
                        height: "1.4em",
                        ...clickableStyle
                    }}
                    onClick={onTourGuideClick}
                />
                <p
                    style={{
                        cursor: 'pointer',
                        color: 'black',
                        transition: 'color 0.3s ease',
                        ':hover': {
                            color: 'blue'
                        }
                    }}
                    onClick={onTourGuideClick}
                    onMouseEnter={(e) => e.target.style.color = 'blue'}
                    onMouseLeave={(e) => e.target.style.color = 'black'}
                >
                    {tourGuideName}
                </p>
            </div>
        );
    };


    const description = (
        <p style={{width: "100%", height: "60%", fontSize: "1rem", overflow: "hidden"}}>
            {itinerary.description}
        </p>
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
                !itinerary.isFlagged ? (
                    <p style={{ color: "green", marginTop: "0%" }}>Booking Available</p>
                ) : (
                    <p style={{ color: "red", marginTop: "0%" }}>Flagged By Admin</p>
                )
            ) : (
                <p style={{ color: "red", marginTop: "0%" }}>Booking not Available</p>
            )}
        </div>
    );
    const currency = Cookies.get("currency") || "EGP";
    const { isLoading, formatPrice } = useCurrencyConverter(currency);
    if (isLoading) {
        return <CircularProgress />;
    }
    const price = (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                fontWeight: "bold",
            }}
        >
            <p style={{ marginLeft: "5%" }}>{formatPrice(itinerary.price)}</p>
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
                    customStyle={{ ...styles, alignSelf: "center", fontSize: ".9em" }}
                    height="4vh"
                />
            ))}
        </div>
    );

    const aboveLine = (
        <div style={{ display: "flex", flexDirection: "column" }}>
                <Line1 />
                <Line2 />
                {!isEditable && <Line3 />}
        </div>
    );

    const card = (
        <GenericCard
            image={image}
            aboveLine={aboveLine}
            bottomLeft={[description, accessibility, ratings]}
            bottomRight={[bookingAvaliable, price, buttons]}
            width={width}
            height={height}
        />
    );
    return card;
};

export default CardItinerary;
