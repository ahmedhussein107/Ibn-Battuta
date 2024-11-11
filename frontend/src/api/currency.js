import axios from "axios";
const api_key = import.meta.env.VITE_CURRENCY_RATE_API_KEY;

const getExchangeRates = async (baseCurrency = "EGP", targetCurrency = "USD") => {
    const url = `https://v6.exchangerate-api.com/v6/${api_key}/latest/${baseCurrency}`;
    try {
        const response = await axios.get(url);
        const rate = response.data.conversion_rates[targetCurrency];
        return rate;
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
    }
};

const convertCurrency = async (amount, from, to) => {
    return Math.round(amount * (await getExchangeRates(from, to)) * 100) / 100;
};
export default convertCurrency;
