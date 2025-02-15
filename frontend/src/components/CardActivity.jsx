import React, { useState } from "react";
import LocationIcon from "@mui/icons-material/LocationOn";
import DateIcon from "@mui/icons-material/Today";
import TagsIcon from "@mui/icons-material/LocalOffer";
import Button from "./Button";
import GenericCard from "./GenericCard";
import TitleAndButtons from "./TitleAndButtons";
import { Rating } from "@mui/material";
import { useCurrencyConverter } from "../hooks/currencyHooks";
import Cookies from "js-cookie";
import { CircularProgress } from "@mui/material";
const CardActivity = ({
    activity,
    width,
    height,
    firstLineButtons = [],
    bottomButtons = [],
    iconSize = "0.85rem",
    fontSize = "0.9rem",
}) => {
    const image = activity.pictures[0];
    const line1 = (
        <div style={{ fontSize: "1.3rem" }}>
            <TitleAndButtons title={activity.name} buttons={firstLineButtons} />
        </div>
    );
    const line2 = (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                fontSize: fontSize,
                justifyContent: "space-around",
                marginLeft: "-5%",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5vw" }}>
                <LocationIcon style={{ fontSize: iconSize }} />
                <span>{activity.location}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5vw" }}>
                <TagsIcon style={{ fontSize: iconSize }} />
                <span>{activity.category}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5vw" }}>
                <TagsIcon style={{ fontSize: iconSize }} />
                <span>{activity.tags.join(", ")}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5vw" }}>
                <DateIcon style={{ fontSize: iconSize }} />
                <span>{new Date(activity.startDate).toLocaleDateString()}</span>
            </div>
        </div>
    );

    const description = (
        <p
            style={{
                fontSize: fontSize,
                width: "100%",
                height: "70%",
                overflow: "hidden", // TODO: add ... at the end
            }}
        >
            {activity.description}
        </p>
    );
    const rating = Math.floor(activity.rating);
    const ratings = (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <Rating name="read-only" value={rating} readOnly />
            <p style={{ marginLeft: "5%", marginTop: "0%" }}>{activity.ratings.length}</p>
        </div>
    );
    const bookingAvaliable = (
        <p
            style={{
                color:
                    activity.isOpenForBooking &&
                    activity.freeSpots > 0 &&
                    !activity.isFlagged
                        ? "green"
                        : "red",
                fontSize: "0.8rem",
            }}
        >
            {activity.isFlagged
                ? "Flagged by Admin"
                : activity.isOpenForBooking && activity.freeSpots > 0
                ? "Booking availabe"
                : "Booking not available"}
        </p>
    );
    const availableSeats = (
        <p
            style={{
                // marginTop: "-4%",
                color: "brown",
                fontSize: "0.8rem",
            }}
        >
            {activity.freeSpots} Available seats
        </p>
    );

    const beforeDiscount = activity.price;
    const afterDiscount = activity.price * (1 - activity.specialDiscount / 100);

    const currency = Cookies.get("currency") || "EGP";
    const { isLoading, formatPrice } = useCurrencyConverter(currency);

    const originalPrice = (
        <p
            style={{
                display: "flex",
                flexDirection: "row",
                fontWeight: "bold",
                color: "red",
                textDecoration: "line-through",
                fontSize: "0.9rem",
            }}
        >
            {formatPrice(beforeDiscount)}
        </p>
    );
    const currentPrice = (
        <p
            style={{
                display: "flex",
                flexDirection: "row",
                fontWeight: "bold",
                fontSize: "1.1rem",
            }}
        >
            {formatPrice(afterDiscount)}
        </p>
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

    if (isLoading) {
        return <CircularProgress />;
    }

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
                buttons,
            ]}
            width={width}
            height={height}
        />
    );
    return card;
};

export default CardActivity;
