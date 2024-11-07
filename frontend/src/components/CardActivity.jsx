import React, { useState } from "react";
import LocationIcon from "@mui/icons-material/LocationOn";
import DateIcon from "@mui/icons-material/Today";
import TagsIcon from "@mui/icons-material/LocalOffer";
import Button from "./Button";
import GenericCard from "./GenericCard";
import TitleAndButtons from "./TitleAndButtons";
import TruncatedText from "./TruncatedText";
import { Rating } from "@mui/material";

const iconSize = "1.5vh";

const CardActivity = ({ activity, width, height, firstLineButtons }) => {
    const image = activity.picture;
    const line1 = <TitleAndButtons title={activity.name} buttons={firstLineButtons} />;
    const line2 = (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                fontSize: "1.7vh",
                gap: "2vw",
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
        <TruncatedText
            text={activity.description}
            width={"100%"}
            height={"80%"}
            fontSize={"2vh"}
        />
    );
    const rating = Math.floor(activity.rating);
    console.log("rating", rating);
    const ratings = (
        <div style={{ display: "flex", flexDirection: "row", marginTop: "-2%" }}>
            <Rating name="read-only" value={rating} readOnly />
            <p style={{ marginLeft: "5%", marginTop: "0%" }}>{activity.ratings.length}</p>
        </div>
    );
    const bookingAvaliable = (
        <p
            style={{
                color: activity.isOpenForBooking ? "green" : "red",
                marginTop: "0%",
                fontSize: "1.6vh",
            }}
        >
            {activity.isOpenForBooking ? "Booking availabe" : "Booking not availabe"}
        </p>
    );
    const availableSeats = (
        <p
            style={{
                marginTop: "-4%",
                color: "brown",
                fontSize: "1.6vh",
            }}
        >
            {activity.freeSpots} Available seats
        </p>
    );

    const beforeDiscount = activity.price;
    const afterDiscount = activity.price * (1 - activity.specialDiscount / 100);

    const originalPrice = (
        <p
            style={{
                display: "flex",
                flexDirection: "row",
                fontWeight: "bold",
                color: "red",
                textDecoration: "line-through",
                // marginTop: "-10%",
                fontSize: "1.6vh",
            }}
        >
            USD {beforeDiscount}
        </p>
    );
    const currentPrice = (
        <p
            style={{
                display: "flex",
                flexDirection: "row",
                fontWeight: "bold",
                marginTop: "-5%",
                fontSize: "2vh",
            }}
        >
            USD {afterDiscount}
        </p>
    );
    const editButton = (
        <Button
            stylingMode="1"
            text="Edit"
            width="70%"
            // customStyle={{ marginTop: "-8%" }}
        />
    );

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

export default CardActivity;
