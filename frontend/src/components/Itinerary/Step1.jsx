import React, { useState } from "react";
import Timeline from "../Timeline";
import MyForm from "../MyForm";
import PopUp from "../PopUpsGeneric/PopUp";
import CardCustomActivity from "../CardCustomActivity";
import Button from "../Button";
import { useNavigate } from "react-router-dom";

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
    currency,
    setCurrency,
    formattedDate,
    setFormattedDate,
    formattedTime,
    setFormattedTime,
    showPopupMessage,
    processing,
    setIsProcessing,
    isEdit,
}) => {
    const [showMorePopupOpen, setShowMorePopupOpen] = useState(false);
    const [showMoreCustomActivty, setShowMoreCustomActivty] = useState(null);

    const navigate = useNavigate();

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
                        width: "40vw",
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

    const handleCreate = async (e) => {
        e.preventDefault();

        if (!name || !description || !formattedDate || !formattedTime || !price) {
            console.log("popup does not work");
            showPopupMessage("Please fill out all required details.", true);
            return;
        }

        if (tags.length === 0) {
            showPopupMessage("Please select at least one tag.", true);
            return;
        }

        try {
            await handleSubmit();

            showPopupMessage(
                `Activity ${isEdit ? "updated" : "created"} successfully!`,
                false
            );

            setTimeout(() => navigate("/tourguide/assigned"), 1000);
        } catch (error) {
            console.error("Error creating activity:", error);
            setIsProcessing(false);
            showPopupMessage(
                error.response?.data?.message ||
                    "Error creating activity. Please try again.",
                true
            );
        }
    };

    return (
        <div
            style={{
                width: "95%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
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
                        currency={currency}
                        setCurrency={setCurrency}
                        formattedDate={formattedDate}
                        setFormattedDate={(value) => {
                            setFormattedDate(value);
                        }}
                        formattedTime={formattedTime}
                        setFormattedTime={(value) => {
                            setFormattedTime(value);
                        }}
                        showPopupMessage={showPopupMessage}
                        processing={processing}
                        isEdit={isEdit}
                    />
                </div>
                <div style={{ width: "35%" }}>
                    <Timeline
                        setStep={setStep}
                        timelineActivities={timelineActivities}
                        setTimelineActivities={setTimelineActivities}
                        pickupLocation={pickupLocation.location}
                        pickupTime={startDate}
                        dropOffLocation={dropoffLocation.location}
                        setShowMorePopupOpen={setShowMorePopupOpen}
                        setShowMoreCustomActivity={setShowMoreCustomActivty}
                        showPopupMessage={showPopupMessage}
                    />
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    width: "60%",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Button
                    stylingMode="dark-when-hovered"
                    text="Cancel"
                    handleClick={() => {
                        navigate(-1);
                    }}
                    width="auto"
                />
                <Button
                    stylingMode="always-dark"
                    text={isEdit ? "Update Itinerary" : "Create Itinerary"}
                    isLoading={processing}
                    handleClick={handleCreate}
                    width="auto"
                />
            </div>
        </div>
    );
};

export default Step1;
