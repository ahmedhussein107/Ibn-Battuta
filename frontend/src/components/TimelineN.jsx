import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaTrash, FaMapMarkerAlt as LocationIcon } from "react-icons/fa";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
    pageContainer: {
        display: "flex",
        gap: "2vw",
        padding: "2vh",
        maxWidth: "90vw",
        margin: "auto",
        position: "relative",
    },
    leftPanel: {
        position: "sticky",
        top: "2vh",
        // left: "0vh",
        height: "fit-content",
        flex: "0 0 40vw",
        marginLeft: "-5vw",
        // minwidth: "-10vw",
    },
    container: {
        position: "relative",
        padding: "2vh",
        width: "100%",
        backgroundColor: "#f8f8f8",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    },
    timelineLine: {
        position: "absolute",
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
        flex: 1,
        maxWidth: "35vw",
        maxHeight: "100vh",
        overflow: "auto",
        marginLeft: "5vw",
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

const TimelineN = () => {
    const classes = useStyles();
    const [activeTab, setActiveTab] = useState("activities");
    const [timelineActivities, setTimelineActivities] = useState([
        { name: "Activity 1", time: "7:30 am - 9:00 am", details: "See more" },
        {
            name: "Hoover Dam",
            time: "11:00 am - 12:00 pm",
            details: "Exploring the dam and its history",
        },
        {
            name: "Grand Canyon West Rim",
            time: "1:00 pm - 3:00 pm",
            details: "Sightseeing and guided activities",
        },
        {
            name: "Eagle Point",
            time: "3:30 pm - 4:00 pm",
            details: "Scenic view and photo stop",
        },
        {
            name: "Guano Point",
            time: "Visit, Lunch, Sightseeing (1 hour)",
            details: "Lunch and sightseeing stop",
        },
        {
            name: "Arizona's Joshua Tree Forest",
            time: "Visit (15 minutes)",
            details: "Short stop at the Joshua Tree forest",
        },
    ]);

    const [availableActivities, setAvailableActivities] = useState([
        {
            id: 1,
            name: "Desert Safari Adventure",
            location: "Cairo, EG",
            category: "Adventure",
            date: "02/11/2024",
            description:
                "This itinerary offers a mix of cultural exploration, outdoor adventures, and relaxation, allowing you to experience the destination's highlights.",
            price: 79.4,
            rating: 5,
            reviews: 1340,
            seats: 5,
            image: "/api/placeholder/400/320",
        },
        {
            id: 2,
            name: "Nile River Cruise",
            location: "Cairo, EG",
            category: "Cruise",
            date: "02/11/2024",
            description:
                "Experience the majestic Nile River with our luxury cruise package, featuring dinner and entertainment.",
            price: 89.9,
            rating: 4,
            reviews: 890,
            seats: 8,
            image: "/api/placeholder/400/320",
        },
        {
            id: 3,
            name: "Pyramid Tour",
            location: "Cairo, EG",
            category: "Cultural",
            date: "02/12/2024",
            description:
                "Explore the ancient pyramids with our expert guides and learn about Egyptian history.",
            price: 65.0,
            rating: 5,
            reviews: 2100,
            seats: 12,
            image: "/api/placeholder/400/320",
        },
    ]);

    const [timelineHeight, setTimelineHeight] = useState(0);

    useEffect(() => {
        setTimelineHeight((timelineActivities.length + 2) * 9 + 3.5);
    }, [timelineActivities]);

    const handleDelete = (index) => {
        const removedActivity = timelineActivities[index];
        setTimelineActivities(timelineActivities.filter((_, i) => i !== index));
        setAvailableActivities([
            ...availableActivities,
            {
                id: Date.now(),
                name: removedActivity.name,
                location: "Cairo, EG",
                category: "Activity",
                date: removedActivity.time,
                description: removedActivity.details,
                price: 79.4,
                rating: 5,
                reviews: 1340,
                seats: 5,
                image: "/api/placeholder/400/320",
            },
        ]);
    };

    const handleAdd = (activity) => {
        setTimelineActivities([
            ...timelineActivities,
            {
                name: activity.name,
                time: activity.date,
                details: activity.description,
            },
        ]);
        setAvailableActivities(availableActivities.filter((a) => a.id !== activity.id));
    };

    return (
        <div className={classes.pageContainer}>
            <div className={classes.leftPanel}>
                <div className={classes.container}>
                    <div
                        className={classes.timelineLine}
                        style={{ height: `${timelineHeight}vh` }}
                    ></div>

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
                                        <p className={classes.details}>{activity.time}</p>
                                        <p className={classes.details}>
                                            {activity.details}
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
                            activeTab === "custom"
                                ? classes.activeTab
                                : classes.inactiveTab
                        }`}
                        onClick={() => setActiveTab("custom")}
                    >
                        Custom Activities
                    </button>
                </div>

                {availableActivities.map((activity) => (
                    <div key={activity.id} className={classes.activityCard}>
                        <img
                            src={activity.image}
                            alt={activity.name}
                            className={classes.activityImage}
                        />
                        <div className={classes.activityInfo}>
                            <div className={classes.activityHeader}>
                                <h3 className={classes.title}>{activity.name}</h3>
                                <button
                                    onClick={() => handleAdd(activity)}
                                    className={classes.addButton}
                                >
                                    Add
                                </button>
                            </div>
                            <div className={classes.activityMetadata}>
                                <LocationIcon size={14} /> {activity.location}
                                <span>Category</span>
                                <span>Tags</span>
                                <span>{activity.date}</span>
                            </div>
                            <p className={classes.details}>{activity.description}</p>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginTop: "1vh",
                                }}
                            >
                                <div className={classes.rating}>
                                    {"★".repeat(activity.rating)}
                                    <span style={{ color: "#666" }}>
                                        ({activity.reviews})
                                    </span>
                                </div>
                                <div className={classes.seats}>
                                    {activity.seats} Available Seats
                                </div>
                                <div style={{ fontWeight: "bold" }}>
                                    USD {activity.price}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimelineN;
