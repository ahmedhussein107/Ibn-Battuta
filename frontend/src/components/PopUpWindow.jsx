import React from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import UserProfile from "./UserProfile";

export default function PopUpWindow({ onClose, data, setData }) {
    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                    <IconButton onClick={onClose}>
                        <CloseIcon
                            style={{ color: "red", height: "5vh", width: "5vh" }}
                        />
                    </IconButton>
                </div>
                <UserProfile data={data} setData={setData} />
            </div>
        </div>
    );
}

const styles = {
    modalOverlay: {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)" /* Semi-transparent black background */,
        zIndex: "999" /* Ensure it's on top of other content */,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },

    /* Pop-up content */
    popupContent: {
        backgroundColor: "#D5E0E6",
        padding: "3vh 5vw",
        borderRadius: "5px",
        textAlign: "center",
        marginTop: "2%",
        justifyContent: "center",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
        zIndex: "1000" /* Ensure it's above the overlay */,
    },
};
