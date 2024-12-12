import React, { useState } from "react";
import { FaMapMarkerAlt, FaTrash, FaMapMarkerAlt as LocationIcon } from "react-icons/fa";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { createUseStyles } from "react-jss";
import Button from "./Button";

const Timeline = ({
    setStep,
    timelineActivities,
    setTimelineActivities,
    pickupLocation = "pickup location",
    pickupTime,
    dropOffLocation = "drop off location",
    setShowMorePopupOpen,
    setShowMoreCustomActivity,
    showPopupMessage,
}) => {
    const classes = useStyles();

    const handleDeleteActivity = (index) => {
        // const curActivity = timelineActivities[index];
        setTimelineActivities(timelineActivities.filter((_, ind) => ind !== index));
    };

    const handleShowMore = (index) => {
        const curActivity = timelineActivities[index];
        if (curActivity.activityType == "Activity") {
            // navigate("activity-datails", { state: { activity: curActivity.activity } });
            window.open(`/activity-details/${curActivity.activity._id}`, "_blank");
        } else if (curActivity.activityType == "CustomActivity") {
            setShowMoreCustomActivity(curActivity.activity);
            setShowMorePopupOpen(true);
        } else {
            console.log("What is this ??!!");
        }
    };

    return (
        <div className={classes.leftPanel}>
            <div className={classes.container}>
                <div className={classes.timelineItem}>
                    <div className={classes.pickupMarker}>
                        <FaMapMarkerAlt className={classes.markerIcon} />
                    </div>
                    <div className={classes.timelineContent}>
                        <h3 className={classes.title}>Pickup:</h3>
                        <p className={classes.details}>
                            {pickupLocation}
                            <br />
                            {pickupTime &&
                                pickupTime.toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                })}
                            {!pickupTime && "Not set"}
                        </p>
                    </div>
                </div>

                <TransitionGroup>
                    {timelineActivities.map((activity, index) => (
                        <>
                            <CSSTransition key={index} timeout={100} classNames="scale">
                                <div className={classes.timelineItem}>
                                    <div className={classes.starMarker}>
                                        <svg
                                            className={classes.starIcon}
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fill="white"
                                                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                            />
                                        </svg>
                                    </div>
                                    <div className={classes.timelineContent}>
                                        <h3 className={classes.title}>
                                            {activity.activity.name}
                                        </h3>
                                        <p className={classes.details}>
                                            from:{" "}
                                            {activity.startTime.toLocaleString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit",
                                                hour12: true,
                                            })}
                                        </p>
                                        <p className={classes.details}>
                                            to:{" "}
                                            {activity.endTime.toLocaleString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit",
                                                hour12: true,
                                            })}
                                        </p>
                                        <p
                                            className={classes.details}
                                            onClick={() => handleShowMore(index)}
                                            style={{
                                                cursor: "pointer",
                                                color: "var(--accent-color)",
                                            }}
                                        >
                                            Show more
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteActivity(index)}
                                        className={classes.deleteButton}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </CSSTransition>

                            {/* Add a timeline line below each activity, except the last one */}
                            {index < timelineActivities.length - 1 && (
                                <div className={classes.timelineLine}></div>
                            )}
                        </>
                    ))}
                </TransitionGroup>

                <div className={classes.timelineItem}>
                    <div className={classes.dropoffMarker}></div>
                    <div className={classes.timelineContent}>
                        {/* TODO: Replace with actual drop-off time */}
                        <h3 className={classes.title}>drop-off location:</h3>
                        <p className={classes.details}>{dropOffLocation}</p>
                    </div>
                </div>

                <Button
                    stylingMode="always-light"
                    text="Add Activity"
                    handleClick={() => {
                        if (pickupTime) setStep(2);
                        else {
                            showPopupMessage(
                                "Please set a pickup time before adding an activity.",
                                true
                            );
                        }
                    }}
                    width="auto"
                />
            </div>
        </div>
    );
};

const useStyles = createUseStyles({
    leftPanel: {
        width: "100%",
        padding: "20px",
        backgroundColor: "#ffffff",
    },
    container: {
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        margin: "20px",
        padding: "20px",
        backgroundColor: "#f8f8f8",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    },
    timelineItem: {
        display: "flex",
        alignItems: "flex-start",
        marginBottom: "20px",
        position: "relative",
    },
    pickupMarker: {
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        backgroundColor: "#DB9D6D", // Same as specialIcon
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "20px",
        fontWeight: "bold",
        lineHeight: "30px",
        marginRight: "15px",
    },
    starMarker: {
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        backgroundColor: "#DB9D6D", // Matches activityIcon
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "15px",
        color: "white",
        fontSize: "20px",
        fontWeight: "bold",
    },
    dropoffMarker: {
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        backgroundColor: "#DB9D6D",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "20px",
        fontWeight: "bold",
        marginRight: "15px",
    },
    timelineLine: {
        width: "6px",
        backgroundColor: "#9C4F21",
        height: "40px",
        marginTop: "10px",
        marginBottom: "-10px",
    },
    timelineContent: {
        flex: 1,
        paddingLeft: "15px",
    },
    title: {
        fontWeight: "bold",
        fontSize: "16px",
        marginBottom: "5px",
    },
    details: {
        color: "#555",
        fontSize: "14px",
    },
    deleteButton: {
        backgroundColor: "transparent",
        border: "none",
        color: "#ff5b24",
        fontSize: "16px",
        cursor: "pointer",
        marginLeft: "10px",
    },
    "@global": {
        ".scale-enter": {
            opacity: 0,
            transform: "translateY(-2vh)",
        },
        ".scale-enter-active": {
            opacity: 1,
            transform: "translateY(0)",
            transition: "opacity 100ms ease-out, transform 100ms ease-out",
        },
        ".scale-exit": {
            opacity: 1,
            transform: "translateY(0)",
        },
        ".scale-exit-active": {
            opacity: 0,
            transform: "translateY(2vh)",
            transition: "opacity 100ms ease-in, transform 100ms ease-in",
        },
    },
});

export default Timeline;
