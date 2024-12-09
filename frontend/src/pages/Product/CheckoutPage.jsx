import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import axiosInstance from "../../api/axiosInstance";
import checkoutBackground from "../../assets/backgrounds/checkoutbg.png";
import Button from "../../components/Button";
import { useCurrencyConverter } from "../../hooks/currencyHooks";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import Cookies from "js-cookie";
import { useFunctionContext } from "../../contexts/FunctionContext";
import { useLocation } from "react-router-dom";
import PopUp from "../../components/PopUpsGeneric/PopUp";

const Checkout = () => {
    const [tourist, setTourist] = useState(null);
    const [pointsToRedeem, setPointsToRedeem] = useState(0);
    const [redeemValue, setRedeemValue] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("cash on delivery");
    const [isWalletUsed, setIsWalletUsed] = useState(false);
    const [promoCode, setPromoCode] = useState("");
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [isCompletionPopUpOpen, setIsCompletionPopUpOpen] = useState(false);
    const [isAdressPopUpOpen, setIsAdressPopUpOpen] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: "info",
        message: "",
    });
    const [popupAlert, setPopupAlert] = useState({
        open: false,
        severity: "info",
        message: "",
    });

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
    const [promoCodeDiscount, setPromoCodeDiscount] = useState(0);

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
                            : "No Saved Address",
                });
            })
            .catch((error) => {
                console.error("Error fetching tourist:", error);
                showAlert(
                    "error",
                    "An error occurred while fetching your profile."
                );
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

    const showAlert = (severity, message) => {
        setAlert({ open: true, severity, message });
        setTimeout(() => {
            setAlert({ open: false, severity: "", message: "" }); // Close the alert after some time
        }, 8000); // Alert will close after 5 seconds
    };

    const showPopUpAlert = (severity, message) => {
        setPopupAlert({ open: true, severity, message });
        setTimeout(() => {
            setPopupAlert({ open: false, severity: "", message: "" }); // Close the alert after some time
        }, 8000); // Alert will close after 5 seconds
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
                showAlert("error", error.res);
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
                    showAlert("success", response.data.message);
                    const updatedTourist = {
                        ...tourist,
                        loyalityPoints: tourist.loyalityPoints - pointsToRedeem,
                        wallet: tourist.wallet + redeemValue,
                    };
                    setTourist(updatedTourist);
                    setPointsToRedeem(0);
                    setRedeemValue(0);
                    setIsPopUpOpen(false);
                })
                .catch((error) => {
                    console.error("Error redeeming points:", error);
                    showAlert(
                        "error",
                        error.response?.data?.e ||
                            "An error occurred while redeeming points."
                    );
                });
        } else if (pointsToRedeem === 0) {
            showPopUpAlert(
                "error",
                "Please enter a valid amount of points to redeem."
            );
        } else if (tourist?.loyalityPoints < pointsToRedeem) {
            showPopUpAlert("error", "Insufficient points for redemption.");
        } else if (pointsToRedeem % 10000 !== 0) {
            showPopUpAlert("error", "Please enter a multiple of 10000.");
        } else {
            showPopUpAlert(
                "error",
                "Insufficient points for redemption or invalid input"
            );
        }
    };

    const handleAddButton = () => {
        setIsPopUpOpen(true);
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
    //         navigate("/tourist/bookings", { state: { tab: "Activities" } });
    //     };
    //     const handleFailure = async () => {
    //         await axiosInstance.delete(`booking/deleteBooking/${bookingId}`);
    //     };
    //     const amount = 1000;
    //     setSuccess(handleSuccess);
    //     setFailure(handleFailure);
    //     navigate("/tourist/payment", {
    //         state: {
    //             amount,
    //             currency,
    //             headerImage: bookingsBackground,
    //         },
    //     });
    // };

    const handleNext = async () => {
        if (!formData.mobile.trim()) {
            showAlert(
                "error",
                "Please enter your mobile number before proceeding."
            );
            return; // Exit the function to prevent further execution
        }
        if (!formData.selectedAddress.trim()) {
            showAlert("error", "Please enter your address before proceeding.");
            return; // Exit the function to prevent further execution
        }
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
                if (promoCode != "") {
                    await axiosInstance.post(
                        "promocode/applyPromoCode",
                        {
                            promoCodeId: promoCode,
                            totalAmount: location.state.price,
                        },
                        { withCredentials: true }
                    );
                }
                await axiosInstance.patch(`/order/completeOrder/${order._id}`, {
                    isWalletUsed: isWalletUsed,
                    finalPrice: location.state.price - promoCodeDiscount,
                });

                if (
                    paymentMethod === "cash on delivery" ||
                    (paymentMethod === "card" &&
                        isWalletUsed === true &&
                        tourist.wallet >= location.state.price)
                ) {
                    setIsCompletionPopUpOpen(true);
                } else navigate("/tourist/orders");
            };

            if (paymentMethod === "card" && isWalletUsed === false) {
                setFailure(handleFailure);
                setSuccess(handleSuccess);
                const amount = Number(order.totalPrice);
                navigate("/tourist/payment", {
                    state: {
                        amount,
                        currency,
                        headerImage: checkoutBackground,
                    },
                });
            } else {
                await handleSuccess();
            }
        } catch (error) {
            showAlert("error", error.response.data.message);
            console.log(error);
        }
    };

    const handlePaymentMethodChange = (event) => {
        console.log(event.target.value);
        setPaymentMethod(event.target.value);
    };

    const handleUseWallet = (event) => {
        setIsWalletUsed(event.target.checked);
    };

    const handleBackButton = () => {
        navigate(-1);
    };

    const IOSSwitch = styled((props) => (
        <Switch
            focusVisibleClassName=".Mui-focusVisible"
            disableRipple
            {...props}
        />
    ))(({ theme }) => ({
        width: 42,
        height: 26,
        padding: 0,
        "& .MuiSwitch-switchBase": {
            padding: 0,
            margin: 2,
            transitionDuration: "300ms",
            "&.Mui-checked": {
                transform: "translateX(16px)",
                color: "#fff",
                "& + .MuiSwitch-track": {
                    backgroundColor: "#9c4f21",
                    opacity: 1,
                    border: 0,
                    ...(theme.palette.mode === "dark" && {
                        backgroundColor: "#9c4f21",
                    }),
                },
                "&.Mui-disabled + .MuiSwitch-track": {
                    opacity: 0.5,
                },
            },
            "&.Mui-focusVisible .MuiSwitch-thumb": {
                color: "#9c4f21",
                border: "6px solid #fff",
            },
            "&.Mui-disabled .MuiSwitch-thumb": {
                color: theme.palette.grey[100],
                ...(theme.palette.mode === "dark" && {
                    color: theme.palette.grey[600],
                }),
            },
            "&.Mui-disabled + .MuiSwitch-track": {
                opacity: 0.7,
                ...(theme.palette.mode === "dark" && {
                    opacity: 0.3,
                }),
            },
        },
        "& .MuiSwitch-thumb": {
            boxSizing: "border-box",
            width: 22,
            height: 22,
        },
        "& .MuiSwitch-track": {
            borderRadius: 26 / 2,
            backgroundColor: "#E9E9EA",
            opacity: 1,
            transition: theme.transitions.create(["background-color"], {
                duration: 500,
            }),
            ...(theme.palette.mode === "dark" && {
                backgroundColor: "#39393D",
            }),
        },
    }));

    const handleAddAddress = () => {
        setIsAdressPopUpOpen(true);
    };

    const handleCompleteOrder = () => {
        setIsCompletionPopUpOpen(false);
        navigate("/tourist/orders");
    };

    const handlePromoCodeChange = (event) => {
        setPromoCode(event.target.value); // Update the state with the input value
    };

    const handlePromoCode = async (event) => {
        // Get the value from the event
        console.log(promoCode);
        try {
            const response = await axiosInstance.post(
                "/promocode/validatePromoCode",
                { promoCodeId: promoCode }, // Pass the promoCodeId in the data object
                { withCredentials: true } // Set the configuration as the second argument
            );

            showAlert("success", response.data.message);

            setPromoCodeDiscount(
                location.state.price *
                    (response.data.promoCodeDetails.discount / 100)
            );
        } catch (error) {
            setPromoCodeDiscount(0);
            const backendErrorMessage =
                error.response?.data?.message ||
                error.message ||
                "An error occurred while validating promo code.";
            showAlert("error", backendErrorMessage);
            console.log(error.message);
        }
    };

    const handleClearPromoCode = () => {
        setPromoCode("");
        setPromoCodeDiscount(0);
    };

    // if (isLoading) {
    //     return <CircularProgress />;
    // }

    return (
        <div style={{ display: "flex", displaydirection: "column" }}>
            <div
                style={{
                    width: "100vw",
                    position: "absolute",
                    top: "0",
                    left: "0",
                }}
            >
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

                        //marginBottom: "1vh",
                    }}
                >
                    {/* Right component first part of the form with the contact details and the delivery address */}
                    <div style={{ marginLeft: "4vw" }}>
                        <div
                            style={{
                                marginLeft: "3vw",
                                marginBottom: "1vh",
                                color: "#9c4f21",
                                fontSize: "35px",
                            }}
                        >
                            Contact Details:
                        </div>
                        <div
                            style={{
                                marginLeft: "4vw",
                            }}
                        >
                            <p style={{ fontSize: "25px" }}>
                                {" "}
                                Contact Mobile Number:
                            </p>
                            <Box
                                component="form"
                                sx={{
                                    "& > :not(style)": { m: 1, width: "25ch" },
                                }}
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
                                        width: "25vw",
                                        height: "4vh",
                                        marginTop: "1vh",
                                        marginLeft: "1vw",
                                    }}
                                />
                            </Box>
                        </div>
                        <div
                            style={{
                                marginLeft: "4vw",
                                marginTop: "2vh",
                                fontSize: "25px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: "1vh",
                                    direction: "row",
                                }}
                            >
                                <p> Delivery Address:</p>
                            </div>
                            <select
                                name="address"
                                value={formData.selectedAddress || "addNew"} // Default to "addNew" if no address is selected
                                onClick={(e) => {
                                    console.log(
                                        "Selected value:",
                                        e.target.value
                                    );
                                    if (e.target.value === "addNew") {
                                        console.log("Opening popup...");
                                        setIsAdressPopUpOpen(true);
                                    }
                                }}
                                onChange={(e) => {
                                    handleSelectAddress(e); // Existing address selection
                                }}
                                style={{
                                    width: "25vw",
                                    height: "6vh",
                                    marginTop: "1vh",
                                    padding: "10px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    boxSizing: "border-box",
                                    display: "block",
                                    marginLeft: "1vw",
                                }}
                            >
                                {formData.address.map((address, index) => (
                                    <option key={index} value={address.name}>
                                        {address.name}
                                    </option>
                                ))}

                                <option value="addNew">Add new Address</option>
                            </select>

                            {/* Popup component */}
                            {isAdressPopUpOpen && (
                                <PopUp
                                    isOpen={isAdressPopUpOpen}
                                    setIsOpen={setIsAdressPopUpOpen}
                                    headerText={"Add Address"}
                                    actionText={"Add"}
                                    handleSubmit={handleAddAddress}
                                />
                            )}

                            {isAdressPopUpOpen && (
                                <PopUp
                                    isOpen={isAdressPopUpOpen}
                                    setIsOpen={setIsAdressPopUpOpen}
                                    headerText={"Add Address"}
                                    actionText={"Add"}
                                    handleSubmit={handleAddAddress}
                                />
                            )}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginLeft: "2vw",
                                marginTop: "2vh",
                            }}
                        >
                            <div
                                style={{
                                    marginLeft: "1vw",
                                    marginBottom: "1.5vh",
                                    color: "#9c4f21",
                                    fontSize: "35px",
                                }}
                            >
                                Payment:
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    marginLeft: "3vw",
                                    width: "25vw",
                                    gap: "1rem",
                                }}
                            >
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        border: "1px solid #ccc",
                                        borderRadius: "8px",
                                        padding: "0.5vw",
                                        height: "4.5vh",
                                        cursor: "pointer",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            fontSize: "25px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: "1vw",
                                                height: "1vh",
                                                marginRight: "0.5vw",
                                            }}
                                        >
                                            💵
                                        </span>
                                        Cash on delivery
                                    </div>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cash on delivery"
                                        checked={
                                            paymentMethod === "cash on delivery"
                                        }
                                        onChange={handlePaymentMethodChange}
                                        style={{
                                            accentColor: "#9c4f21",
                                            width: "2.5vw",
                                            height: "2.5vh",
                                        }}
                                    />
                                </label>
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        border: "1px solid #ccc",
                                        borderRadius: "8px",
                                        padding: "0.5vw",
                                        height: "4vh",
                                        cursor: "pointer",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            fontSize: "25px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: "1vw",
                                                height: "1vh",
                                                marginRight: "0.5vw",
                                            }}
                                        >
                                            💳
                                        </span>
                                        Credit/Debit card
                                    </div>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={paymentMethod === "card"}
                                        onChange={handlePaymentMethodChange}
                                        style={{
                                            accentColor: "#9c4f21",
                                            width: "2.5vw",
                                            height: "2.5vh",
                                        }}
                                    />
                                </label>
                            </div>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                marginTop: "1vh",
                                marginLeft: "5vw",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexDirection: "row",
                                    fontWeight: "bold",
                                    fontSize: "25px",
                                }}
                            >
                                Use Wallet Balance
                                <div style={{ padding: "1vw" }}>
                                    <IOSSwitch
                                        checked={isWalletUsed}
                                        onChange={handleUseWallet}
                                    />
                                </div>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexDirection: "row",
                                    gap: "1vw",
                                }}
                            >
                                <p
                                    style={{
                                        marginLeft: "0.5vw",
                                        marginTop: "-1vh",
                                        fontSize: "25px",
                                    }}
                                >
                                    Balance:{formatPrice(tourist?.wallet || 0)}
                                </p>

                                {tourist?.loyalityPoints > 0 && (
                                    <Box
                                        sx={{ "& > :not(style)": { m: 1 } }}
                                        style={{ marginTop: "-2vh" }}
                                    >
                                        <Fab
                                            size="small"
                                            sx={{
                                                backgroundColor: "#9c4f21",
                                                color: "white",
                                                "&:hover": {
                                                    backgroundColor: "#9c4f21",
                                                    color: "white",
                                                },
                                            }}
                                            aria-label="add"
                                            onClick={handleAddButton}
                                        >
                                            <AddIcon />
                                        </Fab>
                                    </Box>
                                )}

                                <PopUp
                                    isOpen={isPopUpOpen}
                                    setIsOpen={setIsPopUpOpen}
                                    headerText={"Redeem Points"}
                                    actionText={"Reedem"}
                                    handleSubmit={handleRedeemPoints}
                                >
                                    <div
                                        style={{
                                            border: "1px solid #ccc",
                                            borderRadius: "8px",
                                            width: "30vw",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <div>
                                                <h3
                                                    style={{
                                                        marginLeft: "1.5vw",
                                                        color: "#9c4f21",
                                                    }}
                                                >
                                                    Wallet And Points Details
                                                </h3>
                                                <p
                                                    style={{
                                                        marginLeft: "2vw",
                                                    }}
                                                >
                                                    Balance:{" "}
                                                    {formatPrice(
                                                        tourist?.wallet || 0
                                                    )}
                                                </p>
                                                <p
                                                    style={{
                                                        marginLeft: "2vw",
                                                    }}
                                                >
                                                    Points:{" "}
                                                    {tourist?.loyalityPoints ||
                                                        0}
                                                </p>
                                            </div>
                                        </div>
                                        <hr
                                            style={{
                                                marginTop: "0.5vh",
                                                width: "95%",
                                                marginLeft: "0.8vw",
                                            }}
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
                                                        marginLeft: "-8.5vw",
                                                        color: "#9c4f21",
                                                        marginTop: "-1.5vh",
                                                    }}
                                                >
                                                    Redeem Points
                                                </h3>
                                                <span
                                                    style={{
                                                        marginLeft: "28%",
                                                        padding: "0.5vh 2vw",
                                                    }}
                                                >
                                                    10K Points →{" "}
                                                    {formatPrice(100)}
                                                </span>
                                                <div
                                                    style={{
                                                        marginLeft: "2.5vw",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            direction: "row",
                                                            marginLeft: "7vw",
                                                        }}
                                                    >
                                                        <input
                                                            type="number"
                                                            placeholder="Points to redeem"
                                                            value={
                                                                pointsToRedeem
                                                            }
                                                            onChange={
                                                                handleRedeemPointsChange
                                                            }
                                                            style={{
                                                                width: "10vw",
                                                                textAlign:
                                                                    "center",
                                                                border: "1px solid #ccc",
                                                                borderRadius:
                                                                    "4px",
                                                            }}
                                                        />
                                                        →
                                                        <input
                                                            type="text"
                                                            placeholder="Value"
                                                            value={redeemValue.toFixed(
                                                                2
                                                            )}
                                                            readOnly
                                                            style={{
                                                                width: "10vw",
                                                                textAlign:
                                                                    "center",
                                                                border: "1px solid #ccc",
                                                                borderRadius:
                                                                    "4px",
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {popupAlert.open && (
                                        <Alert
                                            severity={popupAlert.severity}
                                            onClose={() =>
                                                setPopupAlert({
                                                    ...popupAlert,
                                                    open: false,
                                                })
                                            }
                                            style={{
                                                marginBottom: "1vh",
                                                fontSize: "22px",
                                                textAlign: "center",
                                                marginTop: "2vh",
                                            }}
                                        >
                                            {popupAlert.message}
                                        </Alert>
                                    )}
                                </PopUp>
                            </div>
                        </div>
                    </div>
                    {/* Left component */}
                    <div style={{ marginRight: "10vw" }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                // marginTop: "1vh",
                                displaydirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    marginBottom: "1.5vh",
                                }}
                            >
                                <p
                                    style={{
                                        color: "#9c4f21",
                                        fontSize: "35px",
                                    }}
                                >
                                    {" "}
                                    Promo Code:
                                </p>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: "2vw",
                                    }}
                                >
                                    <Box
                                        component="form"
                                        sx={{
                                            "& > :not(style)": {
                                                m: 1,
                                                width: "25ch",
                                            },
                                        }}
                                        noValidate
                                        autoComplete="off"
                                        required
                                    >
                                        <TextField
                                            id="outlined-basic"
                                            label="Promo Code"
                                            name="promoCode"
                                            value={promoCode}
                                            onChange={handlePromoCodeChange}
                                            variant="outlined"
                                            style={{
                                                width: "25vw",
                                                height: "4vh",
                                                marginTop: "1vh",
                                            }}
                                            InputProps={{
                                                endAdornment: (
                                                    <CloseIcon
                                                        onClick={
                                                            handleClearPromoCode
                                                        }
                                                        style={{
                                                            color: "#9c4f21",
                                                            cursor: "pointer",
                                                        }}
                                                    />
                                                ),
                                            }}
                                        />
                                    </Box>

                                    <Button
                                        stylingMode={"always-dark"}
                                        text="Apply"
                                        customStyle={{
                                            fontSize: "25px",
                                            textAlign: "center",
                                            position: "center",
                                            alignItems: "center",
                                            lineHeight: "1vh",
                                        }}
                                        handleClick={handlePromoCode}
                                        width="8vw"
                                        height="5vh"
                                    />
                                </div>

                                <div>
                                    <div
                                        style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "8px",
                                            overflow: "hidden",
                                            width: "37vw",
                                            fontFamily: "Arial, sans-serif",
                                            backgroundColor: "#fff",
                                            marginTop: "8vh",
                                        }}
                                    >
                                        {/* Header */}
                                        <div
                                            style={{
                                                backgroundColor: "#A0522D", // Brown color
                                                color: "#fff",
                                                height: "3vh",
                                                padding: "0.5vw",
                                                fontSize: "28px",
                                                fontWeight: "bold",
                                                textAlign: "center",
                                            }}
                                        >
                                            Price Details
                                        </div>
                                        {/* Body */}
                                        <div
                                            style={{
                                                padding: "1vh",
                                                color: "#4F4F4F",
                                            }}
                                        >
                                            {/* Items Price Row */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    margin: "0.5vh 0",
                                                    fontSize: "20px",
                                                }}
                                            >
                                                <span>Items price</span>
                                                <span
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {formatPrice(
                                                        location.state.price
                                                    )}
                                                </span>
                                            </div>
                                            {/* Promocode Row */}
                                            {promoCodeDiscount > 0 && (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        margin: "0.5vh 0",
                                                        fontSize: "20px",

                                                        width: "100%",
                                                    }}
                                                >
                                                    <span>
                                                        Promocode Discount
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontWeight: "bold",
                                                            color: "red",
                                                        }}
                                                    >
                                                        -{" "}
                                                        {formatPrice(
                                                            promoCodeDiscount
                                                        )}
                                                    </span>
                                                </div>
                                            )}

                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    margin: "0.5vh 0",
                                                    fontSize: "20px",
                                                }}
                                            >
                                                {isWalletUsed &&
                                                    tourist.wallet >=
                                                        location.state.price -
                                                            promoCodeDiscount && (
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent:
                                                                    "space-between", //margin: "0.5vh 0",
                                                                fontSize:
                                                                    "20px",

                                                                width: "100%",
                                                            }}
                                                        >
                                                            <span>
                                                                Amount taken
                                                                from wallet
                                                            </span>
                                                            <span
                                                                style={{
                                                                    color: "red",
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                            >
                                                                -{" "}
                                                                {formatPrice(
                                                                    Math.min(
                                                                        tourist.wallet,
                                                                        location
                                                                            .state
                                                                            .price -
                                                                            promoCodeDiscount
                                                                    )
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}
                                            </div>

                                            {/* Divider */}
                                            <hr
                                                style={{
                                                    border: "none",
                                                    borderTop: "1px solid #ddd",
                                                    margin: "2vh 0",
                                                }}
                                            />

                                            {/* Total Row */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    fontSize: "20px",
                                                    fontWeight: "bold",
                                                    marginTop: "1vh",
                                                    padding: "2vh ",
                                                }}
                                            >
                                                <span>Total</span>
                                                <span
                                                    style={{
                                                        fontSize: "18px",
                                                        color: "#000",
                                                    }}
                                                >
                                                    {isWalletUsed
                                                        ? formatPrice(
                                                              Math.max(
                                                                  location.state
                                                                      .price -
                                                                      tourist.wallet -
                                                                      promoCodeDiscount,
                                                                  0
                                                              )
                                                          )
                                                        : formatPrice(
                                                              location.state
                                                                  .price -
                                                                  promoCodeDiscount
                                                          )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                displaydirection: "row",
                            }}
                        >
                            <Button
                                stylingMode="always-light"
                                text="Back"
                                handleClick={handleBackButton}
                                width="10vw"
                                height="5vh"
                            />
                            <Button
                                stylingMode="always-dark"
                                text={
                                    (paymentMethod === "card" &&
                                        !isWalletUsed) ||
                                    (paymentMethod === "card" &&
                                        isWalletUsed &&
                                        tourist.wallet < location.state.price)
                                        ? "Next"
                                        : "Place Order"
                                }
                                handleClick={handleNext}
                                width="10vw"
                                height="5vh"
                            />
                            <PopUp
                                isOpen={isCompletionPopUpOpen}
                                setIsOpen={setIsCompletionPopUpOpen}
                                headerText={
                                    "Your order is placed successfully."
                                }
                                containsActionButton={false}
                                cancelText="Ok"
                                handleOnClose={handleCompleteOrder}
                            />
                        </div>
                    </div>
                </div>
                {alert.open && (
                    <Alert
                        severity={alert.severity}
                        onClose={() => setAlert({ ...alert, open: false })}
                        style={{
                            alignItems: "center",
                            marginTop: "1vh",
                            width: "80vw",
                            marginLeft: "8vw",
                            marginBottom: "2vh",
                            fontSize: "22px",
                            textAlign: "center",
                        }}
                    >
                        {alert.message}
                    </Alert>
                )}
                <Footer />
            </div>
        </div>
    );
};

const backgroundStyle = {
    width: "100vw",
    height: "30vh",
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${checkoutBackground})`,
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
