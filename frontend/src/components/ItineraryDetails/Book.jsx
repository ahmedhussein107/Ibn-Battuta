import "../../styles/Book.css";
import Button from "../Button.jsx";
export default function Book({ price, text, onClick }) {
	return (
		<div className="book-container">
			<span> {text}</span>
			<div className="price-button-container">
				<div className="price-container">
					<span>From</span>
					<span id="price">{price}</span>
					<span>per person</span>
				</div>
				<Button
					stylingMode="1"
					text="Book now"
					customStyle={{
						maxHeight: "40px",
						borderRadius: "80px",
					}}
					handleClick={onClick}
				/>
			</div>
		</div>
	);
}
