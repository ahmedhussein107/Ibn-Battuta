import React from "react";
import PopUp from "./PopUp";
const PopUpSuccess = ({ isOpen, setIsOpen, headerText, bodyText, handleOnClose = () => {} }) => {
	return (
		<PopUp
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			headerText={headerText}
			cancelText={"OK"}
			containsActionButton={false}
			handleOnClose={handleOnClose}
		>
			<div className="popup-body">
				<div
					className="popup-success-div"
					style={{ textAlign: "center", color: "var(--primary-color)" }}
				>
					<h5>⭐ {" " + bodyText + " "}⭐</h5>
				</div>
			</div>
		</PopUp>
	);
};
export default PopUpSuccess;
