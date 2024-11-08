import React, { useState, useEffect } from "react";
import LocationIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import TagsIcon from "@mui/icons-material/LocalOffer";
import DateIcon from "@mui/icons-material/Today";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
const ItineraryCard = ({ itinerary, handleDelete }) => {
    const title = itinerary.name;
    const location = itinerary.location;
    const language = itinerary.language;
    const tags = itinerary.tags.join(", ");
    const date = new Date(itinerary.startDate).toLocaleDateString();
    const description = itinerary.description;
    const isBookingAvailable = itinerary.isActivated;
    const originalPrice = itinerary.price;
    const rating = 3;
    const ratingCount = itinerary.ratings.length;
    const accessiblity = itinerary.accessibility.join(", ");
    const [isHovered, setIsHovered] = useState(false);
    const [isDeleteHovered, setIsDeleteHovered] = useState(false);
    const [isActivateHovered, setIsActivateHovered] = useState(false);

    const styles = {
        card: {
            position: "relative",
            width: "67vh",
            height: "30vh",
            backgroundColor: "#f0f0f0",
            borderRadius: "1vh",
            overflow: "hidden",
            boxShadow: "0 0.4vh 0.8vh rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "row",
            maxHeight: "40vh",
        },
        cardImage: {
            position: "absolute",
            left: "0",
            top: "0",
            width: "35%",
            height: "100%",
            objectFit: "cover",
        },
        cardContent: {
            position: "absolute",
            left: "36%",
            top: "0",
            width: "65%",
            height: "100%",
            padding: "1.6vh",
            color: "#333",
        },
        title: {
            position: "absolute",
            top: "-1vh",
            left: "0",
            fontSize: "2.5vh",
            fontWeight: "bold",
        },
        cardInfo: {
            position: "absolute",
            top: "5vh",
            left: "0",
            fontSize: "1.2vh",
            color: "#555",
            display: "flex",
            gap: "1.5vh",
            alignItems: "center",
        },
        infoItem: {
            display: "flex",
            alignItems: "center",
            gap: "0.5vh",
        },
        separator: {
            position: "absolute",
            top: "7vh",
            left: "0",
            width: "100%",
            borderTop: "0.1vh solid #ddd",
        },
        description: {
            position: "absolute",
            top: "9vh",
            left: "0",
            fontSize: "1.5vh",
            color: "#666",
            width: "100%",
        },
        accessiblity: {
            position: "absolute",
            top: "20vh",
            left: "0",
            fontSize: "1.3vh",
            color: "#666",
            width: "auto",
            whiteSpace: "normal", // Enable line wrapping
            wordBreak: "break-word",
            overflowWrap: "break-word",
        },
        rating: {
            position: "absolute",
            top: "26.5vh",
            left: "0",
            display: "flex",
            alignItems: "center",
            gap: "0.4vh",
            fontSize: "1.5vh",
        },
        availability: {
            position: "absolute",
            top: "20vh",
            left: "0",
            right: "5vh",
            color: isBookingAvailable ? "green" : "red",
            fontSize: "1.5vh",
            textAlign: "right",
        },
        price: {
            position: "absolute",
            top: "23vh",
            left: "0",
            right: "6vh",
            gap: "0.8vh",
            fontSize: "1.5vh",
            textAlign: "right",
        },
        editButton: {
            position: "absolute",
            top: "26vh",
            right: "4.5vh",
            backgroundColor: isHovered ? "#e55a00" : "#ff6200",
            color: "white",
            padding: "0.8vh 1.6vh",
            border: "none",
            borderRadius: "2vh",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.25s",
            outline: "none",
            width: "5.8vw",
        },
        activateButton: {
            position: "absolute",
            top: "26vh",
            right: "9vw",
            backgroundColor: isActivateHovered
                ? isBookingAvailable
                    ? "#ffe6e6"
                    : "#d6e6e6"
                : "transparent",
            color: isBookingAvailable ? "red" : "green",
            border: isBookingAvailable ? ".15vh solid red" : ".15vh solid green",
            padding: "0.8vh .7vw",
            borderRadius: "2vh",
            cursor: "pointer",
            fontWeight: "bold",
            width: "6.9vw",
            outline: "none",
        },

        deleteButton: {
            position: "absolute",
            top: "1vh",
            right: "5vh",
            padding: "0.8vh 1.6vh",
            color: "red",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "2.4vh",
            borderRadius: "4px", // Adds rounded corners for hover background
            backgroundColor: isDeleteHovered ? "#ffe6e6" : "transparent", // Background on hover
            transition: "background-color 0.25s",
        },
    };

    return (
        <div style={styles.card}>
            <img src={itinerary.picture} alt="itinerary" style={styles.cardImage} />

            <div style={styles.cardContent}>
                <div>
                    <h2 style={styles.title}>{title}</h2>
                    <DeleteOutlineIcon
                        style={styles.deleteButton}
                        onMouseEnter={() => setIsDeleteHovered(true)}
                        onMouseLeave={() => setIsDeleteHovered(false)}
                        onClick={handleDelete}
                    />
                </div>

                <div style={styles.cardInfo}>
                    <div style={styles.infoItem}>
                        <LocationIcon style={{ fontSize: "1.2em" }} />
                        <span>{location}</span>
                    </div>
                    <div style={styles.infoItem}>
                        <LanguageIcon style={{ fontSize: "1.2em" }} />
                        <span>{language}</span>
                    </div>
                    <div style={styles.infoItem}>
                        <TagsIcon style={{ fontSize: "1.2em" }} />
                        <span>{tags}</span>
                    </div>
                </div>

                <hr style={styles.separator} />

                <p style={styles.description}>{description}</p>
                <p style={styles.accessiblity}>Accessability : {accessiblity}</p>

                <div style={styles.rating}>
                    {Array.from({ length: rating }, (_, index) => (
                        <span key={index}>⭐</span>
                    ))}
                    <span>{ratingCount}</span>
                </div>

                <div style={styles.availability}>
                    {isBookingAvailable ? "Booking available" : "Booking unavailable"}
                </div>

                <div style={styles.price}>
                    <span style={{ fontWeight: "bold" }}>USD {originalPrice}</span>
                </div>

                <button
                    style={styles.editButton}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    Edit
                </button>
                <button
                    style={styles.activateButton}
                    onMouseEnter={() => setIsActivateHovered(true)}
                    onMouseLeave={() => setIsActivateHovered(false)}
                >
                    {isBookingAvailable ? "Deactivate" : "Activate"}
                </button>
            </div>
        </div>
    );
};

export default ItineraryCard;
