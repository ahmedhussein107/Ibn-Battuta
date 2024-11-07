import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocationIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import TagsIcon from "@mui/icons-material/LocalOffer";
import Button from "./Button";
import GenericCard from "./GenericCard";
import TitleAndButtons from "./TitleAndButtons";
import TruncatedText from "./TruncatedText";
import { Rating } from "@mui/material";

const handleDelete = async (id) => {
    await axiosInstance.delete(`/itinerary/deleteItinerary/${id}`);
    window.location.reload();
};

const CardItinerary = ({ itinerary, width, height }) => {
    const [isDeleteHovered, setIsDeleteHovered] = useState(false);
    const image = itinerary.picture;
    const line1 = (
        <TitleAndButtons
            title={itinerary.name}
            buttons={[
                <DeleteOutlineIcon
                    style={{
                        padding: "0.8vw 1.6vh",
                        color: "red",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: "3.5vh",
                        borderRadius: "2vh",
                        backgroundColor: isDeleteHovered ? "#ffe6e6" : "transparent",
                        transition: "background-color 0.25s",
                    }}
                    onMouseEnter={() => setIsDeleteHovered(true)}
                    onMouseLeave={() => setIsDeleteHovered(false)}
                    onClick={() => handleDelete(itinerary._id)}
                />,
            ]}
        />
    );
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
    console.log("rating", rating);
    const ratings = (
        <div style={{ display: "flex", flexDirection: "row", marginTop: "-2%" }}>
            <Rating name="read-only" value={rating} readOnly />
            <p style={{ marginLeft: "5%", marginTop: "0%" }}>
                {itinerary.ratings.length}
            </p>
        </div>
    );
    const bookingAvaliable = (
        <div style={{ marginBottom: "0%", fontSize: "2.1vh" }}>
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
                marginTop: "-15%",
            }}
        >
            <p>USD</p>
            <p style={{ marginLeft: "5%" }}>{itinerary.price}</p>
        </div>
    );
    const editButton = (
        <Button
            stylingMode="1"
            text="Edit"
            width="70%"
            customStyle={{ marginTop: "-5%" }}
        />
    );
    const deactivateButton = (
        <Button
            stylingMode="2"
            text={itinerary.isActivated ? "Deactivate" : "Activate"}
            width="70%"
            customStyle={{
                marginTop: "2%",
                color: itinerary.isActivated ? "red" : "green",
                borderColor: itinerary.isActivated ? "red" : "green",
                ":hover": {
                    backgroundColor: itinerary.isActivated ? "red" : "green",
                },
            }}
        />
    );
    const card = (
        <GenericCard
            image={image}
            aboveLine={[line1, line2]}
            bottomLeft={[description, accessibility, ratings]}
            bottomRight={[bookingAvaliable, price, editButton, deactivateButton]}
            width={width}
            height={height}
        />
    );
    return card;
};

export default CardItinerary;
