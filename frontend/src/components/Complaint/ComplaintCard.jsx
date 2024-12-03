import React from "react";
import "./ComplaintCard.css";
import Button from "../Button";
import ReplySharpIcon from "@mui/icons-material/ReplySharp";
import DoneSharpIcon from "@mui/icons-material/DoneSharp";
import HourglassEmptySharpIcon from "@mui/icons-material/HourglassEmptySharp";
import axiosInstance from "../../api/axiosInstance";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
const ComplaintCard = ({ complaint, isExpanded, ...props }) => {
    console.log("complaint in the first thing of the card", complaint);
    const navigate = useNavigate();
    console.log("1");
    console.log("complaint", complaint);
    const { title, createdAt, body, status, touristID, ...more } = complaint;
    console.log("complaint", complaint);
    const userType = Cookies.get("userType") || "Tourist";
    const formatDate = (date) => {
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        return `${month}/${day}/${year} ${hours}:${minutes}`;
    };
    const formattedDate = formatDate(createdAt);

    const renderBody = () => {
        if (isExpanded || body.length <= 40) return body;
        const maxLength = 40;
        return `${body.slice(0, maxLength)}... `;
    };

    const handleViewProfile = () => {
        console.log("Profile clicked");
    };
    const handleViewComplaint = () => {
        console.log("id of complaint", complaint._id);
        navigate(
            `/${Cookies.get("userType").toLocaleLowerCase()}/complaint/${complaint._id}`
        );
        console.log("View clicked");
    };
    const handleUpdateStatus = async () => {
        try {
            const newStatus = status === "pending" ? "resolved" : "pending";
            const res = await axiosInstance.put(
                `complaint/updateComplaint/${complaint._id}`,
                {
                    status: newStatus,
                },
                {
                    withCredentials: true,
                }
            );
            console.log("res:", res);
            if (isExpanded) props?.setComplaint(res.data);
            else window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <article className="complaint-card">
            {/* Complaint Title and Status */}
            <div className="complaint-header">
                <div className="title-and-date">
                    <span className="complaint-title">{title}</span>
                    <span className="complaint-date">{formattedDate}</span>
                </div>
                <div className="status-and-actions">
                    <span className={`complaint-status ${status}`}>
                        {status.toUpperCase()}
                    </span>
                    {userType === "Admin" && isExpanded && (
                        <div
                            className={`change-status-${status}`}
                            onClick={handleUpdateStatus}
                        >
                            {status === "pending" && (
                                <DoneSharpIcon
                                    sx={{
                                        verticalAlign: "middle",
                                        marginRight: "5px",
                                    }}
                                />
                            )}
                            {status === "resolved" && (
                                <HourglassEmptySharpIcon
                                    sx={{
                                        verticalAlign: "middle",
                                        marginRight: "5px",
                                    }}
                                />
                            )}
                            mark as {status === "pending" ? "resolved" : "pending"}
                        </div>
                    )}
                </div>
            </div>
            <div className="complaint-user">
                <img
                    src={
                        touristID?.picture ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
                    alt={touristID?.name || "Anonymous"}
                    className="user-image"
                />
                <span className="user-name" onClick={() => handleViewProfile()}>
                    {touristID?.name || "Anonymous"}
                </span>
            </div>

            <div className="complaint-description">{renderBody()}</div>
            <div className="complaint-footer">
                {!isExpanded ? (
                    <Button
                        stylingMode="submit"
                        text={"View"}
                        handleClick={handleViewComplaint}
                        isLoading={false}
                        customStyle={{
                            marginLeft: "20px",
                            height: "5vh",
                            minHieght: "70px",
                            borderRadius: "60px",
                        }}
                    />
                ) : (
                    <div className="reply-div" onClick={() => props?.onReply(null)}>
                        <ReplySharpIcon
                            sx={{ verticalAlign: "middle", marginRight: "5px" }}
                        />
                        reply
                    </div>
                )}
            </div>
        </article>
    );
};

export default ComplaintCard;
