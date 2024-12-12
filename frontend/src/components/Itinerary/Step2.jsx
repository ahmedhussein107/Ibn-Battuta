import React, { useEffect, useState } from "react";
import PopUp from "../PopUpsGeneric/PopUp";
import { createUseStyles } from "react-jss";
import PhotosUpload from "../PhotosUpload";
import axiosInstance from "../../api/axiosInstance";
import { uploadFiles } from "../../api/firebase";
import CardActivity from "../CardActivity";
import CardCustomActivity from "../CardCustomActivity";
import SideBar from "../../components/SideBar/SideBar";
import SearchField from "../../components/SearchField/SearchField";
import Sorter from "../../components/Sorter";
import RatingRange from "../../components/RatingRange";
import CheckboxList from "../../components/CheckBoxList";
import { Alert, TextField } from "@mui/material";
import Button from "../Button";
import LocationAdder from "../LocationAdder";
import MapPopUp from "../MapPopUp";
import { TimeModalContent } from "../TimeModal";
import { DateModalContent } from "../DateModal";
import FilterButtons from "../FilterButtons";

const Step2 = ({
    setStep,
    convertedDate,
    timelineActivities,
    setTimelineActivities,
    showPopupMessage,
}) => {
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
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [SeverError, setServerError] = useState("");
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
                showPopupMessage("Please select start and end time", true);
                return;
            }

            if (endDate < startDate) {
                showPopupMessage("The end time must be after the start time", true);
                return;
            }

            if (startDate < convertedDate) {
                showPopupMessage("The start time must be after the pickup time", true);
                return;
            }

            console.log({
                activityType: activeTab.replace(/\s+/g, ""),
                activity: selectedActivity,
                startTime: startDate,
                endTime: endDate,
            });

            if (activeTab === "Activity") {
                const activityStartDate = new Date(selectedActivity.startDate);
                const activityEndDate = new Date(selectedActivity.endDate);

                if (startDate < activityStartDate || endDate > activityEndDate) {
                    showPopupMessage(
                        "the selected time interval is not valid for this activity!",
                        true
                    );
                    setSelectTimeIntervalOpen(false);
                    return;
                }
            }
            if (
                !addActivityToTimeline({
                    activityType: activeTab.split(" ").join(""),
                    activity: selectedActivity,
                    startTime: startDate,
                    endTime: endDate,
                })
            ) {
                showPopupMessage(
                    "the selected time interval is not valid for this activity!",
                    true
                );
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
        const [customActivityName, setCustomActivityName] = useState(
            localStorage.getItem("customActivityName") || ""
        );
        const [description, setDescription] = useState(
            localStorage.getItem("description") || ""
        );
        const [isCreationProcessing, setIsCreationProcessing] = useState(false);

        const [imagePreviews, setImagePreviews] = useState(
            localStorage.getItem("imagePreviews")
                ? JSON.stringify(localStorage.getItem("imagePreviews"))
                : []
        );
        const handleSubmit = async (e) => {
            e.preventDefault();

            try {
                if(name ===""){
                    alert("Please enter activty name");
                    return;
                }
                if(description ===""){
                    alert("Please enter activty description");
                    return;
                }
                const data = {
                    name: customActivityName,
                    description,
                    Longitude: actLocation.longitude,
                    Latitude: actLocation.latitude,
                    location: actLocation.location,
                };

                setIsCreationProcessing(true);

                const pictures = await uploadFiles(
                    imagePreviews.map((preview) => preview.file),
                    `customActivities/${customActivityName}`
                );

                data.pictures = pictures;
                if (data.pictures.length === 0) {
                    setAlertMessage("Please upload at least one image");
                    setShowAlert(true);
                    setServerError("info");
                    setTimeout(() => {
                        setShowAlert(false);
                    }, 5000);
                    return;
                }
                if (!data.name || !data.description || !data.location) {
                    setAlertMessage("Please fill in all the required fields");
                    setShowAlert(true);
                    setServerError("error");
                    setTimeout(() => {
                        setShowAlert(false);
                    }, 5000);
                    return;
                }
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
                setIsCreationProcessing(false);
            }
        };
        const handleImageAdd = (addedImages) => {
            const newImages = [...imagePreviews, ...addedImages];
            setImagePreviews(newImages);
            localStorage.setItem("imagePreviews", JSON.stringify(newImages));
        };

        const handleImageRemove = (idToRemove) => {
            const newImages = imagePreviews.filter((image) => image.id !== idToRemove);
            setImagePreviews(newImages);
            localStorage.setItem("imagePreviews", JSON.stringify(newImages));
        };

        return (
            <>
                {showAlert && (
                    <Alert
                        severity={SeverError}
                        onClose={() => setShowAlert(false)}
                        style={{
                            position: "fixed",
                            right: "1%",
                            bottom: "1%",
                            width: "25vw",
                            fontSize: "1.2rem",
                            zIndex: 9000,
                        }}
                    >
                        {alertMessage}
                    </Alert>
                )}
                <PopUp
                    isOpen={popUpOpen}
                    setIsOpen={setPopUpOpen}
                    headerText={"Create New Custom Activity"}
                    containsActionButton={false}
                    containsFooter={false}
                >
                    <div
                        style={{
                            width: "30vw",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            maxHeight: "70vh",
                            overflowY: "auto",
                        }}
                    >
                        <div style={{ width: "80%", marginBottom: "1vh" }}>
                            <PhotosUpload
                                label="Activity Photos"
                                imagePreviews={imagePreviews}
                                onImageAdd={handleImageAdd}
                                onImageRemove={handleImageRemove}
                            />
                        </div>

                        <div
                            style={{
                                width: "80%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <label
                                style={{
                                    fontWeight: "bold",
                                    marginBottom: "0.5vh",
                                }}
                            >
                                Name*
                            </label>
                            <TextField
                                type="text"
                                value={customActivityName}
                                onChange={(e) => {
                                    setCustomActivityName(e.target.value);
                                    localStorage.setItem(
                                        "customActivityName",
                                        e.target.value
                                    );
                                }}
                                placeholder="Insert title here..."
                                style={{
                                    width: "100%",
                                    borderRadius: "1vh",
                                    margin: "0.5vh 0",
                                }}
                            />
                            <label
                                style={{
                                    display: "block",
                                    fontWeight: "bold",
                                    marginBottom: "0.5vh",
                                }}
                            >
                                Description*
                            </label>
                            <TextField
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    localStorage.setItem("description", e.target.value);
                                }}
                                placeholder="Insert description here..."
                                style={{
                                    width: "100%",
                                    borderRadius: "1vh",
                                    margin: "0.5vh 0",
                                    resize: "vertical",
                                }}
                            />
                            <div style={{ width: "100%", marginBottom: "1vh" }}>
                                <LocationAdder
                                    title={"Activity Location"}
                                    location={actLocation}
                                    setLocation={setActLocation}
                                    setMapFunction={setMapFunction}
                                />
                            </div>
                            <Button
                                stylingMode="always-dark"
                                text="Create Activity"
                                isLoading={isCreationProcessing}
                                customStyle={{ marginTop: "1vh" }}
                                handleClick={(e) => {
                                    handleSubmit(e);
                                }}
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
                minHeight: "50vh",
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
                        <FilterButtons
                            buttons={["Activity", "Custom Activity"]}
                            selected={activeTab}
                            handleChooseType={setActiveTab}
                            customStyle={{ gap: "1.3rem" }}
                            fontSize="1.2rem"
                        />
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

                        {activeTab === "Custom Activity" && (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    minHeight: "10vh",
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
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "1vw",
                                        marginBottom: "2vh",
                                    }}
                                >
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
                customStyle={{ marginBottom: "2vh", marginLeft: "32vw" }}
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
        padding: "0vh 1vw",
        alignItems: "center",
        width: "60vw",
        maxHeight: "100vh",
        overflow: "auto",
        marginLeft: "1vw",
        marginTop: "2%",
    },
    tabsContainer: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "4%",
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
        backgroundColor: "#FCF3E2",
        color: "black",
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
