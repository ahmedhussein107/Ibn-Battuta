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
    const [isPromoCodeLoading, setIsPromoCodeLoading] = useState(false);

    const handleApplyPromoCode = async () => {
        console.log("i am here at promocode");
        if (!promoCode || promoCode.trim() === "") {
            return;
        }
        setIsPromoCodeLoading(true);
        try {
            await axiosInstance.post(
                "/promoCode/createPromoCode",
                {
                    code: promoCode,
                },
                { withCredentials: true }
            );
            console.log("Promo code applied successfully");
            setPromoCode("");
        } catch (err) {
        } finally {
            setIsPromoCodeLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                <input
                    type="text"
                    placeholder="add a promo code..."
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={{
                        height: "4vh",
                        border: "1px solid var(--accent-color)",
                        borderRadius: "50px",
                        padding: "5px",
                        paddingLeft: "20px",
                        marginRight: "10px",
                    }}
                />
                <Button
                    stylingMode="always-dark"
                    text="Apply"
                    width="10vw"
                    isLoading={isPromoCodeLoading}
                    customStyle={
                        {
                            //margin
                        }
                    }
                    handleClick={handleApplyPromoCode}
                />
            </div>
            <Footer />
        </div>
    );
};
export default AdminPromoCode;
