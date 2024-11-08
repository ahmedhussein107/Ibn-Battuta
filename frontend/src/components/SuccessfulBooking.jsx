export default function SuccessfulBooking({ points }) {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#f9f9f9",
				padding: "10px 15px",
				borderRadius: "8px",
				boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
				fontSize: "0.9em",
				color: "#333",
				minWidth: "250px",
				margin: "0 auto",
			}}
		>
			<span
				style={{
					color: "#ff6d00",
					fontSize: "1.2em",
					marginRight: "8px",
				}}
			>
				⭐
			</span>
			<span>{points} points added to your account for booking</span>
		</div>
	);
}
