import React from "react";
import "./ComplaintCard.css";
import Button from "../Button";
import ReplySharpIcon from "@mui/icons-material/ReplySharp";
import DoneSharpIcon from "@mui/icons-material/DoneSharp";
import HourglassEmptySharpIcon from "@mui/icons-material/HourglassEmptySharp";

const ComplaintCard = ({ complaint, isExpanded, ...props }) => {
    const { title, status, createdAt, body, touristID } = complaint;
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
        console.log("View clicked");
    };
    return (
        <div className="complaint-card">
            {/* Complaint Title and Status */}
            <div className="complaint-header">
                <div className="title-and-date">
                    <span className="complaint-title">
                        {title.length > 16 && !isExpanded
                            ? `${title.slice(0, 16)}...`
                            : title}
                    </span>
                    <span className="complaint-date">{formattedDate}</span>
                </div>
                <div className="status-and-actions">
                    <span className={`complaint-status ${status}`}>
                        {status.toUpperCase()}
                    </span>
                    <div className={`change-status-${status}`}>
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
                </div>
            </div>

            <div className="complaint-user">
                <img
                    src={
                        touristID?.picture ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
                    alt={touristID.name}
                    className="user-image"
                />
                <span className="user-name" onClick={() => handleViewProfile()}>
                    {touristID.name}
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
                        width={"40px"}
                        customStyle={{
                            marginLeft: "20px",
                            width: "40px",
                            height: "55px",
                            minHieght: "70px",
                            borderRadius: "60px",
                            maxWidth: "100px",
                        }}
                    />
                ) : (
                    <div
                        className="reply-div"
                        onClick={() => props?.onReply(complaint._id)}
                    >
                        <ReplySharpIcon
                            sx={{ verticalAlign: "middle", marginRight: "5px" }}
                        />
                        reply
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplaintCard;
