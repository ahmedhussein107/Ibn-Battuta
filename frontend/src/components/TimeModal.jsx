import React, { useState } from "react";

const TimeModal = ({ isOpen, onClose, startTime, endTime, onTimesChange }) => {
    const [startHour, setStartHour] = useState(
        startTime ? parseInt(startTime.split(":")[0]) : "1"
    );
    const [startMinute, setStartMinute] = useState(
        startTime ? parseInt(startTime.split(":")[1]) : "0"
    );
    const [startPeriod, setStartPeriod] = useState("AM");
    const [endHour, setEndHour] = useState(
        endTime ? parseInt(endTime.split(":")[0]) : "1"
    );
    const [endMinute, setEndMinute] = useState(
        endTime ? parseInt(endTime.split(":")[1]) : "0"
    );
    const [endPeriod, setEndPeriod] = useState("AM");

    // Validation functions
    const validateHour = (value) => {
        const numericValue = value.replace(/[^0-9]/g, "");
        const hour = parseInt(numericValue);
        if (value === "") return "";
        if (hour < 1) return "1";
        if (hour > 12) return "12";
        return numericValue;
    };

    const validateMinute = (value) => {
        const numericValue = value.replace(/[^0-9]/g, "");
        const minute = parseInt(numericValue);
        if (value === "") return "";
        if (minute < 0) return "0";
        if (minute > 59) return "59";
        return numericValue;
    };

    const handleTimeChange = () => {
        const newStartTime = `${startHour}:${startMinute} ${startPeriod}`;
        const newEndTime = `${endHour}:${endMinute} ${endPeriod}`;
        onTimesChange(newStartTime, newEndTime);
    };

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "1.5rem",
                    padding: "2rem",
                    width: "90%",
                    maxWidth: "40rem",
                    boxShadow: "0 0.5rem 2rem rgba(0, 0, 0, 0.1)",
                    position: "relative",
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "1.5rem",
                        right: "1.5rem",
                        background: "none",
                        border: "none",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                        color: "#333",
                    }}
                >
                    ×
                </button>

                {/* Start Time Section */}
                <div style={{ marginBottom: "2rem" }}>
                    <h3
                        style={{
                            color: "#666",
                            fontSize: "1rem",
                            fontWeight: "400",
                            marginBottom: "1.5rem",
                        }}
                    >
                        ENTER START TIME
                    </h3>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.5rem",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                            }}
                        >
                            <input
                                type="text"
                                value={startHour}
                                onChange={(e) =>
                                    setStartHour(validateHour(e.target.value))
                                }
                                maxLength={2}
                                style={{
                                    width: "3rem",
                                    height: "3rem",
                                    border: "1px solid #9C4F21",
                                    borderRadius: "0.5rem",
                                    fontSize: "1.5rem",
                                    textAlign: "center",
                                    outline: "none",
                                }}
                            />
                            <span style={{ fontSize: "1.5rem", color: "#333" }}>:</span>
                            <input
                                type="text"
                                value={startMinute}
                                onChange={(e) =>
                                    setStartMinute(validateMinute(e.target.value))
                                }
                                maxLength={2}
                                style={{
                                    width: "3rem",
                                    height: "3rem",
                                    border: "none",
                                    borderRadius: "0.5rem",
                                    fontSize: "1.5rem",
                                    textAlign: "center",
                                    backgroundColor: "#f0f0f0",
                                    outline: "none",
                                }}
                            />
                            <div style={{ marginLeft: "1rem" }}>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <button
                                        type="button"
                                        onClick={() => setStartPeriod("AM")}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            border: "none",
                                            borderRadius: "0.5rem",
                                            backgroundColor:
                                                startPeriod === "AM"
                                                    ? "#FCF3E2"
                                                    : "white",
                                            color:
                                                startPeriod === "AM" ? "#9C4F21" : "#666",
                                            cursor: "pointer",
                                        }}
                                    >
                                        AM
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStartPeriod("PM")}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            border: "none",
                                            borderRadius: "0.5rem",
                                            backgroundColor:
                                                startPeriod === "PM"
                                                    ? "#FCF3E2"
                                                    : "white",
                                            color:
                                                startPeriod === "PM" ? "#9C4F21" : "#666",
                                            cursor: "pointer",
                                        }}
                                    >
                                        PM
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* End Time Section */}
                <div>
                    <h3
                        style={{
                            color: "#666",
                            fontSize: "1rem",
                            fontWeight: "400",
                            marginBottom: "1.5rem",
                        }}
                    >
                        ENTER END TIME
                    </h3>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.5rem",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                            }}
                        >
                            <input
                                type="text"
                                value={endHour}
                                onChange={(e) => setEndHour(validateHour(e.target.value))}
                                maxLength={2}
                                style={{
                                    width: "3rem",
                                    height: "3rem",
                                    border: "1px solid #9C4F21",
                                    borderRadius: "0.5rem",
                                    fontSize: "1.5rem",
                                    textAlign: "center",
                                    outline: "none",
                                }}
                            />
                            <span style={{ fontSize: "1.5rem", color: "#333" }}>:</span>
                            <input
                                type="text"
                                value={endMinute}
                                onChange={(e) =>
                                    setEndMinute(validateMinute(e.target.value))
                                }
                                maxLength={2}
                                style={{
                                    width: "3rem",
                                    height: "3rem",
                                    border: "none",
                                    borderRadius: "0.5rem",
                                    fontSize: "1.5rem",
                                    textAlign: "center",
                                    backgroundColor: "#f0f0f0",
                                    outline: "none",
                                }}
                            />
                            <div style={{ marginLeft: "1rem" }}>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <button
                                        type="button"
                                        onClick={() => setEndPeriod("AM")}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            border: "none",
                                            borderRadius: "0.5rem",
                                            backgroundColor:
                                                endPeriod === "AM" ? "#FCF3E2" : "white",
                                            color:
                                                endPeriod === "AM" ? "#9C4F21" : "#666",
                                            cursor: "pointer",
                                        }}
                                    >
                                        AM
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEndPeriod("PM")}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            border: "none",
                                            borderRadius: "0.5rem",
                                            backgroundColor:
                                                endPeriod === "PM" ? "#FCF3E2" : "white",
                                            color:
                                                endPeriod === "PM" ? "#9C4F21" : "#666",
                                            cursor: "pointer",
                                        }}
                                    >
                                        PM
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "1rem",
                        marginTop: "2rem",
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            padding: "0.5rem 1rem",
                            border: "none",
                            backgroundColor: "transparent",
                            color: "#9C4F21",
                            cursor: "pointer",
                            fontSize: "1rem",
                        }}
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={() => {
                            handleTimeChange();
                            onClose();
                        }}
                        style={{
                            padding: "0.5rem 1rem",
                            border: "none",
                            backgroundColor: "transparent",
                            color: "#9C4F21",
                            cursor: "pointer",
                            fontSize: "1rem",
                        }}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimeModal;
