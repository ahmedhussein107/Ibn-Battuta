import { useHeader } from "../components/Header/HeaderContext";
import Cookies from "js-cookie";
const convert = (amount) => {
    const { currencyRates } = useHeader();
    if (!currencyRates) {
        return amount;
    }
    const convertedAmount =
        Math.round(amount * currencyRates[Cookies.get("currency") || "EGP"] * 100) / 100;
    return convertedAmount;
};
export default convert;
