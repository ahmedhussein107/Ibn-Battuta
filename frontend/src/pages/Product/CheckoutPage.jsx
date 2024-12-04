import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import axiosInstance from "../../api/axiosInstance";
import bookingsBackground from "../../assets/backgrounds/checkoutbg.png";
import Button from "../../components/Button";
import { useCurrencyConverter } from "../../hooks/currencyHooks";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import Cookies from "js-cookie";
import { useFunctionContext } from "../../contexts/FunctionContext";
import { useLocation } from "react-router-dom";

const Checkout = () => {
    const [tourist, setTourist] = useState(null);
    const [pointsToRedeem, setPointsToRedeem] = useState(0);
    const [redeemValue, setRedeemValue] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [isWalletUsed, setIsWalletUsed] = useState(false);

    const [formData, setFormData] = useState({
        mobile: "",
        address: [],
        selectedAddress: "",
    });
    const location = useLocation();

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
                    selectedAddress:
                        response.data.address.length > 0
                            ? response.data.address[0].name
                            : "Please Add Your address",
                });
            })
            .catch((error) => {
                console.error("Error fetching tourist:", error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "address") {
            // Always wrap the address input in an array
            setFormData((prev) => ({
                ...prev,
                address: [value], // Ensure it's a single-element array
            }));
        } else {
            // Handle other fields
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectAddress = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            selectedAddress: event.target.value,
        }));
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

    // const handleNext = async () => {
    //     const response = await axiosInstance.post(
    //         "/booking/createBooking",
    //         { typeId: "672faf9887fad62d0420dbc4", bookingType: "Activity", count: 1 },
    //         { withCredentials: true }
    //     );
    //     const bookingId = response.data._id;
    //     const handleSuccess = async () => {
    //         await axiosInstance.patch(`/booking/completeBooking/${bookingId}`, {
    //             isWalletUsed: false,
    //         });
    //         navigate("/bookings", { state: { tab: "Activities" } });
    //     };
    //     const handleFailure = async () => {
    //         await axiosInstance.delete(`booking/deleteBooking/${bookingId}`);
    //     };
    //     const amount = 1000;
    //     setSuccess(handleSuccess);
    //     setFailure(handleFailure);
    //     navigate("/payment", {
    //         state: {
    //             amount,
    //             currency,
    //             headerImage: bookingsBackground,
    //         },
    //     });
    // };

    const handleNext = async () => {
        try {
            const response = await axiosInstance.post(
                "/order/createOrder",
                { method: paymentMethod, address: formData.selectedAddress },
                {
                    withCredentials: true,
                }
            );
            const order = response.data.order;

            const handleFailure = async () => {
                await axiosInstance.delete(`order/deleteOrder/${order._id}`);
            };

            const handleSuccess = async () => {
                await axiosInstance.patch(`/order/completeOrder/${order._id}`, {
                    isWalletUsed: isWalletUsed,
                });
                navigate("/bookings");
            };

            if (paymentMethod === "card") {
                setFailure(handleFailure);
                setSuccess(handleSuccess);
                const amount = Number(order.totalPrice);
                navigate("/payment", {
                    state: {
                        amount,
                        currency,
                        headerImage: bookingsBackground,
                    },
                });
            } else {
                await handleSuccess();
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handlePaymentMethodChange = (event) => {
        console.log(event.target.value);
        setPaymentMethod(event.target.value);
    };

    const handleUseWallet = (event) => {
        setIsWalletUsed(event.target.checked);
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
                {/* the first part of the page */}
                <div>
                    <h2
                        style={{
                            color: "#9c4f21",
                            marginLeft: "2vw",
                            marginTop: "1vh",
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
                {/* the title and the horizontal line for the first part of the page */}

                <div
                    style={{
                        display: "flex",
                        direction: "row",
                        justifyContent: "space-between",
                        padding: "1% 0",
                        marginBottom: "2vh",
                    }}
                >
                    {/* Right componentthe first part of the form with the contact details and the delivery address */}
                    <div>
                        <div
                            style={{
                                fontFamily: "Inder",
                                marginLeft: "2vw",
                            }}
                        >
                            <p> Contact Mobile Number:</p>
                            <Box
                                component="form"
                                sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
                                noValidate
                                autoComplete="off"
                                required
                            >
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Mobile Number"
                                    name="mobile"
                                    value={formData.mobile}
                                    onBlur={handleSubmit}
                                    onChange={handleChange}
                                    style={{
                                        width: "20vw",
                                        height: "4vh",
                                        marginTop: "1vh",
                                    }}
                                />
                            </Box>
                        </div>
                        <div
                            style={{
                                fontFamily: "Inder",
                                marginLeft: "2vw",
                                marginTop: "2vh",
                            }}
                        >
                            <p> Delivery Address*:</p>
                            <select
                                name="address"
                                value={formData.selectedAddress}
                                onChange={handleSelectAddress}
                                style={{
                                    width: "20vw", // Adjust width as needed
                                    height: "6vh", // Set a specified height for consistency
                                    marginTop: "1vh", // Space above the select
                                    padding: "10px", // Padding for the select
                                    border: "1px solid #ccc", // Border styling
                                    borderRadius: "4px", // Rounded corners
                                    boxSizing: "border-box", // Include padding/border in width/height
                                    display: "block", // Make sure it's a block element
                                    marginLeft: "0.5vw",
                                }}
                            >
                                {formData.address.map((address, index) => (
                                    <option key={index} value={address.name}>
                                        {address.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                direction: "row",
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: "Inder",
                                    marginLeft: "2vw",
                                    marginTop: "2vh",
                                    color: "#9c4f21",
                                    fontSize: "30px",
                                }}
                            >
                                Payment Method:
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginLeft: "1vw",
                                    marginTop: "2vh",
                                }}
                            >
                                <label style={{ marginRight: "20px" }}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cash on delivery"
                                        checked={paymentMethod === "cash on delivery"}
                                        onChange={handlePaymentMethodChange}
                                        style={{
                                            marginRight: "5px",
                                            accentColor: "#9c4f21",
                                        }}
                                    />
                                    Cash On Delivery
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={paymentMethod === "card"}
                                        onChange={handlePaymentMethodChange}
                                        style={{
                                            marginRight: "5px",
                                            accentColor: "#9c4f21",
                                        }}
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
                                checked={isWalletUsed}
                                onChange={handleUseWallet}
                            />
                        </div>
                    </div>
                    <Button stylingMode="2" text="Next" handleClick={handleNext} />
                    {/* Left componentthe first part of the form with the promocode and payment details */}
                    <div></div>
                </div>
                <Footer />
            </div>
        </div>

        /* <div>
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
                            name="address"
                            value={formData.selectedAddress}
                            onChange={handleSelectAddress}
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
                                value="cash on delivery"
                                checked={paymentMethod === "cash on delivery"}
                                onChange={handlePaymentMethodChange}
                                style={{ marginRight: "5px", accentColor: "#9c4f21" }}
                            />
                            Cash On Delivery
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="card"
                                checked={paymentMethod === "card"}
                                onChange={handlePaymentMethodChange}
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
                        checked={isWalletUsed}
                        onChange={handleUseWallet}
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
                                10K Points → {formatPrice(100)}
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
        </div>*/
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
