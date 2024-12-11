import React, { useEffect, useState } from "react";
import PopUp from "../PopUpsGeneric/PopUp";
import { createUseStyles } from "react-jss";
import PhotosUpload from "../PhotosUpload";
import axiosInstance from "../../api/axiosInstance";
import { uploadFiles } from "../../api/firebase";
import CardActivity from "../CardActivity";
import CardCustomActivity from "../CardCustomActivity";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SideBar from "../../components/SideBar/SideBar";
import SearchField from "../../components/SearchField/SearchField";
import Sorter from "../../components/Sorter";
import RatingRange from "../../components/RatingRange";
import CheckboxList from "../../components/CheckBoxList";
import { Alert } from "@mui/material";
import Button from "../Button";
import LocationAdder from "../LocationAdder";
import MapPopUp from "../MapPopUp";
import { TimeModalContent } from "../TimeModal";
import { DateModalContent } from "../DateModal";

const Step2 = ({ setStep, convertedDate, timelineActivities, setTimelineActivities }) => {
    const [activeTab, setActiveTab] = useState("Activity");
    const [activities, setActivities] = useState([]);
    const [customActivities, setCustomActivities] = useState([]);

    const [createCustomActivityPopupOpen, setCreateCustomActivityPopupOpen] =
        useState(false);
    const [showMorePopupOpen, setShowMorePopupOpen] = useState(false);
    const [showMoreCustomActivty, setShowMoreCustomActivity] = useState(false);
    const [selectTimeIntervalOpen, setSelectTimeIntervalOpen] = useState(false);
    const [mapPopupOpen, setMapPopupOpen] = useState(false);
    const [mapFunction, setMapFunction] = useState(null);

    useEffect(() => {
        if (mapFunction) setMapPopupOpen(true);
    }, [mapFunction]);

    const [selectedActivity, setSelectedActivity] = useState(null);

    const [tags, setTags] = useState([""]);
    const [categories, setCategories] = useState([""]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [ratingRange, setRatingRange] = useState([null, 5]);
    const [sortBy, setSortBy] = useState("priceAsc");
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");

    const [error, setError] = useState(null);

    const classes = useStyles();

    const fetchTags = async () => {
        try {
            const response = await axiosInstance.get(`/tag/allTags/`);
            let tags = [];
            for (let tag of response.data) {
                tags.push(tag._id);
            }
            setTags(tags);
        } catch (error) {
            console.error("Error fetching Tags:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get(`/category/allCategories/`);
            let categs = [];
            for (let category of response.data) {
                categs.push(category._id);
            }
            setCategories(categs);
        } catch (error) {
            console.error("Error fetching Categories:", error);
        }
    };

    useEffect(() => {
        fetchTags();
        fetchCategories();
    }, []);

    const fetchActivities = async () => {
        try {
            const query = buildQuery();
            const response = await axiosInstance.get(
                "/activity/getUpcomingActivities/",
                { params: query },
                {
                    withCredentials: true,
                }
            );
            const data = response.data;
            console.log("activities", data);
            setActivities(data.result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchCustomActivities = async () => {
        try {
            const query = buildQuery();
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

    useEffect(() => {
        if (activeTab === "Activity") {
            console.log("refetching activities");
            fetchActivities();
        } else {
            console.log("custom activities");
            fetchCustomActivities();
        }
    }, [selectedTags, selectedCategories, ratingRange, name, location, sortBy]);

    useEffect(() => {
        setSelectedCategories([]);
        setSelectedTags([]);
        setRatingRange([null, 5]);
        setSortBy("priceAsc");
        setName("");
        setLocation("");
    }, [activeTab]);

    const addActivityToTimeline = (activity) => {
        let newTimeline = [...timelineActivities];
        if (newTimeline.length === 0) {
            setTimelineActivities([activity]);
            return true;
        }
        if (activity.endTime <= newTimeline[0].startTime) {
            setTimelineActivities([activity, ...newTimeline]);
            return true;
        }
        const lastActivity = newTimeline[newTimeline.length - 1];
        if (activity.startTime >= lastActivity.endTime) {
            setTimelineActivities([...newTimeline, activity]);
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
                return true;
            }
        }
        return false;
    };

    const SelectTimeInervalPopup = () => {
        if (!selectTimeIntervalOpen) return null;

        const [startTime, setStartTime] = useState("");
        const [endTime, setEndTime] = useState("");

        const [startDate, setStartDate] = useState(null);
        const [endDate, setEndDate] = useState(null);

        const convertTo24System = (timeObj) => {
            const [time, period] = timeObj.split(" ");
            let [hours, minutes] = time.split(":").map(Number);
            if (period == "PM" && hours < 12) hours += 12;
            if (period == "AM" && hours === 12) hours = 0;
            return { hours, minutes };
        };

        const handleStartTimeChange = (start) => {
            if (!startDate) return;
            const parsedStartTime = convertTo24System(start);
            let newStartDate = new Date(startDate);
            newStartDate.setHours(parsedStartTime.hours, parsedStartTime.minutes);
            setStartDate(newStartDate);
            setStartTime(start);
        };

        const handleStartDateChange = (start) => {
            let newStartDate = new Date(start);
            if (startTime) {
                const parsedStartTime = convertTo24System(startTime);
                newStartDate.setHours(parsedStartTime.hours, parsedStartTime.minutes);
            }
            setStartDate(newStartDate);
        };

        const handleEndTimeChange = (end) => {
            if (!endDate) return;
            const parsedEndTime = convertTo24System(end);
            let newEndDate = new Date(endDate);
            newEndDate.setHours(parsedEndTime.hours, parsedEndTime.minutes);
            setEndDate(newEndDate);
            setEndTime(end);
        };

        const handleEndDateChange = (end) => {
            let newEndDate = new Date(end);
            if (endTime) {
                const parsedEndTime = convertTo24System(endTime);
                newEndDate.setHours(parsedEndTime.hours, parsedEndTime.minutes);
            }
            setEndDate(newEndDate);
        };

        const handleSubmit = () => {
            if (!startDate || !endDate) {
                alert("select the time interval!!!!!");
                return;
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
            setStep(1);
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
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            padding: "2em",
                            width: "90%",
                            overflowY: "auto",
                            justifyContent: "center",
                            gap: "2vh",
                        }}
                    >
                        <DateModalContent
                            startDate={startDate}
                            endDate={null}
                            onDatesChange={handleStartDateChange}
                        />
                        <TimeModalContent
                            startTime={startTime}
                            endTime={startTime}
                            onTimesChange={handleStartTimeChange}
                            title={"Select Start Time"}
                            showEndTime={false}
                            showButtons={false}
                        />
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            padding: "2em",
                            width: "90%",
                            overflowY: "auto",
                            justifyContent: "center",
                            gap: "2vh",
                        }}
                    >
                        <DateModalContent
                            startDate={endDate}
                            endDate={null}
                            onDatesChange={handleEndDateChange}
                            placeholderText="End Date"
                        />
                        <TimeModalContent
                            startTime={endTime}
                            endTime={endTime}
                            onTimesChange={handleEndTimeChange}
                            title={"Select End Time"}
                            showEndTime={false}
                            showButtons={false}
                        />
                    </div>
                </div>
            </PopUp>
        );
    };

    const [actLocation, setActLocation] = useState({
        latitude: 0,
        longitude: 0,
        location: "",
    });

    const CreateCustomActivityPopup = ({ popUpOpen, setPopUpOpen }) => {
        const [name, setName] = useState("");
        const [description, setDescription] = useState("");
        const [isLoading, setIsLoading] = useState(false);

        const [imagePreviews, setImagePreviews] = useState([]);

        const handleSubmit = async () => {
            try {
                const data = {
                    name,
                    description,
                    Longitude: actLocation.longitude,
                    Latitude: actLocation.latitude,
                    location: actLocation.location,
                };

                setIsLoading(true);

                const pictures = await uploadFiles(
                    imagePreviews.map((preview) => preview.file),
                    `customActivities/${name}`
                );

                data.pictures = pictures;
                const response = await axiosInstance.post(
                    "/customActivity/createCustomActivity",
                    data,
                    {
                        withCredentials: true,
                    }
                );
                setCustomActivities((prev) => [...prev, response.data]);
                setPopUpOpen(false);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        };
        const handleImageAdd = (newImages) => {
            setImagePreviews((prev) => [...prev, ...newImages]);
        };

        const handleImageRemove = (idToRemove) => {
            setImagePreviews((prev) => prev.filter((image) => image.id !== idToRemove));
        };

        return (
            <>
                <PopUp
                    isOpen={popUpOpen}
                    setIsOpen={setPopUpOpen}
                    headerText={"Create new Custom Activity"}
                    containsActionButton={false}
                    containsFooter={false}
                >
                    <div
                        style={{
                            marginBottom: "2vh",
                            width: "50vw",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                width: "80%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "55%",
                                }}
                            >
                                <label
                                    style={{
                                        display: "block",
                                        marginBottom: "0.5vh",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Name*
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Insert title here..."
                                    style={{
                                        width: "100%",
                                        padding: "1vh",
                                        borderRadius: "1vh",
                                        border: "0.1vh solid #ccc",
                                    }}
                                />
                                <label
                                    style={{
                                        display: "block",
                                        marginBottom: "0.5vh",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Description*
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Insert description here..."
                                    style={{
                                        width: "100%",
                                        padding: "1vh",
                                        borderRadius: "1vh",
                                        border: "0.1vh solid #ccc",
                                        resize: "vertical",
                                    }}
                                />
                                <div style={{ width: "100%" }}>
                                    <LocationAdder
                                        title={"activity location"}
                                        location={actLocation}
                                        setLocation={setActLocation}
                                        setMapFunction={setMapFunction}
                                    />
                                </div>
                                <Button
                                    stylingMode="always-dark"
                                    text="Create Itinerary"
                                    isLoading={isLoading}
                                    customStyle={{ marginTop: "2vh" }}
                                    handleClick={handleSubmit}
                                />
                            </div>
                            <PhotosUpload
                                label="Activity Photos"
                                imagePreviews={imagePreviews}
                                onImageAdd={handleImageAdd}
                                onImageRemove={handleImageRemove}
                            />
                        </div>
                    </div>
                </PopUp>
            </>
        );
    };

    const buildQuery = () => {
        let query = {};

        if (activeTab === "Activity") {
            if (selectedTags && selectedTags.length > 0) {
                query.tags = selectedTags.join("|");
            } else {
                delete query.tags;
            }

            if (selectedCategories && selectedCategories.length > 0) {
                query.category = selectedCategories.join("|");
            } else {
                delete query.category;
            }

            if (ratingRange[0] || ratingRange[1]) {
                if (!ratingRange[0]) {
                    query.rating = "-" + ratingRange[1];
                } else {
                    query.rating = ratingRange[0] + "-" + ratingRange[1];
                }
            } else {
                delete query.rating;
            }

            const startDate = new Date(convertedDate);
            const dateRange = startDate.toISOString() + "€";
            query.startDate = dateRange;

            query.sortBy = sortBy;
        }

        if (name) {
            query.name = "~" + name;
        } else {
            delete query.name;
        }

        if (location) {
            query.location = "~" + location;
        } else {
            delete query.location;
        }

        return query;
    };

    const nonCollapsibleItems = [
        <SearchField
            placeholder="Search by name"
            searchText={name}
            setSearchText={setName}
        />,
    ];
    const titles =
        activeTab === "Activity"
            ? ["Sort By", "Locations", "Rating Range", "Tags", "Category"]
            : ["Locations"];
    const collapsibleItems =
        activeTab === "Activity"
            ? [
                  <Sorter
                      values={["priceAsc", "priceDesc", "ratingAsc", "ratingDesc"]}
                      labels={[
                          "Price (Low to High)",
                          "Price (High to Low)",
                          "Rating (Low to High)",
                          "Rating (How to Low)",
                      ]}
                      value={sortBy}
                      setValue={setSortBy}
                  />,
                  <SearchField
                      placeholder="Search by location"
                      searchText={location}
                      setSearchText={setLocation}
                  />,
                  <RatingRange
                      ratingRange={ratingRange}
                      setRatingRange={setRatingRange}
                  />,
                  <CheckboxList
                      items={tags}
                      checkedItems={selectedTags}
                      setCheckedItems={setSelectedTags}
                  />,
                  <CheckboxList
                      items={categories}
                      checkedItems={selectedCategories}
                      setCheckedItems={setSelectedCategories}
                  />,
              ]
            : [
                  <SearchField
                      placeholder="Search by location"
                      searchText={location}
                      setSearchText={setLocation}
                  />,
              ];

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2vh",
            }}
        >
            <MapPopUp
                popUpOpen={mapPopupOpen}
                setPopUpOpen={setMapPopupOpen}
                mapFunction={mapFunction}
            />

            {createCustomActivityPopupOpen && !mapPopupOpen && (
                <div style={{ width: "100%" }}>
                    <CreateCustomActivityPopup
                        popUpOpen={createCustomActivityPopupOpen}
                        setPopUpOpen={setCreateCustomActivityPopupOpen}
                    />
                </div>
            )}

            <SelectTimeInervalPopup />
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                }}
            >
                <div style={{ width: "30%", marginTop: "2%" }}>
                    <SideBar
                        collapsibleItems={collapsibleItems}
                        nonCollapsibleItems={nonCollapsibleItems}
                        titles={titles}
                    />
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
            {error && <Alert severity="error">{error}</Alert>}
            <Button
                stylingMode="always-light"
                text="Cancel"
                handleClick={() => {
                    setStep(1);
                }}
                width="10%"
                customStyle={{ marginBottom: "2vh" }}
            />
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
        backgroundColor: "white",
        boxShadow: "2px 4px 4px 2px rgba(156, 79, 33, 0.2)",
        borderRadius: "10px",
        padding: "2vh 1vw",
        alignItems: "center",
        width: "60vw",
        maxHeight: "100vh",
        overflow: "auto",
        marginLeft: "1vw",
        marginTop: "2%",
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

export default Step2;
