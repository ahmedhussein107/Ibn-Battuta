import React, { useState } from "react";
import { FaMapMarkerAlt, FaTrash, FaMapMarkerAlt as LocationIcon } from "react-icons/fa";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { createUseStyles } from "react-jss";

const Timeline = ({
    timelineActivities,
    setTimelineActivities,
    pickupLocation = "pickup location",
    pickupTime,
    dropOffLocation = "drop off location",
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
                            {pickupTime.toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                            })}
                        </p>
                    </div>
                </div>

                <TransitionGroup>
                    {timelineActivities.map((activity, index) => (
                        <CSSTransition key={index} timeout={100} classNames="scale">
                            <div className={classes.timelineItem}>
                                <div className={classes.starMarker}>
                                    <svg className={classes.starIcon} viewBox="0 0 24 24">
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
            </div>
        </div>
    );
};

const useStyles = createUseStyles({
    leftPanel: {
        width: "30vw",
    },
    container: {
        padding: "2vh",
        width: "100%",
        backgroundColor: "#f8f8f8",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    },
    timelineLine: {
        top: "8vh",
        left: "3vw",
        width: "0.8vw",
        backgroundColor: "#ff5b24",
        borderRadius: "0.3vw",
    },
    timelineItem: {
        display: "flex",
        alignItems: "center",
        marginBottom: "3vh",
        position: "relative",
    },
    pickupMarker: {
        position: "relative",
        left: "1.2vw",
        width: "3vw",
        height: "5vh",
        backgroundColor: "#ff5b24",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
        marginLeft: "-1vh",
    },
    markerIcon: {
        color: "white",
        fontSize: "1.5vw",
    },
    starMarker: {
        position: "relative",
        left: "1.2vw",
        width: "2.5vw",
        height: "4vh",
        backgroundColor: "#1c3c61",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
        marginLeft: "-.5vh",
        border: "0.2vh solid #fff",
    },
    starIcon: {
        width: "1.5vw",
        height: "2vh",
    },
    dropoffMarker: {
        position: "relative",
        left: "1.2vw",
        width: "2.5vw",
        height: "4vh",
        backgroundColor: "#ff5b24",
        borderRadius: "50%",
        zIndex: 1,
        marginLeft: "-.35vh",
    },
    timelineContent: {
        marginLeft: "5vw",
        backgroundColor: "#fff",
        padding: "1vh 1.2vw",
        borderRadius: "0.7vw",
        boxShadow: "0 0.4vh 0.6vh rgba(0, 0, 0, 0.1)",
        flex: "1",
    },
    title: {
        fontSize: "1.3vw",
        fontWeight: "bold",
        color: "#333",
    },
    details: {
        fontSize: "1.1vw",
        color: "#555",
    },
    deleteButton: {
        backgroundColor: "transparent",
        border: "none",
        color: "#ff5b24",
        fontSize: "1.5vw",
        cursor: "pointer",
        marginLeft: "1vw",
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
