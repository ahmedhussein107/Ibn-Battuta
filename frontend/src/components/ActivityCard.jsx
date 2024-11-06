import React, { act, useState } from "react";
import Kayaking from "../assets/images/kayaking.png";
import LocationIcon from "@mui/icons-material/LocationOn";
import CategoryIcon from "@mui/icons-material/LocalOffer";
import TagsIcon from "@mui/icons-material/LocalOffer";
import DateIcon from "@mui/icons-material/Today";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
const ActivityCard = ({ activity, handleDelete }) => {
    const title = activity.name;
    const location = activity.location;
    const category = activity.category;
    const tags = activity.tags.join(", ");
    const date = new Date(activity.startDate).toLocaleDateString();
    const description = activity.description;
    const isBookingAvailable = activity.isOpenForBooking;
    const availableSeats = activity.freeSpots;
    const originalPrice = activity.price;
    const discountedPrice =
        activity.price - (activity.price * activity.specialDiscount) / 100.0;
    const rating = 3;
    const ratingCount = activity.ratings.length;
    const [isHovered, setIsHovered] = useState(false);
    const [isDeleteHovered, setIsDeleteHovered] = useState(false);

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
        seats: {
            position: "absolute",
            top: "18vh",
            left: "0",
            right: "6vh",
            color: "#a67c00",
            fontSize: "1.2vh",
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
        originalPrice: {
            color: "#888",
            textDecoration: "line-through",
        },
        discountedPrice: {
            color: "#ff6200",
        },
        editButton: {
            position: "absolute",
            top: "26vh",
            right: "4vh",
            backgroundColor: isHovered ? "#e55a00" : "#ff6200",
            color: "white",
            padding: "0.8vh 1.6vh",
            border: "none",
            borderRadius: "2vh",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.25s",
            outline: "none",
            width: "10vh",
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
            <img src={activity.picture} alt="Kayaking" style={styles.cardImage} />

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
                        <CategoryIcon style={{ fontSize: "1.2em" }} />
                        <span>{category}</span>
                    </div>
                    <div style={styles.infoItem}>
                        <TagsIcon style={{ fontSize: "1.2em" }} />
                        <span>{tags}</span>
                    </div>
                    <div style={styles.infoItem}>
                        <DateIcon style={{ fontSize: "1.2em" }} />
                        <span>{date}</span>
                    </div>
                </div>

                <hr style={styles.separator} />

                <p style={styles.description}>{description}</p>

                <div style={styles.rating}>
                    {Array.from({ length: rating }, (_, index) => (
                        <span key={index}>⭐</span>
                    ))}
                    <span>{ratingCount}</span>
                </div>

                <div style={styles.availability}>
                    {isBookingAvailable ? "Booking available" : "Booking unavailable"}
                </div>

                <div style={styles.seats}>{availableSeats} Available Seats</div>

                <div style={styles.price}>
                    <span style={styles.originalPrice}>USD {originalPrice}</span>
                    <span style={styles.discountedPrice}>USD {discountedPrice}</span>
                </div>

                <button
                    style={styles.editButton}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    Edit
                </button>
            </div>
        </div>
    );
};

export default ActivityCard;
