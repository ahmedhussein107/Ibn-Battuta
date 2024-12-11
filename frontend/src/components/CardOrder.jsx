import React, { useEffect, useState } from "react";
import Button from "./Button";
import GenericCard from "./GenericCard";
import { Rating, Chip } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import orderImage from "../assets/images/order.png";
import PopUp from "./PopUpsGeneric/PopUp";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
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
    const [rating, setRating] = useState(order?.ratingID ? order?.ratingID?.rating : 0);
    const orderStatus = order.status;
    const [comment, setComment] = useState(
        order?.ratingID ? order?.ratingID?.comment : ""
    );
    const [isReadOnly, setIsReadOnly] = useState(!!order?.ratingID);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();
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
    const Picture = order?.purchases[0]?.product?.pictures[0] || orderImage;
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
                {/* <h2 style={{ fontSize: fontSize, margin: 0 }}>{order.product.name}</h2> */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        width: "100%",
                        fontSize: "0.8rem",
                        color: "#777",
                        marginRight: "1rem",
                    }}
                >
                    <CalendarTodayIcon
                        sx={{
                            marginRight: "0.3rem",
                            marginTop: "0.2rem",
                            fontSize: "1em",
                        }}
                    />
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
            const response = await axiosInstance.delete(
                `/order/deleteOrder/${order._id}`
            );
            window.location.reload();
            console.log("Order cancelled");
            // setOrderStatus("canceled");
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
                <div>Items: {order.purchases.length}</div>
                <div>Payment Method: {order.method || "cash on delivery"}</div>
                <div>Delivery Address: {order.address || "Maadi, Cairo, Egypt"}</div>
                <div>Total Price: {formatPrice(order.totalPrice)}</div>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <div style={{ width: "50%" }}></div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "50%",
                    }}
                >
                    {orderStatus == "pending" ? (
                        <Button
                            stylingMode="dark-when-hovered"
                            width="40%"
                            text="Cancel"
                            customStyle={{ padding: "0.8rem" }}
                            handleClick={() => {
                                setOpen(true);
                            }} // Add onClick
                        />
                    ) : (
                        <div></div>
                    )}
                    <Button
                        stylingMode="always-dark"
                        width="40%"
                        text="View"
                        customStyle={{ padding: "0.8rem" }}
                        handleClick={() => {
                            navigate(`/tourist/order-details/${order._id}`);
                        }} // Add onClick
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
                headerText={`Are you sure you want to cancel order?`}
                handleSubmit={handleSubmit}
            ></PopUp>
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
