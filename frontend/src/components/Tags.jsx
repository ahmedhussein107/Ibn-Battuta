import React from "react";
import "../styles/Tags.css"; // Import your CSS styles here

const Tags = ({ tags , width, height, fontSize }) => {
	return (
		<div
			className="tags-container"
			style={{ width: width, height: height, fontSize: fontSize }}
		>
			<div className="tag-header">
				<img src="/tagIcon.png" alt="" className="tag-icon" />
				<span>Tags:</span>
			</div>
			<div className="tags">
				{tags &&tags.map((tag, index) => (
					<span key={index} className="tag">
						{tag}
					</span>
				))}
			</div>
		</div>
	);
};

export default Tags;
