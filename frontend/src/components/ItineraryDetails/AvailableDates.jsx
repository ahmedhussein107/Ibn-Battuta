import "../../styles/AvailableDates.css";
import { useState } from "react";
export default function AvailableDates({ dates, width, height, fontSize }) {
	const [showAll, setShowAll] = useState(false);
	const dateArray = dates || [	];

	const dateTimeArray = dateArray.map((dateObj) => {
		return {
			date: dateObj.toLocaleDateString("en-GB", {
				weekday: "short", // Adds the day prefix like "Sun"
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			}), // e.g., "05/11/2024" (adjust locale as needed)
			time: dateObj.toLocaleTimeString("en-GB", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: true,
			}), // e.g., "09:00"
		};
	});


	const displayArray = showAll ? dateTimeArray : dateTimeArray.slice(0, 6);
	const remainingCount = dateTimeArray.length - 6;
	return (
		<div
			className="available-dates-and-times-container"
			style={{ width: width, height: height, fontSize: fontSize }}
		>
			<span>{ displayArray.length === 0 ? "No " :""}Available Dates and times</span>
			<div className="dates-and-times-cards-container">
				{displayArray.map((item, index) => (
					<div key={index} className="card">
						<div className="date">
							<img src="/information.png" alt="info" />
							{item.date}
						</div>
						<div className="time">{`Time ${item.time}`}</div>
					</div>
				))}
				{!showAll && remainingCount > 0 && (
					<div className="show-more" onClick={() => setShowAll(true)}>
						See all offers (+{remainingCount} more)
					</div>
				)}
				{showAll && remainingCount > 0 && (
					<div
						className="show-more"
						onClick={() => setShowAll(false)}
					>
						See less
					</div>
				)}{" "}
			</div>
		</div>
	);
}
