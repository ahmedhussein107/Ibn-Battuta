import React, { useState } from "react";
import Timeline from "../Timeline";
import MyForm from "../MyForm";

const Step1 = ({
    setStep,
    timelineActivities,
    setTimelineActivities,
    name,
    setName,
    price,
    setPrice,
    description,
    setDescription,
    pickupLocation,
    setPickupLocation,
    dropoffLocation,
    setDropoffLocation,
    startDate,
    setStartDate,
    tags,
    setTags,
    accessibility,
    setAccessibility,
    language,
    setLanguage,
    handleSubmit,
}) => {
    const [showMorePopupOpen, setShowMorePopupOpen] = useState(false);
    const [showMoreCustomActivty, setShowMoreCustomActivty] = useState(null);

    const CustomActivityPopup = () => {
        if (!showMoreCustomActivty) return null;

        return (
            <PopUp
                isOpen={showMorePopupOpen}
                setIsOpen={setShowMorePopupOpen}
                headerText={showMoreCustomActivty.name}
                containsFooter={false}
                width={"1vw"}
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

    return (
        <div
            style={{
                width: "95%",
                height: "100%",
            }}
        >
            {showMorePopupOpen && <CustomActivityPopup />}
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    marginTop: "2%",
                    marginBottom: "2%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "space-around",
                }}
            >
                <div style={{ width: "50%" }}>
                    <MyForm
                        name={name}
                        setName={setName}
                        price={price}
                        setPrice={setPrice}
                        description={description}
                        setDescription={setDescription}
                        pickupLocation={pickupLocation}
                        setPickupLocation={setPickupLocation}
                        dropoffLocation={dropoffLocation}
                        setDropoffLocation={setDropoffLocation}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        tags={tags}
                        setTags={setTags}
                        accessibility={accessibility}
                        setAccessibility={setAccessibility}
                        language={language}
                        setLanguage={setLanguage}
                        handleSubmit={handleSubmit}
                    />
                </div>
                <div style={{ width: "30%" }}>
                    <Timeline
                        setStep={setStep}
                        timelineActivities={timelineActivities}
                        setTimelineActivities={setTimelineActivities}
                        pickupLocation={pickupLocation.location}
                        pickupTime={startDate}
                        dropOffLocation="drop off location"
                        setShowMorePopupOpen={setShowMorePopupOpen}
                        setShowMoreCustomActivity={setShowMoreCustomActivty}
                    />
                </div>
            </div>
        </div>
    );
};

export default Step1;
