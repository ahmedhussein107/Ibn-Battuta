import { useState, useEffect } from "react";
import { Rating } from "@mui/material";
import PopUp from "./PopUpsGeneric/PopUp";
import axiosInstance from "../api/axiosInstance";

const OrderEntry = ({ orderID, product, count, ratingID, formatPrice, orderStatus }) => {
    const { name, pictures, price, description } = product;
    const [rating, setRating] = useState(ratingID ? ratingID.rating : 0);
    const [comment, setComment] = useState(ratingID ? ratingID.comment : "");
    const [isReadOnly, setIsReadOnly] = useState(!!ratingID);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open && !isReadOnly) {
            setRating(0);
            setComment("");
        }
    }, [open]);

    const handleSubmit = async (event, newValue) => {
        try {
            const response = await axiosInstance.post(
                `/rating/rateProduct/${product._id}`,
                { rating, comment },
                { withCredentials: true }
            );
            if (response.status === 201) {
                setIsReadOnly(true);
                console.log("Rating added successfully");
                const newOrder = await axiosInstance.patch(
                    `/order/addRating/${orderID}`,
                    {
                        productID: product._id,
                        ratingID: response.data._id,
                    }
                );
                if (newOrder.status === 200) {
                    console.log("Rating ID added to booking successfully");
                } else {
                    console.error("Failed to add rating ID to booking");
                }
            } else {
                console.error("Failed to add rating");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setOpen(false);
        }
    };

    return (
        <>
            <PopUp
                isOpen={open}
                setIsOpen={setOpen}
                headerText={`Rate Product`}
                handleSubmit={handleSubmit}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            width: "90%",
                            display: "flex",
                            justifyContent: "center",
                            paddingBottom: "4%",
                        }}
                    >
                        <Rating
                            name="rating"
                            value={rating}
                            readOnly={isReadOnly}
                            onChange={(event, newValue) => setRating(newValue)}
                            style={{ fontSize: "4rem" }}
                        />
                    </div>
                    <div style={{ width: "90%" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "0.5vh",
                                fontWeight: "bold",
                            }}
                        >
                            Add your comment
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Insert comment here..."
                            style={{
                                width: "100%",
                                padding: "1vh",
                                borderRadius: "1vh",
                                resize: "vertical",
                            }}
                        />
                    </div>
                </div>
            </PopUp>
            <div style={cartItemStyle}>
                <div
                    style={{
                        width: "95%",
                        height: "90%",
                        display: "flex",
                        gap: "3%",
                        justifyContent: "left",
                    }}
                >
                    <div style={{ display: "flex", width: "20%" }}>
                        <div style={{ width: "90%" }}>
                            <img src={pictures[0]} alt={name} style={itemImageStyle} />
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            //justifyContent: "space-between",
                            width: "80%",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5%",
                                    width: "30%",
                                }}
                            >
                                <h2 style={{ color: "#9C4F21" }}>{name}</h2>
                            </div>

                            <div style={{ marginRight: "2%" }}>
                                {orderStatus == "delivered" ? (
                                    <Rating
                                        name="rating"
                                        value={rating}
                                        onChange={(event, newValue) => {
                                            setRating(newValue);
                                            setOpen(true);
                                        }}
                                        readOnly={isReadOnly}
                                        style={{ fontSize: "2.5rem" }}
                                    />
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div
                                style={{
                                    width: "60%",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "3vh",
                                    marginTop: "1%",
                                }}
                            >
                                <div style={itemDetailsStyle}>
                                    <hr style={{ width: "100%", margin: "0 auto" }} />
                                    <p>{description}</p>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    //justifyContent: "space-between",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        //alignItems: "center",
                                        justifyContent: "center",
                                        marginTop: "20%",
                                        marginLeft: "-25%",
                                        gap: "2vh",
                                    }}
                                >
                                    <span>
                                        <span
                                            style={{
                                                fontSize: "1.2rem",
                                                fontWeight: "bold",
                                                color: "#9C4F21",
                                            }}
                                        >
                                            Quantity:{" "}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: "1.2rem",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {count}
                                        </span>
                                    </span>
                                    <span>
                                        <span
                                            style={{
                                                fontSize: "1.2rem",
                                                fontWeight: "bold",
                                                color: "#9C4F21",
                                            }}
                                        >
                                            Price:{" "}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: "1.2rem",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {formatPrice(price * count)}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        height: "2%",
                        width: "98%",
                        backgroundColor: "#D1D5DB", // colo
                        margin: "20px 0",
                        borderRadius: "1px",
                    }}
                ></div>
            </div>
        </>
    );
};

const cartItemStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "25vh",
    width: "100%",
};
const itemImageStyle = {
    borderRadius: "5%",
    objectFit: "cover",
    width: "100%",
    height: "100%",
};
const itemDetailsStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "space-between",
    gap: "3vh",
};

export default OrderEntry;
