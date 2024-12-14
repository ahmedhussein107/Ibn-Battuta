import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import profileBackground from "../../assets/backgrounds/profile_bg.jpeg";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import Footer from "../../components/Footer";
import bg from "../../assets/images/bg.jpg";
import ProfileButton from "../../components/ProfileButtons";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import PopUp from "../../components/PopUpsGeneric/PopUp";
import { uploadFile } from "../../api/firebase.js";
import Button from "../../components/Button";
import Alert from "@mui/material/Alert";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import axios from "axios";

const AdminPromoCode = () => {
    const [promoCode, setPromoCode] = useState(null);
    const [discount, setDiscount] = useState("");
    const [maxUsage, setMaxUsage] = useState("");
    const [isPromoCodeLoading, setIsPromoCodeLoading] = useState(false);
    const [alert, setAlert] = useState({ open: false, severity: "info", message: "" });

    // const handleApplyPromoCode = async () => {
    //     console.log("i am here at promocode");
    //     if (!promoCode || promoCode.trim() === "") {
    //         return;
    //     }
    //     setIsPromoCodeLoading(true);
    //     try {
    //         await axiosInstance.post(
    //             "/promoCode/createPromoCode",
    //             {
    //                 code: promoCode,
    //             },
    //             { withCredentials: true }
    //         );
    //         console.log("Promo code applied successfully");
    //         setPromoCode("");
    //     } catch (err) {
    //     } finally {
    //         setIsPromoCodeLoading(false);
    //     }
    // };

    const handleApplyPromoCode = async () => {
        console.log("i am here at promocode");
        if (!promoCode.trim() || !discount.trim() || !maxUsage.trim()) {
            setAlert({
                open: true,
                severity: "warning",
                message: "All fields are required",
            });
            return;
        }
        setIsPromoCodeLoading(true);
        try {
            await axiosInstance.post(
                "/promoCode/createPromoCode",
                {
                    code: promoCode,
                    discount: parseFloat(discount),
                    maxUsage: parseInt(maxUsage, 10),
                },
                { withCredentials: true }
            );
            console.log("Promo code applied successfully");
            setPromoCode("");
            setDiscount("");
            setMaxUsage("");
            setAlert({
                open: true,
                severity: "success",
                message: "Promo code created successfully",
            });
        } catch (err) {
            console.error("Error applying promo code:", err);
            setAlert({
                open: true,
                severity: "error",
                message: "Failed to create promo code",
            });
        } finally {
            setIsPromoCodeLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ width: "100vw", position: "absolute", top: "0", left: "0" }}>
                <div style={backgroundStyle}>
                    <div style={{ marginTop: "5vh" }}>
                        <p
                            style={{
                                fontSize: "2.5rem",
                                marginBottom: "1rem",
                                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                                color: "white",
                                fontWeight: "bold",
                                userSelect: "none",
                            }}
                        >
                            PromoCodes
                        </p>
                    </div>
                </div>
                {/* the first part of the page */}
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20vh",
                }}
            >
                <p style={{ color: "##9C5F11", fontWeight: "bold" }}>PromoCode</p>
                <TextField
                    name="promoCode"
                    label="Promo Code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    variant="outlined"
                    sx={{ width: "35vw", marginBottom: "3vh" }} // Use sx for styling
                />
                <TextField
                    name="discount"
                    label="Discount (%)"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    variant="outlined"
                    size="medium"
                    sx={{ width: "35vw", marginBottom: "3vh" }} // Use sx for styling
                />
                <TextField
                    name="maxUsage"
                    label="Max Usage"
                    value={maxUsage}
                    onChange={(e) => setMaxUsage(e.target.value)}
                    variant="outlined"
                    sx={{ width: "35vw", marginBottom: "3vh" }} // Use sx for styling
                />

                <Button
                    stylingMode="always-dark"
                    text="Create"
                    width="10vw"
                    isLoading={isPromoCodeLoading}
                    customStyle={{
                        marginTop: "10px",
                    }}
                    handleClick={handleApplyPromoCode}
                />
                {alert.open && (
                    <Alert
                        severity={alert.severity}
                        onClose={() =>
                            setAlert({ open: false, severity: "info", message: "" })
                        }
                        style={{ marginTop: "10px", width: "80%" }}
                    >
                        {alert.message}
                    </Alert>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default AdminPromoCode;

const backgroundStyle = {
    width: "100vw",
    height: "30vh",
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${profileBackground})`,
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    shadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
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
