import "../styles/Accessibility.css";
import React from "react";

const Accessibility = ({
	accessibilities = ["Wheel Chairs available", "test"],
	width,
	height,
	fontSize,
}) => {
	return (
		<div
			className="accessibility-container"
			style={{ width: width, height: height, fontSize: fontSize }}
		>
			<div className="accessibility-header">
				<img
					src="/AccessibilityIcon.png"
					alt=""
					className="accessibility-icon"
				/>
				<span>Accessibility:</span>
			</div>
			<div className="accessibilities">
				{accessibilities &&
					accessibilities.map((accessibility, index) => (
						<span key={index} className="tag">
							{accessibility}
						</span>
					))}
			</div>
		</div>
	);
};

export default Accessibility;
