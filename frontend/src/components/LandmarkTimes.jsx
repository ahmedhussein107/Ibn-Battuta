import React, { useState, useEffect } from "react";

const LandmarkTimes = () => {
    // Mock data for opening times, including closed days
    const daysOfWeek = [
        { day: "Mon", date: 21, open: "10AM", close: "8PM", closed: false },
        { day: "Tue", date: 22, open: "10AM", close: "7PM", closed: false },
        { day: "Wed", date: 23, open: "12AM", close: "10PM", closed: false },
        { day: "Thu", date: 24, open: "3PM", close: "9PM", closed: false },
        { day: "Fri", date: 25, open: "8AM", close: "8PM", closed: false },
        { day: "Sat", date: 26, closed: true },
        { day: "Sun", date: 27, closed: true },
    ];

    const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
    const [isOpenNow, setIsOpenNow] = useState(false);

    // Determine if the landmark is open based on the selected day
    useEffect(() => {
        if (selectedDay.closed) {
            setIsOpenNow(false);
        } else {
            const currentHour = new Date().getHours();
            const openHour =
                parseInt(selectedDay.open.replace("AM", "").replace("PM", "")) +
                (selectedDay.open.includes("PM") && !selectedDay.open.startsWith("12")
                    ? 12
                    : 0);
            const closeHour =
                parseInt(selectedDay.close.replace("AM", "").replace("PM", "")) +
                (selectedDay.close.includes("PM") && !selectedDay.close.startsWith("12")
                    ? 12
                    : 0);
            setIsOpenNow(currentHour >= openHour && currentHour < closeHour);
        }
    }, [selectedDay]);

    return (
        <div style={{ padding: "10px", fontFamily: "Arial, sans-serif" }}>
            {/* Display open hours and status */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                }}
            >
                <div>
                    <span role="img" aria-label="clock">
                        🕒
                    </span>{" "}
                    {selectedDay.closed
                        ? "Closed"
                        : `OPEN HOURS from ${selectedDay.open} to ${selectedDay.close}`}
                </div>
                <div
                    style={{
                        padding: "5px 10px",
                        backgroundColor: isOpenNow ? "#FFC107" : "#E0E0E0",
                        color: "#FFFFFF",
                        borderRadius: "5px",
                    }}
                >
                    {isOpenNow ? "OPEN NOW" : "CLOSED"}
                </div>
            </div>

            {/* Day selector */}
            <div style={{ display: "flex", gap: "10px" }}>
                {daysOfWeek.map((day, index) => (
                    <div
                        key={index}
                        onClick={() => {
                            setSelectedDay(day);
                            console.log(day.day + " ");
                            console.log(selectedDay.day);
                        }}
                        style={{
                            cursor: "pointer",
                            textAlign: "center",
                            padding: "10px",
                            borderRadius: "5px",
                            backgroundColor:
                                day.day === selectedDay.day && !day.closed
                                    ? "#FFC107"
                                    : "#F5F5F5",
                            color: day.closed ? "#BDBDBD" : "#000",
                            transition: "background-color 0.3s",
                        }}
                    >
                        <div
                            style={{
                                fontWeight: day === selectedDay ? "bold" : "normal",
                            }}
                        >
                            {day.day}
                        </div>
                        <div
                            style={{
                                fontSize: "12px",
                                color: day.closed ? "#BDBDBD" : "#757575",
                            }}
                        >
                            {day.date}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LandmarkTimes;
