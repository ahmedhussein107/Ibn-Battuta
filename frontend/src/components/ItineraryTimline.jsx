import React from "react";
import { useNavigate } from "react-router-dom";
const ItineraryTimeline = ({
	pickUpLocation,
	pickUpTime,
	dropOffLocation,
	activities,
}) => {
	const navigate = useNavigate();
	const formatTime = (date) => {
		const options = {
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		};
		return new Date(date).toLocaleTimeString("en-US", options);
	};
	const pickupTime = formatTime(pickUpTime);

	const handleSeeMoreClick = (Data) => {
		navigate(`/activity-details/${Data._id}`, { state: { activityData: Data } });
	};

	const tempActivities = !activities? [] :activities.map((activityObj) => {
		const isCutom = activityObj.activityType != "Activity";
		const type = "activity";
		const title = !isCutom
			? activityObj.activityData.name
			: activityObj.activityData.title;
		const details = `${activityObj.startTime} - ${activityObj.endTime} (Duration: ${activityObj.duration})`;

		return {
			type,
			title,
			details,
			seeMore:
				 !isCutom ? (
					<span
						style={{
							color: "blue",
							cursor: "pointer",
							textDecoration: "underline",
						}}
						onClick={() =>
							handleSeeMoreClick(activityObj.activityData)
						}
					>
						See more
					</span>
				) : null,
		};
	});
	const itinerary = [
		{ type: "pickup", time: pickupTime, location: pickUpLocation },
		...tempActivities,
		{
			type: "dropoff",
			details:
            dropOffLocation,
		},
	];
	const styles = {
		timelineContainer: {
			display: "flex",
			flexDirection: "column",
			margin: "20px",
			padding: "20px",
			borderRadius: "10px",
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
							...(item.type === "pickup" ||
							item.type === "dropoff"
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
									{`Time: ${item.time}.  Location: ${item.location}`} 
								</p>
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
