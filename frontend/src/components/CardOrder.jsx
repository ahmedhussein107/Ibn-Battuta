import React, { useEffect, useState } from "react";
import Button from "./Button";
import GenericCard from "./GenericCard";
import { Rating, Chip } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PopUp from "./PopUpsGeneric/PopUp";
import { styled } from "@mui/system";
import axiosInstance from "../api/axiosInstance";
import Cookies from "js-cookie";
import { CircularProgress } from "@mui/material";
import { useCurrencyConverter } from "../hooks/currencyHooks";

const StatusLabel = styled(Chip)(({ theme, status }) => ({
    backgroundColor:
        status === "canceled" ? "#f8d7da" : status === "pending" ? "#fff3cd" : "#d4edda",
    color:
        status === "canceled" ? "#d9534f" : status === "pending" ? "#856404" : "#155724",
    fontWeight: "bold",
    fontSize: "1rem",
    padding: "1%",
}));

const CardOrder = ({ order, width = "46vw", height = "26vh", fontSize = "1.5rem" }) => {
    const [rating, setRating] = useState(order.ratingID ? order.ratingID.rating : 0);
    const [orderStatus, setOrderStatus] = useState(order.status || "pending");
    const [comment, setComment] = useState(order.ratingID ? order.ratingID.comment : "");
    const [isReadOnly, setIsReadOnly] = useState(!!order.ratingID);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open && !isReadOnly) {
            setRating(0);
            setComment("");
        }
    }, [open]);
    const currency = Cookies.get("currency") || "EGP";
    const { isLoading, formatPrice } = useCurrencyConverter(currency);
    if (isLoading) {
        return <CircularProgress />;
    }
    const Picture = order.product.pictures[0] || "";
    const aboveLine = (
        <div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: "0.2rem",
                }}
            >
                <h2 style={{ fontSize: fontSize, margin: 0 }}>{order.product.name}</h2>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.8rem",
                        color: "#777",
                        marginRight: "1rem",
                    }}
                >
                    <CalendarTodayIcon sx={{ marginRight: "0.3rem", fontSize: "1em" }} />
                    {new Date(order.createdAt).toLocaleString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                    })}
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: "0.2rem",
                    paddingRight: "2%",
                }}
            >
                <p style={{ margin: 0 }}>Order ID: {order._id}</p>
                <StatusLabel label={orderStatus} status={orderStatus} />
            </div>
        </div>
    );

    const handleSubmit = async (event, newValue) => {
        try {
            const response = await axiosInstance.post(
                `/rating/rateProduct/${order.product._id}`,
                { rating, comment },
                { withCredentials: true }
            );
            if (response.status === 201) {
                setIsReadOnly(true);
                console.log("Rating added successfully");
                const newOrder = await axiosInstance.patch(
                    `/order/updateOrder/${order._id}`,
                    {
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

    const bottomLeft = (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.1em",
                justifyContent: "space-between",
            }}
        >
            <div>
                <div>Items: {order.count}</div>
                <div>Payment Method: {order.method || "cash on delivery"}</div>
                <div>Delivery Address: {order.address || "Maadi, Cairo, Egypt"}</div>
                <div>Total Price: {formatPrice(order.price)}</div>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <div style={{ width: "60%" }}>
                    {orderStatus == "delivered" ? (
                        <Rating
                            name="rating"
                            value={rating}
                            onChange={(event, newValue) => {
                                setRating(newValue);
                                setOpen(true);
                            }}
                            readOnly={isReadOnly}
                        />
                    ) : (
                        <></>
                    )}
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "40%",
                    }}
                >
                    {orderStatus == "pending" ? (
                        <Button
                            stylingMode="2"
                            width="50%"
                            text="cancel"
                            customStyle={{ padding: "0.8rem" }}
                            onClick={() => {}}
                        />
                    ) : (
                        <div></div>
                    )}
                    <Button
                        stylingMode="1"
                        width="50%"
                        text="view"
                        customStyle={{ padding: "0.8rem" }}
                        onClick={() => {}} // Add onClick
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div>
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
            <GenericCard
                image={Picture}
                aboveLine={aboveLine}
                bottomLeft={bottomLeft}
                bottomRight={<></>}
                width={width}
                height={height}
                upperHeight="30%"
                lowerHeight="68%"
                bottomLeftWidth="100%"
                bottomRightWidth="0%"
            />
        </div>
    );
};

export default CardOrder;
