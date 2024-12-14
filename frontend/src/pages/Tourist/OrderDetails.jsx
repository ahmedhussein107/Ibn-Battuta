import usePageHeader from "../../components/Header/UseHeaderPage";
import bookingsBackground from "../../assets/backgrounds/bookings_bg.png";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import OrderEntry from "../../components/OrderEntry";
import Cookies from "js-cookie";
import { useCurrencyConverter } from "../../hooks/currencyHooks";
import Button from "../../components/Button";
import { CircularProgress } from "@mui/material";

const OrderDetails = () => {
    const [order, setOrder] = useState(null);
    const { id } = useParams();
    const currency = Cookies.get("currency") || "EGP";
    const { isLoading, formatPrice } = useCurrencyConverter(currency);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axiosInstance.get(`/order/getOrder/${id}`);
                console.log("Order", response);
                setOrder(response.data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            }
        };

        fetchOrder();
    }, []);

    const getColour = (status) => {
        switch (status) {
            case "pending":
                return "#000000";
            case "canceled":
                return "#D41414";
            case "delivered":
                return "#1F9E3B";
            default:
                return "gray";
        }
    };

    const formatStatus = (status) => {
        switch (status) {
            case "pending":
                return "Pending";
            case "canceled":
                return "Cancelled";
            case "delivered":
                return "Delivered";
            default:
                return "Unknown";
        }
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ width: "100vw", top: "0", left: "0" }}>
                <div style={backgroundStyle}>
                    <h1 style={headerStyle}>Order Details</h1>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "2vh",
                    width: "100%",
                    marginTop: "2%",
                    marginBottom: "2%",
                }}
            >
                {order && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <div
                            style={{
                                width: "90%",
                                backgroundColor: "#FAE2B6",
                                height: "7vh",
                                borderRadius: "2vh 2vh 0 0",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    gap: "2vw",
                                    alignItems: "center",
                                    marginLeft: "2vw",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "1.5rem",
                                        fontWeight: "bold",
                                    }}
                                >
                                    <span>Order ID: </span>
                                    <span
                                        style={{
                                            color: "#9C4F21",
                                        }}
                                    >
                                        {order._id}
                                    </span>
                                </span>
                                <span
                                    style={{
                                        color: getColour(order.status),
                                        fontSize: "1.5rem",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {formatStatus(order.status)}
                                </span>
                            </div>
                            <p
                                style={{
                                    fontSize: "1.3rem",
                                    fontWeight: "bold",
                                    color: "#707070",
                                    marginRight: "2vw",
                                }}
                            >
                                {new Date(order.createdAt).toLocaleString("en-US", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                })}
                            </p>
                        </div>
                        <div
                            style={{
                                width: "90%",
                                height: "80%",
                                backgroundColor: "#FFFAFA",
                                borderRadius: "0 0 2vh 2vh",
                                paddingTop: "3vh",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                boxShadow: "0 2px 2px rgba(0, 0, 0, 0.1)", // Add shadow here
                                marginBottom: "3vh",
                            }}
                        >
                            {order.purchases.map((element, index) => (
                                <OrderEntry
                                    orderID={id}
                                    product={element.product}
                                    price={element.price}
                                    count={element.count}
                                    formatPrice={formatPrice}
                                    ratingID={element.ratingID}
                                    orderStatus={order.status}
                                />
                            ))}
                            <span
                                style={{
                                    display: "flex",
                                    width: "95%",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: "1%",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        //alignItems: "center",
                                        gap: "1vh",
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
                                            Items:{" "}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: "1.2rem",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {order.purchases.length}
                                        </span>{" "}
                                    </span>
                                    <span>
                                        <span
                                            style={{
                                                fontSize: "1.2rem",
                                                fontWeight: "bold",
                                                color: "#9C4F21",
                                            }}
                                        >
                                            Payment Method:{" "}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: "1.2rem",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {order.method}
                                        </span>{" "}
                                    </span>
                                    <span>
                                        <span
                                            style={{
                                                fontSize: "1.2rem",
                                                fontWeight: "bold",
                                                color: "#9C4F21",
                                            }}
                                        >
                                            Address:{" "}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: "1.2rem",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {order.address}
                                        </span>{" "}
                                    </span>
                                </div>
                                <span>
                                    <span
                                        style={{
                                            fontSize: "1.2rem",
                                            fontWeight: "bold",
                                            color: "#9C4F21",
                                        }}
                                    >
                                        Total Price:{" "}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "1.2rem",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {formatPrice(order.totalPrice)}
                                    </span>
                                </span>
                            </span>
                        </div>
                    </div>
                )}
                <Button
                    stylingMode="dark-when-hovered"
                    text="Back"
                    handleClick={() => {
                        navigate("/tourist/orders");
                    }}
                />
            </div>

            <Footer />
        </div>
    );
};
const backgroundStyle = {
    width: "100vw",
    height: "30vh",
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${bookingsBackground})`,
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    shadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

const headerStyle = {
    position: "relative",
    fontSize: "2rem",
    fontWeight: "bold",
    marginTop: "5%",
    color: "White",
};
export default OrderDetails;
