import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaTrash, FaMapMarkerAlt as LocationIcon } from "react-icons/fa";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { createUseStyles } from "react-jss";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import CardActivity from "./CardActivity";
import CardCustomActivity from "./CardCustomActivity";
import CreateCustomActivityPopup from "./CreateCustomActivityPopup";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CustomButton from "./Button";
import PopUp from "./PopUpsGeneric/PopUp.jsx";

const TimelineN = ({ date, time }) => {
    const location = useLocation();

    const classes = useStyles();
    const [activeTab, setActiveTab] = useState("Activity");
    const [activities, setActivities] = useState([]);
    const [customActivities, setCustomActivities] = useState([]);
    const [timelineActivities, setTimelineActivities] = useState([]);
    const [convertedDate, setConvertedDate] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const [createCustomActivityPopupOpen, setCreateCustomActivityPopupOpen] =
        useState(false);

    const [showMorePopupOpen, setShowMorePopupOpen] = useState(false);
    const [showMoreCustomActivty, setShowMoreCustomActivity] = useState(false);
    const [selectTimeIntervalOpen, setSelectTimeIntervalOpen] = useState(false);

    useEffect(() => {
        if (!date || !time) return;
        const [year, month, day] = date.split("-").map(Number);
        const [hours, minutes] = time.split(":").map(Number);
        const convertedDate = new Date(year, month - 1, day, hours, minutes);
        setConvertedDate(convertedDate);
    }, [date, time]);

    useEffect(() => {
        if (!convertedDate) return;

        const startDate = new Date(convertedDate);
        const dateRange = startDate.toISOString() + "€";

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
    }, [convertedDate]);

    const addActivityToTimeline = (activity) => {
        const deleteActivityFromList = (activity) => {
            if (activity.activityType === "Activity") {
                const newActivities = activities.filter(
                    (act) => act._id !== activity.activity._id
                );
                setActivities(newActivities);
            } else if (activity.activityType === "CustomActivity") {
                const newActivities = customActivities.filter(
                    (act) => act._id !== activity.activity._id
                );
                setCustomActivities(newActivities);
            } else {
                console.log("What is this ??!!");
            }
        };
        let newTimeline = [...timelineActivities];
        if (newTimeline.length === 0) {
            setTimelineActivities([activity]);
            deleteActivityFromList(activity);
            return true;
        }
        if (activity.endTime <= newTimeline[0].startTime) {
            setTimelineActivities([activity, ...newTimeline]);
            deleteActivityFromList(activity);
            return true;
        }
        const lastActivity = newTimeline[newTimeline.length - 1];
        if (activity.startTime >= lastActivity.endTime) {
            setTimelineActivities([...newTimeline, activity]);
            deleteActivityFromList(activity);
            return true;
        }
        for (let i = 0; i + 1 < newTimeline.length; i++) {
            const currentActivity = newTimeline[i];
            const nextActivity = newTimeline[i + 1];
            if (
                activity.startTime >= currentActivity.endTime &&
                activity.endTime <= nextActivity.startTime
            ) {
                const updatedTimeline = [
                    ...newTimeline.slice(0, i + 1),
                    activity,
                    ...newTimeline.slice(i + 1),
                ];
                setTimelineActivities(updatedTimeline);
                deleteActivityFromList(activity);
                return true;
            }
        }
        return false;
    };

    const CustomActivityPopup = () => {
        if (!showMoreCustomActivty) return null;

        return (
            <PopUp
                isOpen={showMorePopupOpen}
                setIsOpen={setShowMorePopupOpen}
                headerText={showMoreCustomActivty.name}
                containsFooter={false}
            >
                <div
                    style={{
                        padding: "2em",
                        width: "90%",
                        maxHeight: "80vh",
                        overflowY: "auto",
                    }}
                >
                    <CardCustomActivity
                        activity={showMoreCustomActivty}
                        width="100%"
                        height="50vh"
                        firstLineButtons={[]}
                        bottomButtons={[]}
                    />
                </div>
            </PopUp>
        );
    };

    const SelectTimeInervalPopup = () => {
        if (!selectTimeIntervalOpen) return null;

        const [startTime, setStartTime] = useState("");
        const [endTime, setEndTime] = useState("");

        const handleSubmit = () => {
            if (!startTime || !endTime) {
                alert("select the time interval!!!!!");
                return;
            }
            let startDate = new Date(convertedDate);
            startDate.setHours(startTime.getHours(), startTime.getMinutes());
            let endDate = new Date(convertedDate);
            endDate.setHours(endTime.getHours(), endTime.getMinutes());
            if (endDate < startDate) {
                endDate.setHours(endDate.getHours() + 24); // to handle night events
            }
            console.log({
                activityType: activeTab,
                activity: selectedActivity,
                startTime: startDate,
                endTime: endDate,
            });
            if (activeTab === "Activity") {
                const activityStartDate = new Date(selectedActivity.startDate);
                const activityEndDate = new Date(selectedActivity.endDate);
                if (startDate < activityStartDate || endDate > activityEndDate) {
                    alert("the selected time interval is not valid for this activity!");
                    setSelectTimeIntervalOpen(false);
                    return;
                }
            }
            if (
                !addActivityToTimeline({
                    activityType: activeTab,
                    activity: selectedActivity,
                    startTime: startDate,
                    endTime: endDate,
                })
            ) {
                alert("the activity would intersect with another activity!");
            }
            setSelectTimeIntervalOpen(false);
        };

        return (
            <PopUp
                isOpen={selectTimeIntervalOpen}
                setIsOpen={setSelectTimeIntervalOpen}
                handleSubmit={handleSubmit}
                headerText="Set the time interval"
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1em",
                        alignItems: "center",
                    }}
                >
                    {activeTab == "Activity" && (
                        <p>
                            The Activity starts at{" "}
                            {new Date(selectedActivity.startDate).toLocaleString(
                                "en-US",
                                {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                }
                            )}{" "}
                            and ends at{" "}
                            {new Date(selectedActivity.endDate).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                            })}
                        </p>
                    )}
                </div>
                <div
                    style={{
                        display: "flex",
                        padding: "2em",
                        width: "90%",
                        overflowY: "auto",
                        justifyContent: "center",
                    }}
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoItem label="Start Time">
                            <StaticTimePicker
                                onChange={(e) => {
                                    console.log("start Date:", e.$d);
                                    setStartTime(e.$d);
                                }}
                            />
                        </DemoItem>
                        <DemoItem label="End Time">
                            <StaticTimePicker
                                onChange={(e) => {
                                    console.log("end Date:", e.$d);
                                    setEndTime(e.$d);
                                }}
                            />
                        </DemoItem>
                    </LocalizationProvider>
                </div>
            </PopUp>
        );
    };

    return (
        <>
            <CreateCustomActivityPopup
                popUpOpen={createCustomActivityPopupOpen}
                setPopUpOpen={setCreateCustomActivityPopupOpen}
            />
            <CustomActivityPopup />
            <SelectTimeInervalPopup />
            <div
                style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            >
                <div className={classes.pageContainer}>
                    <div className={classes.leftPanel}>
                        <div className={classes.container}>
                            <div className={classes.timelineItem}>
                                <div className={classes.pickupMarker}>
                                    <FaMapMarkerAlt className={classes.markerIcon} />
                                </div>
                                <div className={classes.timelineContent}>
                                    {/* TODO: Replace with actual pickup time */}
                                    <h3 className={classes.title}>Pickup</h3>
                                    <p className={classes.details}>
                                        7:00 am - Pickup Location
                                    </p>
                                </div>
                            </div>

                            <TransitionGroup>
                                {timelineActivities.map((activity, index) => (
                                    <CSSTransition
                                        key={index}
                                        timeout={300}
                                        classNames="scale"
                                    >
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
                                                    {activity.startTime.toLocaleString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                            hour: "numeric",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        }
                                                    )}
                                                </p>
                                                <p className={classes.details}>
                                                    {activity.endTime.toLocaleString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                            hour: "numeric",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        }
                                                    )}
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
                                                onClick={() =>
                                                    handleDeleteActivity(index)
                                                }
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
                                    <p className={classes.details}>
                                        Stratosphere Casino, Hotel & Tower, Park MGM Las
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={classes.activitiesList}>
                        <div className={classes.tabsContainer}>
                            <button
                                className={`${classes.tab} ${
                                    activeTab === "Activity"
                                        ? classes.activeTab
                                        : classes.inactiveTab
                                }`}
                                onClick={() => setActiveTab("Activity")}
                            >
                                Activities
                            </button>
                            <button
                                className={`${classes.tab} ${
                                    activeTab === "CustomActivity"
                                        ? classes.activeTab
                                        : classes.inactiveTab
                                }`}
                                onClick={() => setActiveTab("CustomActivity")}
                            >
                                Custom Activities
                            </button>
                        </div>

                        <div className={classes.cardsContainer}>
                            {activeTab === "Activity" &&
                                activities.map((activity) => (
                                    <CardActivity
                                        activity={activity}
                                        width={"55vw"}
                                        height={"30vh"}
                                        fontSize="0.8rem"
                                        iconSize="0.7rem"
                                        bottomButtons={[
                                            {
                                                text: "Add",
                                                onClick: () => {
                                                    setSelectedActivity(activity);
                                                    setSelectTimeIntervalOpen(true);
                                                },
                                                type: "always-dark",
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

                            {activeTab === "CustomActivity" && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "1vh",
                                    }}
                                >
                                    {customActivities.map((activity) => (
                                        <CardCustomActivity
                                            key={activity.id}
                                            activity={activity}
                                            width={"55vw"}
                                            height={"30vh"}
                                            fontSize="0.8rem"
                                            iconSize="0.7rem"
                                            bottomButtons={[
                                                {
                                                    text: "Add",
                                                    onClick: () => {
                                                        setSelectedActivity(activity);
                                                        setSelectTimeIntervalOpen(true);
                                                    },
                                                    type: "always-dark",
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
                                    <div style={{ display: "flex", gap: "1vw" }}>
                                        Don't see what you want?{" "}
                                        <p
                                            style={{
                                                color: "#4169E1",
                                                cursor: "pointer",
                                            }}
                                            onClick={() =>
                                                setCreateCustomActivityPopupOpen(true)
                                            }
                                        >
                                            Create a new custom activity
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        marginBottom: "2vh",
                    }}
                >
                    <CustomButton
                        stylingMode="always-light"
                        text="Previous"
                        handleClick={() => {
                            navigate(-1);
                        }}
                    />
                    <CustomButton
                        stylingMode="always-dark"
                        text="Create Itinerary"
                        handleClick={async () => {
                            let totalPrice = Number(location.state.price);
                            let picture =
                                "https://cdn-icons-png.flaticon.com/512/7603/7603006.png";
                            timelineActivities.forEach((activity) => {
                                if (activity.activityType === "Activity") {
                                    totalPrice += Number(activity.activity.price);
                                    if (activity.activity.picture) {
                                        picture = activity.activity.picture;
                                    }
                                }
                            });
                            console.log("picture", picture);
                            setIsLoading(true);
                            try {
                                const response = await axiosInstance.post(
                                    "/itinerary/createItinerary",
                                    {
                                        activities: timelineActivities,
                                        ...location.state,
                                        availableDatesAndTimes: [convertedDate],
                                        price: totalPrice,
                                        picture,
                                    },
                                    {
                                        withCredentials: true,
                                    }
                                );
                                console.log(response.data);
                                navigate("/tourguide/assigned");
                            } catch (error) {
                                console.error(error);
                                alert("Error creating itinerary");
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </>
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
        gap: "2vh",
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

export default TimelineN;
