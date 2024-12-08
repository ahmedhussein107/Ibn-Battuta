import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Cookies from "js-cookie";
import {
	guestQuestions,
	touristQuestions,
	sellerQuestions,
	tourGuideQuestions,
	advertiserQuestions,
	governorQuestions,
	adminQuestions,
} from "../../constants/questions.constants";
import i1 from "../../assets/homepage/mapE.jpg";

const Minds = () => {
	const [openIndex, setOpenIndex] = useState(null);

	const userType = Cookies.get("userType") || "Guest";

	const questions = {
		Guest: guestQuestions,
		Tourist: touristQuestions,
		Seller: sellerQuestions,
		TourGuide: tourGuideQuestions,
		Advertiser: advertiserQuestions,
		Governor: governorQuestions,
		Admin: adminQuestions,
	};

	const toggleQuestion = (index) => {
		setOpenIndex(openIndex === index ? null : index); // Toggle or close
	};

	return (
		<div
			style={{
				position: "relative",
				width: "98vw",
				margin: "0 auto",
			}}
		>
			<h2
				style={{
					fontSize: "2.5rem",
					color: "#A0522D",
					fontWeight: "bold",
					fontFamily: "serif",
					textAlign: "center",
					zIndex: 1,
					position: "absolute",
					width: "100%",
					userSelect: "none",
					marginTop: "-7vh",
				}}
			>
				Curious Minds
			</h2>

			{/* <img
                src={i1}
                alt="Map Background"
                style={{
                    width: "98vw",
                    height: "80vh",
                    pointerEvents: "none",
                    userSelect: "none",
                }}
            /> */}

			<div
				style={{
					width: "100vw",
					height: "80vh",
					backgroundImage: `url(${i1})`,
					backgroundSize: "100% 100%",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					borderRadius: "10px",
				}}
			>
				<div
					style={{
						width: "100%",
						height: "100%",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					{questions[userType].map((item, index) => (
						<div
							key={index}
							style={{
								width: "80%",
								marginBottom: "10px",
								background: "#fff",
								padding: "0.8rem 2rem",
								borderRadius: "5px",
								boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
								transition: "height 0.2s ease-in-out",
								overflow: "hidden",
								cursor: "pointer",
							}}
							onClick={() => toggleQuestion(index)}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<summary
									style={{
										fontSize: "1.5rem",
										color: "#A0522D",
										outline: "none",
										userSelect: "none",
										listStyle: "none",
										cursor: "pointer",
										margin: 0,
									}}
								>
									{item.question}
								</summary>
								{openIndex === index ? (
									<FaChevronUp style={{ fontSize: "1.2rem", color: "#A0522D" }} />
								) : (
									<FaChevronDown
										style={{ fontSize: "1.2rem", color: "#A0522D" }}
									/>
								)}
							</div>
							<div
								style={{
									maxHeight: openIndex === index ? "200px" : "0",
									overflow: "hidden",
									transition: "max-height 0.5s ease",
								}}
							>
								<p
									style={{
										marginTop: "10px",
										fontSize: "1rem",
										color: "#555",
										padding: openIndex === index ? "10px 0" : "0",
										opacity: openIndex === index ? 1 : 0,
										transition: "opacity 0.5s ease",
									}}
								>
									{item.answer}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Minds;
