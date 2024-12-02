import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import bookingsBackground from "../../assets/backgrounds/image.png";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import { useCurrencyConverter } from "../../hooks/currencyHooks";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import Cookies from "js-cookie";
import { useFunctionContext } from "../../contexts/FunctionContext";

const Checkout = ({ listOfItems }) => {
    const [tourist, setTourist] = useState(null);
    const [pointsToRedeem, setPointsToRedeem] = useState(0);
    const [redeemValue, setRedeemValue] = useState(0);
    const [formData, setFormData] = useState({
        mobile: "",
        address: [],
    });

    const navigate = useNavigate();
    const { setSuccess, setFailure } = useFunctionContext();
    const currency = Cookies.get("currency") || "EGP";
    const { isLoading, formatPrice } = useCurrencyConverter(currency);

    useEffect(() => {
        axiosInstance
            .get("/tourist/tourist", { withCredentials: true })
            .then((response) => {
                setTourist(response.data);
                setFormData({
                    mobile: response.data.mobile || "",
                    address: response.data.address || [],
                });
            })
            .catch((error) => {
                console.error("Error fetching tourist:", error);
            });
    }, []);

    const handleChange = (event) => {
        // Update formData temporarily
        const updatedFormData = { ...formData, [event.target.name]: event.target.value };

        // Update the state and make the PUT request when leaving the field
        setFormData(updatedFormData);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        axiosInstance
            .put("/tourist/updateTourist", formData, {
                withCredentials: true,
            })
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error("Error updating tourist:", error);
            });
    };

    const handleRedeemPointsChange = (event) => {
        const points = Number(event.target.value);
        setPointsToRedeem(points);
        setRedeemValue(points * 0.01); // Example conversion
    };

    const handleRedeemPoints = () => {
        if (
            pointsToRedeem > 0 &&
            tourist &&
            tourist.loyalityPoints >= pointsToRedeem &&
            pointsToRedeem % 10000 === 0
        ) {
            axiosInstance
                .post(
                    "/tourist/redeemPoints",
                    { points: pointsToRedeem },
                    { withCredentials: true }
                )
                .then((response) => {
                    alert(response.data.message);
                    const updatedTourist = {
                        ...tourist,
                        loyalityPoints: tourist.loyalityPoints - pointsToRedeem,
                        wallet: tourist.wallet + redeemValue,
                    };
                    setTourist(updatedTourist);
                    setPointsToRedeem(0);
                    setRedeemValue(0);
                })
                .catch((error) => {
                    console.error("Error redeeming points:", error);
                    alert(
                        error.response?.data?.e ||
                            "An error occurred while redeeming points."
                    );
                });
        } else if (pointsToRedeem === 0) {
            alert("Please enter a valid amount of points to redeem.");
        } else if (tourist?.loyalityPoints < pointsToRedeem) {
            alert("Insufficient points for redemption.");
        } else if (pointsToRedeem % 10000 !== 0) {
            alert("Please enter a multiple of 10000.");
        } else {
            alert("Insufficient points for redemption or invalid input");
        }
    };

    const handleNext = async () => {
        const response = await axiosInstance.post(
            "/booking/createBooking",
            { typeId: "672faf9887fad62d0420dbc4", bookingType: "Activity", count: 1 },
            { withCredentials: true }
        );
        const bookingId = response.data._id;
        const handleSuccess = async () => {
            await axiosInstance.patch(`/booking/completeBooking/${bookingId}`, {
                isWalletUsed: false,
            });
            navigate("/bookings", { state: { tab: "Activities" } });
        };
        const handleFailure = async () => {
            await axiosInstance.delete(`booking/deleteBooking/${bookingId}`);
        };
        const amount = 1000;
        setSuccess(handleSuccess);
        setFailure(handleFailure);
        navigate("/payment", {
            state: {
                amount,
                currency,
                headerImage: bookingsBackground,
            },
        });
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <div>
            <div style={{ width: "100vw", position: "absolute", top: "0", left: "0" }}>
                <div style={backgroundStyle}>
                    <h1 style={headerStyle}>CheckOut</h1>
                </div>
                <div>
                    <h2
                        style={{
                            color: "#9c4f21",
                            marginLeft: "2vw",
                            marginTop: "2vh",
                            fontSize: "40px",
                        }}
                    >
                        Delivery and Payment
                    </h2>
                    <hr
                        style={{
                            width: "95%",
                            color: "#9c4f21",
                            margin: "1vh 1vh auto",
                            marginLeft: "2vw",
                        }}
                    />
                </div>
                <div style={{ fontFamily: "Inder", marginLeft: "2vw", marginTop: "1vh" }}>
                    <div>
                        Contact Mobile Number*:
                        <textarea
                            placeholder="Mobile Number"
                            name="mobile"
                            value={formData.mobile}
                            onBlur={handleSubmit}
                            onChange={handleChange}
                            style={{
                                width: "20vw",
                                height: "4vh",
                                marginTop: "1vh",
                                marginBottom: "1vh",
                                padding: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                display: "block",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>
                    <div>
                        Delivery Address*:
                        <select
                            style={{
                                width: "20vw", // Adjust width as needed
                                height: "4vh", // Set a specified height for consistency
                                marginTop: "1vh", // Space above the select
                                padding: "10px", // Padding for the select
                                border: "1px solid #ccc", // Border styling
                                borderRadius: "4px", // Rounded corners
                                boxSizing: "border-box", // Include padding/border in width/height
                                display: "block", // Make sure it's a block element
                            }}
                        >
                            <option value="" disabled selected>
                                Choose a delivery address
                            </option>
                            {/* Use map to populate the options dynamically */}
                            {formData.address.map((address, index) => (
                                <option key={index} value={address.name}>
                                    {address.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "2vh",
                        marginLeft: "2vw",
                    }}
                >
                    <div
                        style={{ color: "#9c4f21", fontSize: "30px", marginRight: "1vw" }}
                    >
                        Payment Method:
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                        <label style={{ marginRight: "20px" }}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cash"
                                style={{ marginRight: "5px", accentColor: "#9c4f21" }}
                            />
                            Cash
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="card"
                                style={{ marginRight: "5px", accentColor: "#9c4f21" }}
                            />
                            Card
                        </label>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "1vh",
                        marginLeft: "2vw",
                    }}
                >
                    Use Wallet Balance
                    <input
                        type="checkbox"
                        style={{
                            marginLeft: "10px",
                            accentColor: "#9c4f21",
                            height: "1.5vh",
                            width: "1.5vw",
                        }}
                    />
                </div>

                <div style={{ padding: "1% 0" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "1% 0",
                        }}
                    ></div>
                </div>

                <div
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        width: "30vw",
                        marginTop: "-6vh",
                        marginLeft: "2vw",
                        fontFamily: "Inder",
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>
                            <h3 style={{ marginLeft: "1.5vw", color: "#9c4f21" }}>
                                Wallet And Points Details
                            </h3>
                            <p style={{ marginLeft: "2vw" }}>
                                Balance: {formatPrice(tourist?.wallet || 0)}
                            </p>
                            <p style={{ marginLeft: "2vw" }}>
                                Points: {tourist?.loyalityPoints || 0}
                            </p>
                        </div>
                    </div>
                    <hr
                        style={{ marginTop: "0.5vh", width: "95%", marginLeft: "0.8vw" }}
                    />
                    <div
                        style={{
                            marginTop: "2vh",
                            marginLeft: "-5vw",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "column",
                                marginBottom: "1.5vh",
                            }}
                        >
                            <h3
                                style={{
                                    marginLeft: "-7.5vw",
                                    color: "#9c4f21",
                                    marginTop: "-1.5vh",
                                }}
                            >
                                Redeem Points
                            </h3>
                            <span style={{ marginLeft: "-4.5vw", padding: "0.5vh 0" }}>
                                10K Points → 100 EGP
                            </span>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    direction: "row",
                                    marginLeft: "7vw",
                                }}
                            >
                                <input
                                    type="number"
                                    placeholder="Points to redeem"
                                    value={pointsToRedeem}
                                    onChange={handleRedeemPointsChange}
                                    style={{
                                        width: "10vw",
                                        textAlign: "center",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                        //marginRight: "10px",
                                        // marginLeft: "2vw",
                                    }}
                                />
                                →
                                <input
                                    type="text"
                                    placeholder="Value"
                                    value={redeemValue.toFixed(2)}
                                    readOnly
                                    style={{
                                        width: "10vw",
                                        textAlign: "center",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                        //marginLeft: "10px",
                                    }}
                                />
                            </div>
                        </div>
                        <button
                            style={{
                                backgroundColor: "#9c4f21",
                                color: "white",
                                border: "none",
                                borderRadius: "20px",
                                marginTop: "3vh",
                                cursor: "pointer",
                            }}
                            onClick={handleRedeemPoints}
                        >
                            Redeem
                        </button>
                    </div>
                    <Button stylingMode="2" text="Next" handleClick={handleNext} />
                </div>
                <Footer />
            </div>
            {/* <div style={{ fontFamily: "Inder" }}>Promo Code</div> */}
        </div>
    );
};

const backgroundStyle = {
    width: "100vw",
    height: "30vh",
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bookingsBackground})`,
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

export default Checkout;
