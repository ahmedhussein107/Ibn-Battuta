import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaTrash, FaMapMarkerAlt as LocationIcon } from "react-icons/fa";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { createUseStyles } from "react-jss";
import axiosInstance from "../api/axiosInstance";
import CardActivity from "./CardActivity";
import CardCustomActivity from "./CardCustomActivity";

const TimelineN = ({ date, time }) => {
    const classes = useStyles();
    const [activeTab, setActiveTab] = useState("activities");
    const [activities, setActivities] = useState([]);
    const [customActivities, setCustomActivities] = useState([]);
    const [timelineActivities, setTimelineActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState("");
    const [selectedCustomActivity, setSelectedCustomActivity] = useState("");

    useEffect(() => {
        if (!date || !time) return;
        const [year, month, day] = date.split('-').map(Number);
        const [hours, minutes] = time.split(':').map(Number);
        const convertedDate = new Date(year, month - 1, day, hours, minutes);

        const startDate = new Date(convertedDate);
        const endDate = new Date(convertedDate);
        endDate.setHours(startDate.getHours() + 23);
        endDate.setMinutes(startDate.getMinutes() + 59);
        endDate.setSeconds(startDate.getSeconds() + 59);
        const dateRange = startDate.toISOString() + "€" + endDate.toISOString();

        const fetchActivities = async () => {
            try {
                const response = await axiosInstance.get(
                    "/activity/getAllActivities",
                    { params: { startDate: dateRange } },
                    {
                        withCredentials: true,
                    }
                );
                const data = response.data;
                console.log("activities", data);
                setActivities(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const fetchCustomActivities = async () => {
            try {
                const response = await axiosInstance.get(
                    "/customActivity/getCustomActivityByTourGuideId",
                    {
                        withCredentials: true,
                    }
                );
                const data = response.data;
                console.log("customActivities", data);
                setCustomActivities(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchActivities();
        fetchCustomActivities();
    }, [date, time]);

    const handleDeleteActivity = (activity) => {
        setTimelineActivities(
            timelineActivities.filter((act) => act._id !== activity._id)
        );
        setActivities([...activities, activity]);
    };

    const handleDeleteCustom = (activity) => {
        setTimelineActivities(
            timelineActivities.filter((act) => act._id !== activity._id)
        );
        setCustomActivities([...customActivities, activity]);
    };

    const handleAddActivity = (activity) => {
        setTimelineActivities([...timelineActivities, activity]);
        setActivities(activities.filter((act) => act._id !== activity._id));
    };

    const handleAddCustom = (activity) => {
        setTimelineActivities([...timelineActivities, activity]);
        setCustomActivities(customActivities.filter((act) => act._id !== activity._id));
    };

    function formatToAMPM(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const ampm = hours >= 12 ? "PM" : "AM";

        // Convert hours from 24-hour to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // If hour is 0, set it to 12

        // Format minutes and seconds to be two digits
        const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
        const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

        return `${hours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
    }

    return (
        <div className={classes.pageContainer}>
            <div className={classes.leftPanel}>
                <div className={classes.container}>
                    <div className={classes.timelineItem}>
                        <div className={classes.pickupMarker}>
                            <FaMapMarkerAlt className={classes.markerIcon} />
                        </div>
                        <div className={classes.timelineContent}>
                            <h3 className={classes.title}>Pickup</h3>
                            <p className={classes.details}>7:00 am - Pickup Location</p>
                        </div>
                    </div>

                    <TransitionGroup>
                        {timelineActivities.map((activity, index) => (
                            <CSSTransition key={index} timeout={300} classNames="scale">
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
                                        <h3 className={classes.title}>{activity.name}</h3>
                                        <p className={classes.details}>
                                            {formatToAMPM(
                                                new Date(activity.currentStartDate)
                                            )}
                                        </p>
                                        <p className={classes.details}>
                                            {formatToAMPM(
                                                new Date(activity.currentEndDate)
                                            )}
                                        </p>
                                        <p className={classes.details}>
                                            {activity.description}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(index)}
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
                            <h3 className={classes.title}>7 drop-off locations:</h3>
                            <p className={classes.details}>
                                Stratosphere Casino, Hotel & Tower, Park MGM Las
                            </p>
                            <p className={classes.details}>See more</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={classes.activitiesList}>
                <div className={classes.tabsContainer}>
                    <button
                        className={`${classes.tab} ${
                            activeTab === "activities"
                                ? classes.activeTab
                                : classes.inactiveTab
                        }`}
                        onClick={() => setActiveTab("activities")}
                    >
                        Activities
                    </button>
                    <button
                        className={`${classes.tab} ${
                            activeTab === "customActivities"
                                ? classes.activeTab
                                : classes.inactiveTab
                        }`}
                        onClick={() => setActiveTab("customActivities")}
                    >
                        Custom Activities
                    </button>
                </div>

                <div className={classes.cardsContainer}>
                    {activeTab === "activities" &&
                        activities.map((activity) => (
                            <CardActivity
                                activity={activity}
                                width={"40vw"}
                                height={"28vh"}
                                fontSize="0.8rem"
                                iconSize="0.7rem"
                                bottomButtons={[
                                    {
                                        text: "Add",
                                        onClick: () => handleAddActivity(activity),
                                        type: "1",
                                        width: "50%",
                                        styles: {
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            padding: "0.5em",
                                        },
                                    },
                                ]}
                            />
                        ))}

                    {activeTab === "customActivities" &&
                        customActivities.map((activity) => (
                            <CardCustomActivity
                                key={activity.id}
                                activity={activity}
                                width={"40vw"}
                                height={"28vh"}
                                fontSize="0.8rem"
                                iconSize="0.7rem"
                                bottomButtons={[
                                    {
                                        text: "Add",
                                        onClick: () => handleAddActivity(activity),
                                        type: "1",
                                        width: "50%",
                                        styles: {
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            padding: "0.5em",
                                        },
                                    },
                                ]}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
};

const useStyles = createUseStyles({
    pageContainer: {
        display: "flex",
        gap: "2vw",
        padding: "2vh",
        width: "95vw",
        justifyContent: "space-between",
    },
    leftPanel: {
        width: "23vw",
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
    activitiesList: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8f8f8",
        borderRadius: "10px",
        padding: "2vh 1vw",
        alignItems: "center",
        width: "60vw",
        maxHeight: "100vh",
        overflow: "auto",
        marginLeft: "1vw",
    },
    tabsContainer: {
        display: "flex",
        gap: "1vw",
        marginBottom: "2vh",
    },
    tab: {
        padding: "1vh 2vw",
        borderRadius: "20px",
        cursor: "pointer",
        border: "none",
        fontSize: "1.1vw",
        fontWeight: "500",
        transition: "all 0.3s ease",
    },
    activeTab: {
        backgroundColor: "#ff5b24",
        color: "white",
    },
    inactiveTab: {
        backgroundColor: "white",
        color: "#333",
        border: "1px solid #ddd",
    },
    cardsContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "1vh",
    },
    activityCard: {
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "1vh",
        marginBottom: "2vh",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        gap: "1vw",
    },
    activityImage: {
        width: "150px",
        height: "100px",
        borderRadius: "8px",
        objectFit: "cover",
    },
    activityInfo: {
        flex: 1,
    },
    activityHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "1vh",
    },
    activityMetadata: {
        display: "flex",
        gap: "1vw",
        color: "#666",
        fontSize: "0.9vw",
        marginBottom: "1vh",
    },
    addButton: {
        backgroundColor: "#ff5b24",
        color: "white",
        border: "none",
        borderRadius: "20px",
        padding: "0.5vh 2vw",
        cursor: "pointer",
        fontSize: "1vw",
        transition: "background-color 0.3s ease",
        "&:hover": {
            backgroundColor: "#e64d1c",
        },
    },
    rating: {
        color: "#ffd700",
        display: "flex",
        alignItems: "center",
        gap: "0.3vw",
    },
    seats: {
        color: "#666",
        fontSize: "0.9vw",
    },
    "@global": {
        ".scale-enter": {
            opacity: 0,
            transform: "translateY(-2vh)",
        },
        ".scale-enter-active": {
            opacity: 1,
            transform: "translateY(0)",
            transition: "opacity 300ms ease-out, transform 300ms ease-out",
        },
        ".scale-exit": {
            opacity: 1,
            transform: "translateY(0)",
        },
        ".scale-exit-active": {
            opacity: 0,
            transform: "translateY(2vh)",
            transition: "opacity 300ms ease-in, transform 300ms ease-in",
        },
    },
});


export default TimelineN;
