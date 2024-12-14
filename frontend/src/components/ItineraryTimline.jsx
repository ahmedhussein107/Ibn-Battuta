import React from "react";
import { useNavigate } from "react-router-dom";

const ItineraryTimeline = ({
    pickUpLocation,
    pickUpTime,
    dropOffLocation,
    activities,
}) => {
    const navigate = useNavigate();

    // Format time for display
    const formatTime = (date) => {
        const options = {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        };
        return new Date(date).toLocaleTimeString("en-US", options);
    };
    const pickupTime = formatTime(pickUpTime);

    // Handle navigation for "See More"
    const handleSeeMoreClick = (Data) => {
        window.open(`/activity-details/${Data._id}`, "_blank");
    };

    // Map activities into timeline-friendly data
    const tempActivities = !activities
        ? []
        : activities.map((activityObj) => {
              const isCustom = activityObj.activityType !== "Activity";
              const type = "activity";
              const title = activityObj.activityData.name;
              const details = `${activityObj.startTime} - ${activityObj.endTime} (Duration: ${activityObj.duration})`;

              return {
                  type,
                  title,
                  details,
                  seeMore: !isCustom ? (
                      <span
                          style={{
                              color: "blue",
                              cursor: "pointer",
                              textDecoration: "underline",
                          }}
                          onClick={() => handleSeeMoreClick(activityObj.activityData)}
                      >
                          See more
                      </span>
                  ) : null,
              };
          });

    // Combine all items into the itinerary
    const itinerary = [
        { type: "pickup", time: pickupTime, location: pickUpLocation },
        ...tempActivities,
        {
            type: "dropoff",
            details: dropOffLocation,
        },
    ];

    // Styles for the timeline
    const styles = {
        timelineContainer: {
            display: "flex",
            flexDirection: "column",
            margin: "20px",
            padding: "20px",
            borderRadius: "10px",
        },
        timelineItemContainer: {
            display: "flex",
            alignItems: "flex-start",
            position: "relative",
            marginBottom: "20px",
        },
        iconWithLine: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            marginRight: "15px",
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
        },
        specialIcon: {
            backgroundColor: "#DB9D6D",
        },
        activityIcon: {
            backgroundColor: "#DB9D6D",
        },
        timelineLine: {
            width: "6px",
            backgroundColor: "#9C4F21",
            height: "40px", // Adjust spacing between circles
            marginTop: "10px",
            marginBottom: "-10px",
        },
        timelineContent: {
            flex: 1,
            paddingLeft: "15px",
        },
    };

    // JSX structure
    return (
        <div style={styles.timelineContainer}>
            {itinerary.map((item, index) => (
                <div key={index} style={styles.timelineItemContainer}>
                    {/* Icon with line */}
                    <div style={styles.iconWithLine}>
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

                        {/* Line between icons */}
                        {index < itinerary.length - 1 && (
                            <div style={styles.timelineLine}></div>
                        )}
                    </div>

                    {/* Content */}
                    <div style={styles.timelineContent}>
                        {item.type === "pickup" && (
                            <div>
                                <strong>Pickup</strong>
                                <p>{`Time: ${item.time}.  Location: ${item.location}`}</p>
                            </div>
                        )}

                        {item.type === "activity" && (
                            <div>
                                <strong>{item.title}</strong>
                                <p>{item.details}</p>
                                {item.seeMore}
                            </div>
                        )}

                        {item.type === "dropoff" && (
                            <div>
                                <strong>Drop-off</strong>
                                <p>{`Location: ${item.details}`}</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ItineraryTimeline;
