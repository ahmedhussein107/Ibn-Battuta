import React, { useState, useEffect } from "react";

const LandmarkTimes = ({ times, width = "100%", fontSize = "0.8rem" }) => {
    const getHour = (dateString) => {
        const date = new Date(dateString);
        let hours = date.getUTCHours();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours}${ampm}`;
    };

    function getNext(dayName) {
        // List of days in order, starting from Sunday
        const daysOfWeek = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];

        // Get the current date and day index
        const today = new Date();
        const todayIndex = today.getDay();

        // Find the index of the given day name
        const targetIndex = daysOfWeek.indexOf(dayName);

        // Calculate how many days to add to reach the target day
        let daysToAdd = (targetIndex - todayIndex + 7) % 7;
        if (daysToAdd === 0) daysToAdd = 7; // If the day is today, return the next occurrence

        // Calculate the date of the next occurrence
        const nextDate = new Date();
        nextDate.setDate(today.getDate() + daysToAdd);

        return nextDate.getDate();
    }

    const daysOfWeek = Object.keys(times).map((day) => {
        return {
            day: day.toString(),
            open: getHour(times[day].open),
            close: getHour(times[day].close),
        };
    });

    const [selectedDay, setSelectedDay] = useState({
        day: "",
        open: "",
        close: "",
    });
    const [isOpenNow, setIsOpenNow] = useState(false);

    useEffect(() => {
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
    }, [selectedDay]);

    return (
        <div
            style={{
                padding: "2%", // Use percentage for padding to make it responsive
                fontFamily: "Arial, sans-serif",
                width: width, // Use the width prop
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1%", // Use percentage for margin
                }}
            >
                <div style={{ fontSize: fontSize }}>
                    <span role="img" aria-label="clock">
                        🕒
                    </span>
                    {selectedDay.day
                        ? `OPEN HOURS from ${selectedDay.open} to ${selectedDay.close}`
                        : "No Day is selected yet"}
                </div>
                <div
                    style={{
                        padding: "0.5% 1%", // Use percentage for padding
                        backgroundColor: isOpenNow ? "#FFC107" : "#E0E0E0",
                        color: "#FFFFFF",
                        borderRadius: "5px",
                        fontFamily: "Inika",
                    }}
                >
                    {isOpenNow ? "OPEN NOW" : "CLOSED"}
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    gap: "1%",
                    flexWrap: "wrap",
                    alignItems: "center",
                }}
            >
                {daysOfWeek.map((day, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedDay(day)}
                        style={{
                            cursor: "pointer",
                            textAlign: "center",
                            padding: "0.9em",
                            borderRadius: "5px",
                            backgroundColor:
                                day.day === selectedDay.day ? "#FFC107" : "#F5F5F5",
                            color: "#000",
                            transition: "background-color 0.3s",
                        }}
                    >
                        <div
                            style={{
                                fontWeight:
                                    day.day === selectedDay.day ? "bold" : "normal",
                                fontSize: fontSize,
                            }}
                        >
                            <p
                                style={{
                                    color:
                                        day.day === selectedDay.day
                                            ? "#FFFFFF"
                                            : "#FFC107",
                                }}
                            >
                                {day.day.slice(0, 3)}
                            </p>
                            <p
                                style={{
                                    color:
                                        day.day === selectedDay.day
                                            ? "#FFFFFF"
                                            : "#BBBBBB",
                                }}
                            >
                                {getNext(day.day)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LandmarkTimes;
