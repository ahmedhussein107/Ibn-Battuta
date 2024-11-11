import React, { useState, useEffect } from "react";
import LocationIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import TagsIcon from "@mui/icons-material/LocalOffer";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DateIcon from "@mui/icons-material/Today";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import convert from "../api/convert";
import Cookies from "js-cookie";
const InventoryCard = ({ product, handleDelete }) => {
    const title = product.name;
    const date = new Date(product.createdAt).toLocaleDateString();
    const description = product.description;
    const originalPrice = product.price;
    const rating = 3;
    const ratingCount = product.ratings.length;
    const isArchieved = product.isArchived;
    const stock = product.quantity;
    const sales = product.numberOfSales;
    const [isHovered, setIsHovered] = useState(false);
    const [isDeleteHovered, setIsDeleteHovered] = useState(false);
    const [isArchievedHovered, setisArchievedHovered] = useState(false);

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
        stock: {
            position: "absolute",
            top: "18vh",
            left: "0",
            right: "6vh",
            color: "#a67c00",
            fontSize: "1.4vh",
            textAlign: "right",
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
            backgroundColor: isArchievedHovered
                ? isArchieved
                    ? "#ffe6e6"
                    : "#d6e6e6"
                : "transparent",
            color: isArchieved ? "red" : "green",
            border: isArchieved ? ".15vh solid red" : ".15vh solid green",
            padding: "0.8vh .7vw",
            borderRadius: "2vh",
            cursor: "pointer",
            fontWeight: "bold",
            width: "5.8vw",
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
            borderRadius: "2vh",
            backgroundColor: isDeleteHovered ? "#ffe6e6" : "transparent", // Background on hover
            transition: "background-color 0.25s",
        },
    };

    return (
        <div style={styles.card}>
            <img src={product.picture} alt="itinerary" style={styles.cardImage} />

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
                        <ProductionQuantityLimitsIcon style={{ fontSize: "1.2em" }} />
                        <span>{sales} products sold</span>
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
                <div style={styles.stock}>{stock} in stock</div>

                <div style={styles.price}>
                    <span style={{ fontWeight: "bold" }}>
                        {Cookies.get("currency") || "EGP"} {convert(originalPrice)}
                    </span>
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
                    onMouseEnter={() => setisArchievedHovered(true)}
                    onMouseLeave={() => setisArchievedHovered(false)}
                >
                    {isArchieved ? "Unarchive" : "Archive"}
                </button>
            </div>
        </div>
    );
};

export default InventoryCard;
