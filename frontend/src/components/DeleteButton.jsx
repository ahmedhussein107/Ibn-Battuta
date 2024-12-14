import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const DeleteButton = ({ deleteHandler, ID, fontSize = "3.5vh" }) => {
    const [isDeleteHovered, setIsDeleteHovered] = useState(false);
    return (
        <DeleteOutlineIcon
            style={{
                padding: "0.8vw 1.6vh",
                color: "red",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: fontSize,
                borderRadius: "2vh",
                backgroundColor: isDeleteHovered ? "#ffe6e6" : "transparent",
                transition: "background-color 0.25s",
            }}
            onMouseEnter={() => setIsDeleteHovered(true)}
            onMouseLeave={() => setIsDeleteHovered(false)}
            onClick={() => deleteHandler(ID)}
        />
    );
};

export default DeleteButton;
