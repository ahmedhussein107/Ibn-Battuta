import React from "react";

const ItineraryTimeline = () => {
    const itinerary = [
        { type: "pickup", time: "7:00 am", location: "Chillout" },
        { type: "activity", title: "Activity 1", time: "10:00 am" },
        { type: "activity", title: "Hoover Dam", details: "Photo stop (45 minutes)" },
        {
            type: "activity",
            title: "Grand Canyon West Rim",
            details: "Sightseeing (3 hours)",
        },
        {
            type: "activity",
            title: "Eagle Point",
            details: "Visit, Shopping, Sightseeing (1 hour)",
        },
        {
            type: "activity",
            title: "Guano Point",
            details: "Visit, Lunch, Sightseeing (1 hour)",
        },
        {
            type: "activity",
            title: "Arizona's Joshua Tree Forest",
            details: "Visit (15 minutes)",
        },
        {
            type: "dropoff",
            details:
                "7 drop-off locations: Stratosphere Casino, Hotel & Tower, Park MGM Las",
        },
    ];
    const styles = {
        timelineContainer: {
            display: "flex",
            flexDirection: "column",
            margin: "20px",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        },
        timelineItem: {
            display: "flex",
            alignItems: "flex-start",
            marginBottom: "20px",
            position: "relative",
        },
        timelineIcon: {
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
            textAlign: "center",
            lineHeight: "30px",
            marginRight: "15px",
            position: "relative",
        },
        specialIcon: {
            backgroundColor: "#f84f3e",
        },
        activityIcon: {
            backgroundColor: "#1c294d",
        },
        timelineContent: {
            borderLeft: "3px solid #f84f3e",
            paddingLeft: "15px",
            marginTop: "-5px",
        },
        specialItem: {
            // Empty object to allow additional styling if needed in future
        },
    };

    return (
        <div style={styles.timelineContainer}>
            {itinerary.map((item, index) => (
                <div
                    key={index}
                    style={{
                        ...styles.timelineItem,
                        ...(item.type === "pickup" || item.type === "dropoff"
                            ? styles.specialItem
                            : {}),
                    }}
                >
                    <div
                        style={{
                            ...styles.timelineIcon,
                            ...(item.type === "pickup" || item.type === "dropoff"
                                ? styles.specialIcon
                                : styles.activityIcon),
                        }}
                    >
                        {item.type === "pickup"
                            ? "P"
                            : item.type === "dropoff"
                            ? "G"
                            : "★"}
                    </div>
                    <div style={styles.timelineContent}>
                        {item.type === "pickup" && (
                            <div>
                                <strong>Pickup</strong>
                                <p>
                                    {item.time} {item.location}
                                </p>
                            </div>
                        )}
                        {item.type === "activity" && (
                            <div>
                                <strong>{item.title}</strong>
                                {item.time && <p>{item.time}</p>}
                                <p>{item.details}</p>
                            </div>
                        )}
                        {item.type === "dropoff" && (
                            <div>
                                <strong>Drop-off</strong>
                                <p>{item.details}</p>
                                <p>{item.more}</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ItineraryTimeline;
