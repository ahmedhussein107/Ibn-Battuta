import "../../styles/Book.css";
import Button from "../Button.jsx";
import Cookies from "js-cookie";
import { CircularProgress } from "@mui/material";
import { useCurrencyConverter } from "../../hooks/currencyHooks";
export default function Book({ price, text, onClick, width, height }) {
    const currency = Cookies.get("currency") || "EGP";
    const { isLoading, formatPrice } = useCurrencyConverter(currency);
    return (
        <div className="book-container" style={{ width: width, height: height }}>
            <span> {text}</span>
            <div className="price-button-container">
                <div className="price-container">
                    <span>From</span>
                    <span id="price ">{formatPrice(price)}</span>
                    <span>per person</span>
                </div>
                <Button
                    stylingMode="always-dark"
                    text="Book now"
                    customStyle={{
                        maxHeight: "40px",
                        borderRadius: "80px",
                        padding: "10px",
                        width: "40%",
                        minHeight: "60%",
                    }}
                    handleClick={onClick}
                />
            </div>
        </div>
    );
}
